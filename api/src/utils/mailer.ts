import mailer from "nodemailer";

const transporter = mailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

export const sendContactEmail = async (email: string, name: string, message: string) => {
    try {
        await transporter.sendMail({
            from: email,
            to: process.env.MAIL_USER,
            subject: `New Enquiry from ${name}`,
            html: message
        });
    } catch (error) {
        console.error(error);
    }
};