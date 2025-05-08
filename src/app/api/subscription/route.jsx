import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        const client = await clientPromise;
        const db = client.db("Innoapps");

        let filter = {};
        const now = new Date();

        if (startDateParam && endDateParam) {
            const start = new Date(startDateParam);
            const end = new Date(endDateParam);

            // ✅ Fix: Set end time to end of day
            end.setHours(23, 59, 59, 999);

            filter.createdAt = {
                $gte: start,
                $lte: end,
            };
        } else {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);

            filter.createdAt = {
                $gte: lastMonth,
                $lte: now,
            };
        }

        const blogs = await db
            .collection("subscribers")
            .find(filter)
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

    if (!id) {
        return new Response(JSON.stringify({ message: "Missing blog ID" }), {
            status: 400,
        });
    }

    try {
        const client = await clientPromise;
        const db = client.db("Innoapps");

        await db.collection("subscribers").deleteOne({ _id: new ObjectId(id) });

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
