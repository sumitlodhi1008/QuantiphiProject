const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quantiphi_aichat';
  
  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log('[Database] ✅ Connected to MongoDB successfully.');
  } catch (err) {
    console.warn(`[Database] Notice: Standalone MongoDB server not detected (${err.message}).`);
    console.log('[Database] 🛡️ Activating zero-dependency In-Memory Persistence Engine (Fault-Tolerant Mode).');
    isConnected = false;
  }
};

const isDBConnected = () => isConnected;

const closeDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
  }
};

module.exports = { connectDB, isDBConnected, closeDB };
