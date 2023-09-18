const process = require("../../nodemon.json");
const nodemailer = require("nodemailer");
const emailInvaite = require("./emailInvite");
const emailVoteResponce = require("./emailVoteResponce");
const emailSchedule = require("./emailSchedule");

const sendEmail = (creator, users, type, date, hours) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.GOOGLE_PASSWORD}`,
    },
  });
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    const mailOptions = {
      from: `${process.env.EMAIL}`,
      to: `${element.email}`,
      subject: `Session Started`,
      html:
        type === "invites"
          ? emailInvaite(creator, element.name)
          : type !== "schedule"
          ? emailVoteResponce(creator)
          : emailSchedule(
              creator,
              new Date(date).getDate() +
                "/" +
                (new Date(date).getMonth() * 1 + 1),
              `${hours}:00`
            ),
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  }
};
module.exports = sendEmail;
