import clientPromise from '../../../lib/mongodb';

export async function POST(req) {
    try {
        const { name } = await req.json();

        if (!name) {
            return new Response(JSON.stringify({ message: "Category name required" }), { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db("Innoapps");

        // Avoid duplicates
        const existing = await db.collection("categories").findOne({ name });
        if (existing) {
            return new Response(JSON.stringify({ message: "Category already exists" }), { status: 409 });
        }

        const result = await db.collection("categories").insertOne({ name });
        return new Response(JSON.stringify({ message: "Category added", id: result.insertedId }), { status: 201 });
    } catch (error) {
        console.error("Error creating category:", error);
        return new Response(JSON.stringify({ message: "Server error", error: error.message }), { status: 500 });
    }
}

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("Innoapps");

        const categories = await db.collection("categories").find().toArray();
        return new Response(JSON.stringify({ categories }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error fetching categories" }), { status: 500 });
    }
}
