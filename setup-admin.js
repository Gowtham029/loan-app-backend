const { MongoClient } = require('mongodb');

async function setupAdmin() {
  const client = new MongoClient('mongodb://admin:password123@localhost:27017/microfinance?authSource=admin');
  
  try {
    await client.connect();
    const db = client.db('microfinance');
    const users = db.collection('users');
    
    // Check if admin user already exists
    const existingAdmin = await users.findOne({ username: 'admin' });
    
    if (!existingAdmin) {
      const adminUser = {
        username: 'admin',
        email: 'admin@microfinance.com',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        status: 'active',
        department: 'IT',
        phoneNumber: '+1234567890',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await users.insertOne(adminUser);
      console.log('Admin user created successfully');
      console.log('Username: admin');
      console.log('Password: password123 (for demo purposes)');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
  } finally {
    await client.close();
  }
}

setupAdmin();