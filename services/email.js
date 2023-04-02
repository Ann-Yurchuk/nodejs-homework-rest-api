const nodemailer = require("nodemailer");
const pug = require("pug");
const path = require("path");
const { convert } = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `Anna <${process.env.EMAIL_FROM}>`;
  }

  _initTransport() {
    // if (process.env.NODE_ENV === "development") {
      return nodemailer.createTransport({
        service: "SendGrid",
        auth: {

          pass: process.env.SENDGRID_API_KEY,
        },
      });
    // }

    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USERNAME,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
    }
    
    

  async _send(template, subject) {
    const html = pug.renderFile(
      path.join(__dirname, "..", "views", "emails", "layout", `${template}.pug`),
      {
        name: this.name,
        url: this.url,
        subject,
      }
    );

    const emailConfig = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: convert(html),
    };

    await this._initTransport().sendMail(emailConfig);
  }

  async sendHello() {
    await this._send("hello", "Welcome to our super service!");
  }

  async sendPasswordreset() {
    await this._send("passreset", "Password reset instractions...");
  }
};
