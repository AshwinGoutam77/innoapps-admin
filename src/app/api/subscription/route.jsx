import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("Innoapps");

        // Get the page number from the query parameters
        const url = new URL(req.url);
        const page = parseInt(url.searchParams.get('page')) || 1; // Default to page 1 if not provided
        const pageSize = 10;

        // Calculate the skip value for pagination
        const skip = (page - 1) * pageSize;

        // Fetch the total count of records
        const totalCount = await db.collection("subscribers").countDocuments();

        // Fetch data with pagination
        const subscribers = await db
            .collection("subscribers")
            .find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(pageSize)
            .toArray();

        return NextResponse.json({ subscribers, totalCount });
    } catch (error) {
        console.error("Failed to fetch subscribers:", error);
        return NextResponse.json(
            { message: "Failed to fetch subscribers", error: error.message },
            { status: 500 }
        );
    }
}
