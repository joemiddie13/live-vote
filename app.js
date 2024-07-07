const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('static'));

let surveys = [];

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send existing surveys to the newly connected client
    socket.emit('surveyData', surveys);

    socket.on('createSurvey', (surveyData) => {
        surveys = surveyData;
        io.emit('surveyData', surveys);
        console.log('Survey created:', surveyData);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});