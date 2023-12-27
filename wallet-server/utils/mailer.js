const nodemailer = require("nodemailer");

const mailSender = {
  sendGmail: function (param) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      prot: 587,
      host: "smtp.gmlail.com",
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAILER_ID,
        pass: process.env.MAILER_PASSWORD,
      },
    });
    // 메일 옵션
    var mailOptions = {
      from: process.env.MAILER_ID,
      to: param.toEmail,
      subject: param.subject,
      html: param.html,
    };

    let result = transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  },
};

module.exports = mailSender;
