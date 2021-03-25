import express from "express";
import { hashPassword } from "./hash";
import { checkPassword } from "./hash";
import jwt from "./jwt";
import jwtSimple from "jwt-simple";
import * as entities from "./entity";
import moment from "moment";
import { getDb } from "./main";
import { Bearer } from "permit";
import * as typeorm from "typeorm";

// typeORM - setting

export async function CreateConnection() {
  await typeorm.createConnection();
  console.log("mysql connected");
}

CreateConnection();

export const routes = express.Router();

// R1: Route Guard, controlling access to DB data

const createIsLoggedIn: any = () => async (req: any, res: any, next: any) => {
  try {
    const permit = new Bearer({
      query: "access_token",
    });
    const token = permit.check(req);
    if (!token) {
      res
        .status(401)
        .json({ msg: "You do not have the access right - no token." });
    }
    const payload = jwtSimple.decode(token, jwt.jwtSecret);
    const user = await entities.Signup.getRepository().find({
      where: { Email: `${payload.id}` },
    });
    if (user) {
      req.user = user;
      console.log("another test for createIsLoggedIn, ", user);
      return next();
    } else {
      res
        .status(401)
        .json({ msg: "You do not have the access right - no record." });
    }
  } catch (e) {
    console.error(e.message);
    res.status(401).json({ msg: `You do not have the access right - ${e}.` });
  }
};

// R2: mongoDB - signUp

routes.post("/signUp/MongoDB", async (req, res) => {
  try {
    console.log("testing req.body at backend, ", req.body);
    console.log("testing 1.1.");
    if (!req.body.password) {
      console.log("testing 1.2.");
      return res.status(400).json({ error: "No password" });
    }
    console.log("testing 1.3.");
    console.log("testing 2");
    const hashedPassword = await hashPassword(`${req.body.password}`);
    await getDb()
      .collection("user")
      .insertOne({
        email: `${req.body.email}`,
        password: hashedPassword,
        clinicName: `${req.body.clinicName}`,
        phoneNo: `${req.body.phoneNo}`,
        address: `${req.body.address}`,
      });
    console.log("testing after mongoDB");
    console.log("testing hashedPassword, ", hashedPassword);
    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ error: err });
  }
});

// R3: mongoDB - signIn

routes.post("/signIn/MongoDB", async (req, res) => {
  try {
    const user = await getDb()
      .collection("user")
      .find({ email: `${req.body.email}` }, { limit: 1 })
      .toArray();
    if (user === null) {
      res.status(401).json({ error: "Incorrect username" });
    }
    const userPassword = user[0].password;
    if (!(await checkPassword(req.body.password, userPassword))) {
      res.status(401).json({ error: "Incorrect password" });
    }
    const payload = {
      id: user[0].email,
    };
    const token = jwtSimple.encode(payload, jwt.jwtSecret);
    res.json({
      token: token,
      user: user[0],
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

// R4: mySQL - signUp

routes.post("/signUp/mySQL", async (req, res) => {
  try {
    const user = await entities.Signup.getRepository().find({
      where: { Email: `${req.body.email}` },
    });
    console.log("testing user in signUp, ", user);
    if (user.length > 0) {
      res.status(401).json({ error: "Username Occupied" });
    }
    if (!req.body.password) {
      console.log("testing 1.2.");
      res.status(400).json({ error: "No password" });
    }
    const hashedPassword = await hashPassword(`${req.body.password}`);
    const tableData = await entities.Signup.getRepository().find({});
    const newID = tableData.length + 1;
    await entities.Signup.getRepository().insert({
      id: newID,
      Email: `${req.body.email}`,
      Password: hashedPassword,
      ClinicName: `${req.body.clinicName}`,
      PhoneNo: `${req.body.phoneNo}`,
      Address: `${req.body.address}`,
    });
    res.json({
      success: true,
      id: newID,
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

// R5: mySQL - login

routes.post("/signIn/mySQL", async (req, res) => {
  try {
    const user = await entities.Signup.getRepository().find({
      where: { Email: `${req.body.email}` },
    });
    if (user.length === 0) {
      res.status(401).json({ error: "Incorrect username" });
    }
    const userPassword = user[0].Password;
    if (!(await checkPassword(req.body.password, userPassword))) {
      res.status(401).json({ error: "Incorrect password" });
    }
    const payload = {
      id: user[0].Email,
    };
    const token = jwtSimple.encode(payload, jwt.jwtSecret);
    res.json({
      token: token,
      user: user[0],
    });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

// R6: mySQL - getting Record data

routes.get("/record/:clinic", createIsLoggedIn(), async (req, res) => {
  try {
    const clinic = req.params.clinic;
    console.log("testing params at backend, ", clinic);
    const tableData = await entities.Record.getRepository().find({
      where: { ClinicEmail: `${clinic}` },
    });
    console.log(JSON.stringify(tableData));
    res.json({ tableData });
  } catch (err) {
    console.error("testing err", err.message);
  }
});

// R7: mySQL - saving Record data

routes.post("/recordSaving/:clinic", async (req, res) => {
  try {
    const tableData = await entities.Record.getRepository().find({});
    console.log("testing tableData, ", tableData);
    console.log("testing tableData length, ", tableData.length);
    const newID = tableData.length + 1;
    console.log("testing newID, ", newID);
    let now = new Date();
    let formattedNowDateString = moment(now).format("YYYY-MM-DD");
    let formattedNowTime = moment(now).format("HH:mm");
    await entities.Record.getRepository().insert({
      id: newID,
      ClinicEmail: `${req.params.clinic}`,
      DocName: `${req.body.DocName}`,
      PatientName: `${req.body.PatientName}`,
      Diagnosis: `${req.body.Diagnosis}`,
      Medication: `${req.body.Medication}`,
      ConsultationFee: `${req.body.ConsultationFee}`,
      Date: formattedNowDateString,
      Time: formattedNowTime,
      FollowUp: req.body.FollowUp,
    });
    res.json({ success: true, id: newID });
  } catch (err) {
    console.error("testing err", err.message);
  }
});
