const { MongoClient, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/superblog';
const dbName = uri.split('/').pop().split('?')[0];

async function migrate() {
  const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
  const db = client.db(dbName);
  const posts = db.collection('posts');

  // Find all posts with string _id
  const cursor = posts.find({ _id: { $type: 'string' } });

  let migrated = 0;
  while (await cursor.hasNext()) {
    const doc = await cursor.next();
    const oldId = doc._id;
    // Only convert if the string is a valid ObjectId
    if (/^[a-fA-F0-9]{24}$/.test(oldId)) {
      const newId = new ObjectId(oldId);
      delete doc._id;
      await posts.insertOne({ ...doc, _id: newId });
      await posts.deleteOne({ _id: oldId });
      migrated++;
      console.log(`Migrated post ${oldId} -> ${newId}`);
    } else {
      console.warn(`Skipped post with non-ObjectId string _id: ${oldId}`);
    }
  }

  console.log(`Migration complete! Migrated ${migrated} posts.`);
  client.close();
}

migrate().catch(console.error); 