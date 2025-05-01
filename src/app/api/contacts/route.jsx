import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("Innoapps");

        const blogs = await db
            .collection("contacts")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json(blogs);
    } catch (error) {
        console.error("Failed to fetch blogs:", error);
        return NextResponse.json(
            { message: "Failed to fetch blogs", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
        return new Response(JSON.stringify({ message: "Missing blog ID" }), {
            status: 400,
        });

    try {
        const client = await clientPromise;
        const db = client.db("Innoapps");

        await db.collection("contacts").deleteOne({ _id: new ObjectId(id) });

        return new Response(JSON.stringify({ message: "Blog deleted" }), {
            status: 200,
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete blog", error }),
            { status: 500 }
        );
    }
}
