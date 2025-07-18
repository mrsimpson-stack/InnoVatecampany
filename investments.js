import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  await client.connect();
  const db = client.db('investpro');
  
  try {
    // Verify JWT token
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    if (req.method === 'GET') {
      // GET /api/user/investments - Fetch user investments
      const investments = await db.collection('investments')
        .find({ userId: new ObjectId(userId) })
        .sort({ startDate: -1 })
        .toArray();

      return res.json(investments.map(investment => ({
        plan: investment.planName,
        amount: investment.amount,
        startDate: investment.startDate,
        endDate: investment.endDate,
        status: investment.status,
        estimatedReturn: investment.estimatedReturn
      })));
    }
    else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}