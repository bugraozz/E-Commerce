import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { path: filePath } = req.query;

    if (!filePath) {
        return res.status(400).json({ error: "No file path provided" });
    }

    // Construct full file path
    const fullPath = path.join(process.cwd(), "/public/uploads", ...filePath);

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
        return res.status(404).json({ error: "File not found" });
    }

    // Get the file extension
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = "application/octet-stream"; // Default content type

    // Set correct content type based on file extension
    if ([".jpg", ".jpeg"].includes(ext)) contentType = "image/jpeg";
    if ([".png"].includes(ext)) contentType = "image/png";
    if ([".gif"].includes(ext)) contentType = "image/gif";
    if ([".webp"].includes(ext)) contentType = "image/webp";

    res.setHeader("Content-Type", contentType);

    // Stream the file to the response
    fs.createReadStream(fullPath).pipe(res);
}