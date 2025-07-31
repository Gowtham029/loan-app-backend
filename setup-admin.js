const { MongoClient } = require('mongodb');

async function setupAdmin() {
  const client = new MongoClient('mongodb://admin:password123@localhost:27017/microfinance?authSource=admin');
  
  try {
    await client.connect();
    const db = client.db('microfinance');
    const users = db.collection('users');
    
    const defaultUsers = [
      {
        username: 'admin',
        email: 'admin@microfinance.com',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin',
        status: 'active',
        department: 'IT',
        phoneNumber: '+1234567890'
      },
      {
        username: 'manager',
        email: 'manager@microfinance.com',
        firstName: 'John',
        lastName: 'Manager',
        role: 'manager',
        status: 'active',
        department: 'Operations',
        phoneNumber: '+1234567891'
      },
      {
        username: 'viewer',
        email: 'viewer@microfinance.com',
        firstName: 'Jane',
        lastName: 'Viewer',
        role: 'viewer',
        status: 'active',
        department: 'Support',
        phoneNumber: '+1234567892'
      }
    ];
    
    for (const userData of defaultUsers) {
      const existingUser = await users.findOne({ username: userData.username });
      
      if (!existingUser) {
        const user = {
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await users.insertOne(user);
        console.log(`${userData.role} user created successfully`);
        console.log(`Username: ${userData.username}`);
        console.log('Password: password123 (for demo purposes)');
      } else {
        console.log(`${userData.role} user already exists`);
      }
    }
  } catch (error) {
    console.error('Error setting up admin user:', error);
  } finally {
    await client.close();
  }
}

setupAdmin();