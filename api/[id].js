import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  // CORS হেডার সেট করা যাতে যেকোনো জায়গা থেকে এপিআই কল করা যায়
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // URL থেকে ID নেওয়া (যেমন: vue, react)
  const { id } = req.query;

  try {
    // data.json ফাইলের সঠিক পথ চিহ্নিত করা
    const filePath = path.join(process.cwd(), 'public', 'data.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);

    // ID অনুযায়ী ডাটা ফিল্টার করা (case-insensitive)
    const item = data.find(
      (tech) => tech.id.toLowerCase() === id.toLowerCase()
    );

    if (item) {
      return res.status(200).json(item);
    } else {
      return res.status(404).json({ message: `Technology with id '${id}' not found` });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}