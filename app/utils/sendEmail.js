import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection settings
    transporter.verify(function (error) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });

    await transporter.sendMail({
      from: '"Cad\'O" <secretcado4@gmail.com>',
      to: email,
      subject,
      text,
      html
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email", error);
  }
};