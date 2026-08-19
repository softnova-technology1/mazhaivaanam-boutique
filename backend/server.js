import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 Mazhai Vaanam API Server`);
      console.log(`   ├─ Port:        ${PORT}`);
      console.log(`   ├─ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   ├─ Health:      http://localhost:${PORT}/api/health`);
      console.log(`   └─ Frontend:    ${process.env.FRONTEND_URL}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
