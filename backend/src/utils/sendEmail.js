import { BrevoClient } from "@getbrevo/brevo";
import { Config } from "../config/env.js";
const brevo = new BrevoClient({
  apiKey: Config.BREVO_API_KEY,
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const result = await brevo.transactionalEmails.sendTransacEmail({
      subject: subject,
      htmlContent: html || `<p>${text}</p>`,
      textContent: text,
      sender: {
        name: "AI Chatbot",
        email: Config.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to }],
    });

    console.log("✅ Email sent successfully via Brevo. Result:", result);
    return result;
  } catch (error) {
    console.error("❌ Brevo Email Error:", error.message);
    throw new Error("Failed to send verification email");
  }
};
