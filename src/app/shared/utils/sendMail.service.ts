import config from "../../config/env.config.js";
import resend from "../services/mail/mail.config.js";

function sendMail(from: string = config.defaultEmail, to: string, subject: string, html: string) {
  return resend.emails.send({
    from,
    to,
    subject,
    html,
  });
}

export default sendMail;