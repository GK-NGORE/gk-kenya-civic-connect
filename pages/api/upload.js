import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Upload parse error', err);
      return res.status(500).json({ error: 'Upload failed' });
    }

    const saved = [];

    const normalize = (f) => {
      if (!f) return [];
      if (Array.isArray(f)) return f;
      return [f];
    };

    const fileList = normalize(files.files || files.file || files.uploads);

    for (const file of fileList) {
      const filename = path.basename(file.filepath || file.newFilename || file.originalFilename);
      const mimetype = file.mimetype || file.type || 'application/octet-stream';
      const url = `/uploads/${filename}`;
      saved.push({ url, filename, mimetype });
    }

    return res.status(200).json({ files: saved });
  });
}
