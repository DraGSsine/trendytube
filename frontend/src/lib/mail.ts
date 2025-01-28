"use server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_KEY);
export const sendEmail = async (email: string, name?: string) => {
  // check if the email is valid
  if (!email || !email.includes("@") || !email.includes("."))
    return { err: "Invalid email" };

  try {
    resend.emails.send({
      from: "no-reply@saaskit.com",
      to: email,
      subject: "Welcome to Saaskit",
      html: `Hi ${name} welcome to Saaskit!`,
    });
    return { err: null };
  } catch (err) {
    console.error(err);
    return { err: "Failed to send email" };
  }
};
