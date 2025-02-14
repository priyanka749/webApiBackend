const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            port: 465,
            auth: {
                user: "priyankabhandari749@gmail.com",
                pass: "qmre zrfe ujaf ncyd ", 
            },
        });

        const mailOptions = {
            from: "priyankabhandari749@gmail.com",
            to,
            subject,
            text,
            html,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email could not be sentttttt");
    }
};

module.exports = { sendEmail };