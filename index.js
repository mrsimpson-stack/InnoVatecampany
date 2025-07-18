import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  await client.connect();
  const db = client.db('investpro'); // Replace with your DB name
  
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    if (req.method === 'GET') {
      // GET /api/user - Fetch user data
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(userId) },
        { projection: { 
          email: 1, 
          phone: 1, 
          status: 1,
          totalInvested: 1,
          activeInvestments: 1,
          totalEarnings: 1 
        }}
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json({
        email: user.email,
        phone: user.phone,
        status: user.status,
        totalInvested: user.totalInvested || 0,
        activeInvestments: user.activeInvestments || 0,
        totalEarnings: user.totalEarnings || 0
      });
    }
    else if (req.method === 'PUT') {
      // PUT /api/user - Update user data
      const { email, phone, currentPassword } = req.body;

      // 1. Verify current password first
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // 2. Update user info
      const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $set: { 
          email: email,
          phone: phone,
          updatedAt: new Date() 
        }}
      );

      return res.json({ 
        success: true,
        message: 'User information updated successfully'
      });
    }
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}