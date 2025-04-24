import { ObjectId } from 'mongodb'; 
import { NextResponse } from 'next/server'; 
import clientPromise from '../../../lib/mongodb';


export async function GET() {
    
    try {
        const client = await clientPromise;
        const db = client.db('Innoapps');

        const blogs = await db.collection('blogs')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

            return NextResponse.json({ message: blogs }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return NextResponse.json({ message: 'Failed to fetch blogs' }, { status: 500 });
    }
}
 