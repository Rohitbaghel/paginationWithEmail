const express = require("express");

const router = express.Router();

const users = require("../model/user.model");

const sendMails = require("../utilities/send-mail");

router.get("", async (req, res) => {
  const page = +req.query.page || 1;
  const size = +req.query.size || 10;

  const skip = (page - 1) * size;
  const totalPage = Math.ceil((await users.find().countDocuments()) / size);
  const user = await users.find().skip(skip).limit(size).lean().exec();
  res.json({ user, totalPage });
});

router.get("/:id", async (req, res) => {
  const user = await users.findbyid().lean().exec();
  res.send(user);
});


router.post("", async (req, res) => {
  const user = await users.create(req.body);
  const array = ["avdeshpal@gmail.com","dharmeshYadav@gmail.com","SurajKarosiya@gmail.com","aashuGadariya@gmail.com","Aaru@gmailcom"]

  const admin_string = array.join(",")
  sendMails(
    "baghel.rohit99@gmail.com",
    [admin_string,`${req.body.email}`],
    `Welcome to ABC system ${req.body.first_name} ${req.body.last_name}`,
    ` Hi ${req.body.first_name}, Please confirm your email address`,
    `<h1>Hi ${req.body.first_name}, Please confirm your email address</h1>`
  );
  res.send(user);
});

router.patch("/:id", async (req, res) => {
  const user = await users.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.send(user);
});

router.delete("/:id", async (req, res) => {
  const user = await users.findByIdAndDelete(req.params.id).lean().exec();
  res.send(user);
});

module.exports = router;
