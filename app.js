/** @format */

require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//My Routes
const authRoutes = require('./routes/auth');
const deleveryRoutes = require('./routes/delevery');
const itemRouters = require('./routes/item');
const bannerRouters = require('./routes/banner');
const userRouters = require('./routes/user');

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//Set headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, PATCH, DELETE'
	);
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	next();
});

//My Routes
app.use('/api', authRoutes);
app.use('/api', deleveryRoutes);
app.use('/api', itemRouters);
app.use('/api', bannerRouters);
app.use('/api', userRouters);

//Error MiddleWare

app.use((error, req, res, next) => {
	console.log(error + '-----------------------------');
	const statusCode = error.statusCode || 500;
	const message = error.message;
	let errorsPresent;
	if (error.errors) {
		errorsPresent = error.errors;
	}

	res.status(statusCode).json({
		message: message,
		errors: errorsPresent,
	});
	next();
});

//My Port
const port = process.env.PORT || 8000;

const clients = {};

mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	})
	.then(() => {
		console.log('DB CONNECTED');
		const server = app.listen(port, () => {
			console.log('Server is running on port 8000');
		});
		const io = require('./util/socket').init(server);
		io.on('connection', (socket) => {
			socket.on('add-user', (data) => {
				clients[data.userId] = {
					socket: socket.id,
				};
			});

			socket.on('disconnect', () => {
				for (const userId in clients) {
					if (clients[userId].socket === socket.id) {
						delete clients[userId];
						break;
					}
				}
			});
		});
	})
	.catch((err) => console.log(err));

exports.clients = clients;
