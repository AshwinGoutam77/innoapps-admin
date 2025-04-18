import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import { NextResponse } from 'next/server';


export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('Innoapps');

        const blogs = await db.collection('blogs')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(blogs);
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return NextResponse.json({ message: 'Failed to fetch blogs' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { title, category, description, imageUrl,isActive} = body;

        if (!title || !category || !description || !imageUrl) {
            return new Response(JSON.stringify({ message: 'Missing fields' }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('Innoapps');

        const result = await db.collection('blogs').insertOne({
            title,
            category,
            description,
            imageUrl,
            isActive,
            createdAt: new Date()
        });

        return new Response(JSON.stringify({ message: 'Blog added', id: result.insertedId }), { status: 201 });

    } catch (error) {
        console.error('Failed to add blog:', error);
        return new Response(JSON.stringify({ message: 'Failed to add blog', error: error.message }), { status: 500 });
    }
}


export async function PUT(req) {
    const body = await req.json();
    const { id, title, category, description, imageUrl } = body;

    if (!id) return new Response(JSON.stringify({ message: 'Missing blog ID' }), { status: 400 });

    try {
        const client = await clientPromise;
        const db = client.db('Innoapps');

        await db.collection('blogs').updateOne(
            { _id: new ObjectId(id) },
            { $set: { title, category, description, imageUrl } }
        );

        return new Response(JSON.stringify({ message: 'Blog updated' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Failed to update blog', error }), { status: 500 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return new Response(JSON.stringify({ message: 'Missing blog ID' }), { status: 400 });

    try {
        const client = await clientPromise;
        const db = client.db('Innoapps');

        await db.collection('blogs').deleteOne({ _id: new ObjectId(id) });

        return new Response(JSON.stringify({ message: 'Blog deleted' }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Failed to delete blog', error }), { status: 500 });
    }
}

