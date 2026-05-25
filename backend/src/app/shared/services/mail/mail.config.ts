import { Resend } from "resend";
import config from "../../../config/env.config.js";

const resend = new Resend(config.resendApiKey);

export default resend;