const express = require('express'); // Import the Express library
const http = require('http'); // Import the HTTP library
const socketIo = require('socket.io'); // Import the Socket.IO library
const app = express(); // Create an Express application
const server = http.createServer(app); // Create an HTTP server using the Express app
const io = socketIo(server); // Attach Socket.IO to the HTTP server

// Serve static files from the 'static' directory
app.use(express.static('static'));

let surveys = []; // Array to store survey data
let votes = {}; // Object to store votes for each survey question

// Handle a new WebSocket connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send existing surveys and votes to the newly connected client
    socket.emit('surveyData', surveys);
    socket.emit('voteData', votes);

    // Handle receiving new survey data from the admin
    socket.on('createSurvey', (surveyData) => {
        surveys = surveyData; // Update the surveys array with the new survey data
        votes = {}; // Reset the votes object when a new survey is created
        io.emit('surveyData', surveys); // Broadcast the updated surveys to all connected clients
        io.emit('voteData', votes); // Broadcast the reset votes to all connected clients
        console.log('Survey created:', surveyData);
    });

    // Handle receiving a vote from a user
    socket.on('submitVote', (voteData) => {
        // Ensure there is an entry for the question index
        if (!votes[voteData.questionIndex]) {
            votes[voteData.questionIndex] = {};
        }
        // Ensure there is an entry for the choice within the question
        if (!votes[voteData.questionIndex][voteData.choice]) {
            votes[voteData.questionIndex][voteData.choice] = 0;
        }
        // Increment the vote count for the chosen option
        votes[voteData.questionIndex][voteData.choice] += 1;
        io.emit('voteData', votes); // Broadcast the updated votes to all connected clients
        console.log('Vote submitted:', voteData);
    });

    // Handle a client disconnecting
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server on the specified port (default to 3000)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});