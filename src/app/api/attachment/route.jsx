import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");

    if (!filename) {
        return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }

    const filePath = process.platform === "win32"
        ? path.join("D:\\tmp", filename)
        : path.join("/tmp", filename);

    try {
        const fileBuffer = await fs.promises.readFile(filePath);
        const ext = path.extname(filename).toLowerCase();

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                "Content-Type": getMimeType(ext),
                "Content-Disposition": `inline; filename="${filename}"`,
            },
        });
    } catch (err) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
}

function getMimeType(ext) {
    switch (ext) {
        case ".pdf":
            return "application/pdf";
        case ".jpg":
        case ".jpeg":
            return "image/jpeg";
        case ".png":
            return "image/png";
        case ".docx":
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        default:
            return "application/octet-stream";
    }
}
