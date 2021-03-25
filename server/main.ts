//1. Basic Config

import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";
import bodyParser from "body-parser";
import { routes } from './routes';

dotenv.config();
const app = express();
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening to ${PORT} port.`);
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 2. mongoose config

const url: any = process.env.mongoURI;
const database = process.env.DB;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let db: any;

setTimeout(async function () {
  await client.connect();
  console.log("Mongodb connected.");
  db = client.db(database);
}, 0);

export function getDb() {
  return db;
}

//3. Routes

app.use(cors());
app.use(routes)
app.get("/", (req, res) => {
  res.json({ msg: "This is dummy get" });
});

