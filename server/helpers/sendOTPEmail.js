import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
import ejs from "ejs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filenamme = fileURLToPath(import.meta.url);
const __dirname = dirname(__filenamme);
const sendOTPEmail = async ({ to, username, otp }) => {
  try {
    const templatePath = join(
      __dirname,
      "../email-template/verificationEmail.ejs"
    );
    const htmlContent = await ejs.renderFile(templatePath, {
      username,
      otp,
      logoUrl:
        process.env.COMPANY_LOGO_URL ||
        "https://t3.ftcdn.net/jpg/03/19/15/80/360_F_319158029_4JKXm8ZJy7BaaciR3SB6ZuGxL1mVGPRA.jpg",
      year: new Date().getFullYear(),
    });

    await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: to,
      subject: "Verify Your Email",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendOTPEmail;
