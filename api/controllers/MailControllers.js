import nodemailer from 'nodemailer';

export async function sendEmail(data, req, res) {
	// Create a transporter using SMTP transport
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_ID, // Your Gmail address
			pass: process.env.EMAIL_PASSWORD, // Your Gmail password or app-specific password
		},
	});

	// Email message options
	const mailOptions = {
		from: 'email@gmail.com', // Sender email address
		to: data.to, // Recipient email address
		subject: data.subject, // Email subject
		text: data.text, // Email plain text body
	};

	// Send email
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error('Error occurred: ', error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}
