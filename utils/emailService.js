const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail", // or your email provider
            port: 465,
            auth: {
                user: "product.skill@gmail.com",
                pass: "wdts ltqs vgzl coyj", 
            },
        });

        const mailOptions = {
            from: "product.skill@gmail.com",
            to,
            services,
            text,
            html,
        };

        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email could not be sent");
    }
};

module.exports = { sendEmail };