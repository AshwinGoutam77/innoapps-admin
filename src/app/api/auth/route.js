 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';  
import clientPromise from '../../lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;  
const JWT_EXPIRY = process.env.JWT_EXPIRY;  

export async function POST(req) {
    try {
        if (!JWT_SECRET || !JWT_EXPIRY) {
            return new Response(JSON.stringify({ message: 'Server misconfiguration' }), { status: 500 });
        }
        const body = await req.json();
        const { name,email, password } = body;

        if (!name,!email || !password) {
            return new Response(JSON.stringify({ message: 'Missing fields' }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('Innoapps');

        const existingUser = await db.collection('admins').findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'Admin already exists' }), { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await db.collection('admins').insertOne({
            name,
            email,
            password: hashedPassword,
            createdAt: new Date()
        });

        const token = jwt.sign(
            { id: result.insertedId, email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );

        return new Response(JSON.stringify({
            message: 'Admin registered',
            token,
            user: { id: result.insertedId, email }
        }), { status: 201 });

    } catch (error) {
        console.error('Failed to register admin:', error);
        return new Response(JSON.stringify({ message: 'Failed to register admin', error: error.message }), { status: 500 });
    }
} 