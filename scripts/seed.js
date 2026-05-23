const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Load .env.local if present (so you can put MONGODB_URI in the file)
try {
  const envPath = path.resolve(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf8');
    env.split(/\r?\n/).forEach((line) => {
      const m = line.match(/^([^=]+)=(.*)$/);
      if (m) {
        const key = m[1].trim();
        let val = m[2].trim();
        // strip surrounding quotes
        if ((val.startsWith("\"") && val.endsWith("\"")) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    });
  }
} catch (err) {
  // ignore
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kenya-civic-app';

async function main() {
  await mongoose.connect(MONGODB_URI, { dbName: 'kenya-civic-app' });
  console.log('Connected to DB');

  const userSchema = new mongoose.Schema({ username: String, email: String, password: String }, { timestamps: true });
  const postSchema = new mongoose.Schema({ author: mongoose.Schema.Types.ObjectId, content: String, images: [String], videos: [String], files: Array, createdAt: Date }, { timestamps: true });
  const reportSchema = new mongoose.Schema({ author: mongoose.Schema.Types.ObjectId, governmentSection: String, title: String, description: String, status: String, attachments: Array, createdAt: Date }, { timestamps: true });

  const User = mongoose.model('User', userSchema);
  const Post = mongoose.model('Post', postSchema);
  const Report = mongoose.model('Report', reportSchema);

  await User.deleteMany({});
  await Post.deleteMany({});
  await Report.deleteMany({});

  const password = await bcrypt.hash('password123', 10);

  const user = await User.create({ username: 'demo', email: 'demo@example.com', password });

  await Post.create({ author: user._id, content: 'Welcome to Kenya Civic Voice! This is a seeded post.', images: [], videos: [], files: [], createdAt: new Date() });

  await Report.create({ author: user._id, governmentSection: 'presidency', title: 'Seeded report', description: 'This is a seeded report for testing.', status: 'submitted', attachments: [], createdAt: new Date() });

  console.log('Seed complete');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
