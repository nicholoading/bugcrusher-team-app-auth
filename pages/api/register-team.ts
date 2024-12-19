import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail", // Or your preferred email service
  auth: {
    user: process.env.EMAIL_USER!, // Your email address
    pass: process.env.EMAIL_PASS!, // Your email password
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { teamName, leaderName, email } = req.body;

    try {
      // Generate a mock verification link
      const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-team?teamName=${encodeURIComponent(
        teamName
      )}&leaderName=${encodeURIComponent(leaderName)}&email=${encodeURIComponent(email)}`;

      // Send email to the admin for verification
      await transporter.sendMail({
        from: `"Team Registration" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL!,
        subject: "New Team Registration Pending Verification",
        html: `
          <p>A new team has registered:</p>
          <ul>
            <li><strong>Team Name:</strong> ${teamName}</li>
            <li><strong>Leader Name:</strong> ${leaderName}</li>
            <li><strong>Email:</strong> ${email}</li>
          </ul>
          <p>Click the link below to verify the team:</p>
          <a href="${verificationLink}">${verificationLink}</a>
        `,
      });

      res.status(200).json({ message: "Team registration email sent to admin for verification." });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send verification email." });
    }
  } else {
    res.status(405).json({ error: "Method not allowed." });
  }
}
