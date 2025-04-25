import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import clientPromise from '../../../lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return new Response(JSON.stringify({ message: 'Missing email or password' }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('Innoapps');

        const user = await db.collection('admins').findOne({ email });

        if (!user) {
            return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return new Response(JSON.stringify({ message: 'Invalid email or password' }), { status: 401 });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return new Response(JSON.stringify({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }), { status: 200 });

    } catch (error) {
        console.error('Login error:', error);
        return new Response(JSON.stringify({ message: 'Login failed', error: error.message }), { status: 500 });
    }
}
