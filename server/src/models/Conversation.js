const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Standard Mongoose Schema for MongoDB persistence
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tone: {
      type: String,
      enum: ['Professional', 'Casual', 'Concise'],
      default: 'Professional',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'guest_user_quantiphi',
      index: true,
    },
    title: {
      type: String,
      default: 'New Chat',
      trim: true,
    },
    tone: {
      type: String,
      enum: ['Professional', 'Casual', 'Concise'],
      default: 'Professional',
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ updatedAt: -1 });

const MongoConversation = mongoose.model('Conversation', conversationSchema);

// File-based Persistent Fallback Store (Saves to disk if MongoDB is not running)
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'conversations.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('[Storage] Warning creating data dir:', err.message);
  }
}

// Load initial store from file if exists
const loadDiskStore = () => {
  const store = new Map();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          store.set(item._id.toString(), item);
        });
      }
    }
  } catch (err) {
    console.warn('[Storage] Notice reading conversations file:', err.message);
  }
  return store;
};

const diskStore = loadDiskStore();

const syncToDisk = () => {
  try {
    const list = Array.from(diskStore.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Error saving conversations to disk:', err.message);
  }
};

class FileConversationDoc {
  constructor(data = {}) {
    this._id = (data._id || `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`).toString();
    this.userId = data.userId || 'guest_user_quantiphi';
    this.title = data.title || 'New Chat';
    this.tone = data.tone || 'Professional';
    this.messages = (data.messages || []).map((m) => ({
      _id: (m._id || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`).toString(),
      role: m.role,
      content: m.content,
      tone: m.tone || 'Professional',
      timestamp: m.timestamp || new Date(),
    }));
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  async save() {
    this.updatedAt = new Date();
    diskStore.set(this._id.toString(), this);
    syncToDisk();
    return this;
  }
}

// Mock QueryBuilder supporting .sort().select() and thenable
class MockQuery {
  constructor(items) {
    this.items = [...items];
  }

  sort(criteria) {
    this.items.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return this;
  }

  select(fields) {
    return this;
  }

  then(resolve, reject) {
    resolve(this.items);
  }

  catch(reject) {
    // noop
  }
}

/**
 * Resilient Repository wrapper that delegates to MongoDB when available
 * or to the File-based Persistent Store when standalone MongoDB is unconfigured.
 */
class ConversationRepository {
  constructor(data) {
    if (mongoose.connection.readyState === 1) {
      return new MongoConversation(data);
    }
    return new FileConversationDoc(data);
  }

  static find(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongoConversation.find(query);
    }
    const items = Array.from(diskStore.values());
    return new MockQuery(items);
  }

  static async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return MongoConversation.findById(id);
    }
    const cleanId = id?.toString();
    const item = diskStore.get(cleanId);
    if (!item) return null;
    return new FileConversationDoc(item);
  }

  static async findByIdAndDelete(id) {
    if (mongoose.connection.readyState === 1) {
      return MongoConversation.findByIdAndDelete(id);
    }
    const cleanId = id?.toString();
    const exists = diskStore.has(cleanId);
    if (exists) {
      diskStore.delete(cleanId);
      syncToDisk();
      return { _id: cleanId };
    }
    return null;
  }

  static async deleteMany(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongoConversation.deleteMany(query);
    }
    const count = diskStore.size;
    diskStore.clear();
    syncToDisk();
    return { deletedCount: count };
  }
}

module.exports = ConversationRepository;
