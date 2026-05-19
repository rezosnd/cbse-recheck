const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://rehansuman41008_db_user:xqTtrr1vDGhKx4AU@cluster0.arrf3h.mongodb.net/?appName=Cluster0';

async function resetDatabase() {
  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully!');

    const collections = ['applications', 'payments', 'messages', 'users'];
    const db = mongoose.connection.db;

    for (const colName of collections) {
      const list = await db.listCollections({ name: colName }).toArray();
      if (list.length > 0) {
        console.log(`Clearing collection: ${colName}...`);
        await db.collection(colName).deleteMany({});
        console.log(`Collection ${colName} cleared successfully!`);
      } else {
        console.log(`Collection ${colName} does not exist. Skipping.`);
      }
    }

    console.log('\n=============================================');
    console.log('✅ DATABASE RESET COMPLETED SUCCESSFULLY!');
    console.log('All test applications, payments, and users are wiped.');
    console.log('Your platform is 100% clean and ready for production!');
    console.log('=============================================\n');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

resetDatabase();
