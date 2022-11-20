/**********************************REQUIRE LIBARARY AND FILE**********************************/
const authorModel = require("../models/authorModels");
const jwt = require("jsonwebtoken");

/******************************************VALIDATION*****************************************/
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

/*****************************************CREATE AUTHOR***************************************/
const createAuthor = async function (req, res) {
  try {
    let data = req.body;

    if (!Object.keys(data).length)
      return res.status(400).send({ status: false, msg: "Please Provides the Author Details" });

    if (!isValid(data.fname))
      return res.status(400).send({ status: false, msg: "FirstName is Required" });

    if (!isValid(data.lname))
      return res.status(400).send({ status: false, msg: "LastName is Required" });

    if (!data.fname.match(/^[a-zA-Z]+$/))
      return res.status(400).send({ status: false, msg: "Invalid firstName" });

    if (!data.lname.match(/^[a-zA-Z]+$/))
      return res.status(400).send({ status: false, msg: "Invalid lastName" });

    if (!isValid(data.title))
      return res.status(400).send({ status: false, msg: "Title is Required" });

    if (["Mr", "Mrs", "Miss"].indexOf(data.title) == -1)
      return res.status(400).send({status: false, data: "Enter a valid title Mr or Mrs or Miss ",});

    if (!isValid(data.email))
      return res.status(400).send({ status: false, msg: "EmailId is Required" });

    if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email))
      return res.status(400).send({ status: false, msg: "Email-Id is invalid" });

    if (!isValid(data.password))
      return res.status(400).send({ status: false, msg: "password is Required" });

    let emailCheck = await authorModel.findOne({ email: data.email });

    if (emailCheck)
      return res.status(400).send({ status: false, msg: "Email-Id already Registerd" });

    let saveData = await authorModel.create(data);

    res.status(201).send({status: true,msg: "Author Created Sucessfully",data: saveData,});
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

/*********************************LOGIN AND TOKEN GENERATION**********************************/
const login = async function (req, res) {
  try {
    let data = req.body;

    if (!Object.keys(data).length)
      return res.status(400).send({ status: false, msg: "Please Provide the Correct Login Details", });

    if (!isValid(data.email))
      return res.status(401).send({ status: false, msg: "EmailId is required" });

    if (!isValid(data.password))
      return res.status(401).send({ status: false, msg: "Password is required" });

    if (!/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(data.email))
      return res.status(400).send({ status: false, msg: "email Id is invalid" });

    let user = await authorModel.findOne({
      email: data.email,
      password: data.password,
    });

    if (!user)
      return res.status(401).send({ status: false, msg: "EmailId or Password incorrect" });

    let token =await jwt.sign(
      {
        userId: user._id.toString(),
        iat: Math.floor(Date.now() / 100),
        exp: Math.floor(Date.now() / 100) + 24 * 60 * 60,
      },
      "IUBGIU22NKJWWEW89NO2ODWOIDH2"
    );

    res.setHeader("x-api-key", token);

    res.status(201).send({ status: true, msg: "Author login successful!!", token });
  } catch (err) {
    res.status(500).send({ status: false, msg: err.message });
  }
};

/*********************************PUBLICALLY METHODS******************************************/
module.exports = { createAuthor, login };
