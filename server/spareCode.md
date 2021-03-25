  // 1. main.ts, signup Check
  
  const user = await getDb()
    .collection("user")
    .find({ email: `${req.body.email}` });
    if (user) {
      console.log('testing 1.4.')
      return res.status(400).json({ error: "Email already exists" });
    }



    // 2. record screen

        <Calendar
          style={styles.calendar}
          markedDates={{
            "2021-03-01": {
              dots: [vacation, massage, workout],
              selected: true,
              selectedColor: "red",
            },
            "2021-03-05": { dots: [massage, workout], disabled: true },
          }}
          markingType={"multi-dot"}
        />

        <CalendarList
        horizontal={true} 
        pagingEnabled={true}
        style={styles.calendar}
      />




// 4.0. Route Guard, safeguarding access to DB data

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

// 4.1. mongoDB - signUp

app.post("/signUp/MongoDB", async (req, res) => {
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

//4.2. mongoDB - signIn

app.post("/signIn/MongoDB", async (req, res) => {
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

// 4.3. mySQL - signUp

app.post("/signUp/mySQL", async (req, res) => {
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

// 4.4. mySQL - login

app.post("/signIn/mySQL", async (req, res) => {
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

// 4.5. mySQL - getting Record data

app.get("/record/:clinic", createIsLoggedIn(), async (req, res) => {
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

// 4.6 mySQL - saving Record data

app.post("/recordSaving/:clinic", async (req, res) => {
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

// import { hashPassword } from "./hash";
// import { checkPassword } from "./hash";
// import jwt from "./jwt";
// import jwtSimple from "jwt-simple";
// import * as typeorm from "typeorm";
// import * as entities from "./entity";
// import moment from "moment";
// import { Bearer } from "permit";

// 3. TypeORM Config

// export async function CreateConnection() {
//   // typeORM - setting 1
//   await typeorm.createConnection();
//   console.log("mysql connected");
// }

// CreateConnection(); // typeORM - setting 1