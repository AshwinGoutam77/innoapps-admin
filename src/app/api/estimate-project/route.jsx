import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const client = await clientPromise;
        const db = client.db("Innoapps");

        const { searchParams } = new URL(req.url);
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const query = {};

        // Apply date filtering if both startDate and endDate are provided
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate), // Start date (inclusive)
                $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)) // End date (inclusive)
            };
        }

        const estimate_project = await db
            .collection("estimate_project")
            .find(query)
            .sort({ createdAt: -1 }) // Sort by createdAt, descending
            .toArray();

        return NextResponse.json(estimate_project);
    } catch (error) {
        console.error("Failed to fetch estimate_project:", error);
        return NextResponse.json(
            { message: "Failed to fetch estimate_project", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id)
        return new Response(JSON.stringify({ message: "Missing subscriber ID" }), {
            status: 400,
        });

    try {
        const client = await clientPromise;
        const db = client.db("Innoapps");

        await db.collection("estimate_project").deleteOne({ _id: new ObjectId(id) });

        return new Response(JSON.stringify({ message: "Subscriber deleted" }), {
            status: 200,
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to delete subscriber", error }),
            { status: 500 }
        );
    }
}
