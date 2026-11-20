const mongoose = require('mongoose');

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

// In-Memory Fallback Store (Used when standalone MongoDB server is not running)
const memoryStore = new Map();

class InMemoryConversationDoc {
  constructor(data = {}) {
    this._id = data._id || `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.title = data.title || 'New Chat';
    this.tone = data.tone || 'Professional';
    this.messages = (data.messages || []).map((m) => ({
      _id: m._id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
    memoryStore.set(this._id.toString(), this);
    return this;
  }
}

/**
 * Resilient Repository wrapper that delegates to MongoDB when available
 * or to the In-Memory Store when standalone MongoDB is unconfigured.
 */
class ConversationRepository {
  constructor(data) {
    if (mongoose.connection.readyState === 1) {
      return new MongoConversation(data);
    }
    return new InMemoryConversationDoc(data);
  }

  static async find() {
    if (mongoose.connection.readyState === 1) {
      return MongoConversation.find();
    }
    // Return mock chainable object
    const items = Array.from(memoryStore.values()).sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    return {
      sort: () => ({
        select: () => items,
      }),
    };
  }

  static async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return MongoConversation.findById(id);
    }
    const item = memoryStore.get(id?.toString());
    return item || null;
  }

  static async findByIdAndDelete(id) {
    if (mongoose.connection.readyState === 1) {
      return MongoConversation.findByIdAndDelete(id);
    }
    const exists = memoryStore.has(id?.toString());
    if (exists) {
      memoryStore.delete(id.toString());
      return { _id: id };
    }
    return null;
  }

  static async deleteMany(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongoConversation.deleteMany(query);
    }
    memoryStore.clear();
    return { deletedCount: memoryStore.size };
  }
}

module.exports = ConversationRepository;
