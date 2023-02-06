const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.DATABASE_URL;
console.log(uri, "ini uri");
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi:ServerApiVersion.v1
});

let db = null;

function clientDB() {
  return db;
}

function getClient(){
  return client
}

async function connectDB() {
  try {
    await client.connect();
    let dbName = "WanderiaTest"
    if (process.env.NODE_ENV !== "test"){
      dbName = "Wanderia"
    } 
    console.log(dbName, "db ku");
    const database = await client.db(dbName);
    console.log(database, "ini database");
    db = database;
    return database;
  } catch (err) {
    console.log(err, "log error db");
    await client.close();
    throw err;
  }
}

module.exports = { connectDB, clientDB, getClient };