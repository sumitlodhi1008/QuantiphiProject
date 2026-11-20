const path = require('path');
// Load environment variables from .env in server directory or root
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
if (!process.env.GEMINI_API_KEY) {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 Quantiphi AI Chat Assistant Server Running`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🤖 Gemini Configured: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO (Fallback Active)'}`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
