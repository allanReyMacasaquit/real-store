import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

const port = process.env.Port || 4000;

app.listen(port, () => {
	console.log(`You are listening to localhost/${port}`);
});
