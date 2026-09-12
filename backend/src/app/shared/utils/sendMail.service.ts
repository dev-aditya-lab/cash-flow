import config from "../../config/env.config.js";
import resend from "../services/mail/mail.config.js";

async function sendMail(from: string = config.defaultEmail, to: string, subject: string, html: string) {
  const { data, error } = await resend.emails.send({
    from,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[Resend Mail Error]:", error);
    throw new Error(error.message || "Failed to send email");
  }

  return data;
}

export default sendMail;