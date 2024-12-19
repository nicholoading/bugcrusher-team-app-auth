import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { teamName, leaderName, email } = req.query;

    if (!teamName || !leaderName || !email) {
      return res.status(400).json({ error: "Invalid verification data." });
    }

    try {
      // Send a confirmation email to the team
      await transporter.sendMail({
        from: `"Team Registration" <${process.env.EMAIL_USER}>`,
        to: email as string,
        subject: "Team Verification Approved",
        html: `
          <p>Hi ${leaderName},</p>
          <p>Your team "<strong>${teamName}</strong>" has been approved by the admin.</p>
          <p>Welcome to the event!</p>
        `,
      });

      res.status(200).send("Team verified and confirmation email sent.");
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send confirmation email." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
