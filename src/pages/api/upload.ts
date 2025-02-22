import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '15mb', // Increase the size limit to 15MB
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const form = formidable({
      multiples: true,
      uploadDir: uploadDir,
      keepExtensions: true,
      maxFileSize: 15 * 1024 * 1024, // 15MB
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(500).json({ error: 'Dosya yüklenirken bir hata oluştu.' });
      }

      const uploadedFiles = Array.isArray(files.file) ? files.file : [files.file];
      const filePaths = uploadedFiles.map((file) => {
        if (!file) {
          return res.status(500).json({ error: 'Dosya yüklenirken bir hata oluştu.' });
        }

        const timestamp = Date.now();
        const newFileName = `${timestamp}-${file.originalFilename}`;
        const newFilePath = path.join(uploadDir, newFileName);

        try {
          fs.renameSync(file.filepath, newFilePath);
        } catch (renameError) {
          console.error('File rename error:', renameError);
          return res.status(500).json({ error: 'Dosya yeniden adlandırılırken bir hata oluştu.' });
        }

        return `/uploads/${newFileName}`;
      });

      res.status(200).json({ filePaths });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
