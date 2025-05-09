// /pages/api/attachment.js (or .ts)
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    const { filename } = req.query;

    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }

    const filePath = path.resolve(process.cwd(), 'public/uploads', filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }

    const fileStream = fs.createReadStream(filePath);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

    return fileStream.pipe(res);
}
