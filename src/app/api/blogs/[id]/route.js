import { ObjectId } from 'mongodb';
import clientPromise from '../../../lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { id } = params;

    if (!id) {
        return NextResponse.json({ message: 'Missing blog ID' }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db('Innoapps');

        const blog = await db.collection('blogs').findOne({ _id: new ObjectId(id) });

        if (!blog) {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }

        return NextResponse.json(blog, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch blog:', error);
        return NextResponse.json({ message: 'Failed to fetch blog', error: error.message }, { status: 500 });
    }
}
export async function PUT(req, { params }) {
    const {id} = params;

    if (!id) {
        return NextResponse.json({ message: 'Missing blog ID' }, { status: 400 });
    }

    try {
        const { isActive } = await req.json();
        const client = await clientPromise;
        const db = client.db('Innoapps');  
        if(typeof isActive === "undefined"){
            return NextResponse.json({ message: 'Please provide the blog status' }, { status: 404 });  
        } 
        const blog=await db.collection('blogs').updateOne(
            { _id: new ObjectId(id) },
            { $set: { isActive } }
        );


        if (!blog) {
            return NextResponse.json({ message: 'Blog not found' }, { status: 404 });
        }
        return new Response(JSON.stringify({ message: 'Blog updated' }), { status: 200 }); 
    } catch (error) {
        console.error('Failed to fetch blog:', error);
        return NextResponse.json({ message: 'Failed to fetch blog', error: error.message }, { status: 500 });
    }
}


