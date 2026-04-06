import nodemailer from "nodemailer";

function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

export async function sendOTP(email: string, otp: string) {
    const transporter = createTransporter();
    const mailOptions = {
        from: `"Pesanku App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP Verification Code",
        html: `<p>Your OTP code is <b>${otp}</b>. It will expire in 5 minutes.</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP sent to", email);
    } catch (error) {
        console.error("Failed to send OTP:", error);
        throw new Error("Failed to send OTP email");
    }
}