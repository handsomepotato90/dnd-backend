const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://Handsomepotato:8VzohWGvbVvbFoyz@dnd.mcdpizu.mongodb.net/?retryWrites=true&w=majority";

const createProduct = async (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    ac: req.body.ac,
  };
  const client = new MongoClient(url);

  console.log(newProduct);
  try {
    await client.connect();
    const db = client.db();
    const result = await db.collection("monsters").insertOne(newProduct);
  } catch (error) {
    return res.json({ message: "No data to store!" });
  }
  client.close();
  res.json(newProduct);
};

const getProduct = async (req, res, next) => {
  const client = new MongoClient(url);
  let monster;
  try {
    await client.connect();
    const db = client.db();
    monster = await db.collection('monsters').find().toArray();
  } catch (error) {
    return res.json({ message: "Can't get what you asked for!" });
  }
  client.close();
  res.json(monster);
};

exports.createProduct = createProduct;
exports.getProduct = getProduct;
