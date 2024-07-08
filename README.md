# Live Vote

## App Description

**Live Vote** is a real-time survey application that allows administrators to create surveys with multiple questions and choices. Users can participate in these surveys by selecting their preferred choices and submitting their votes. The results of the surveys are updated in real-time and can be tracked by the administrators. The application leverages WebSockets for real-time communication, ensuring that both the survey questions and the voting results are synchronized across all connected clients instantly.

## Justification for using WebSockets

WebSockets are used in **Live Vote** to enable real-time communication between the server and the clients. Unlike traditional HTTP requests which are unidirectional and can introduce latency, WebSockets provide a persistent, bidirectional connection. This allows the server to push updates to the clients as soon as new survey data is available or when new votes are cast, ensuring that all participants have the most up-to-date information without the need for constant polling or page refreshes. This real-time capability is crucial for maintaining an interactive and dynamic user experience in a live survey application.

## Labeled Mockup of the App with Event Interaction Details

### Admin Page

<img width="1287" alt="image" src="https://github.com/joemiddie13/live-vote/assets/102793694/00775fbd-b356-450a-8ae2-b55bb89b9288">


1. **Create Survey**: Admin can add multiple questions and choices. Each question has a "Add Choice" button to add more choices and a "Delete Choice" button to remove choices.
   - **Event**: `createSurvey` - Emits survey data to the server when the survey is submitted.
   
2. **Submit Survey**: Admin submits the survey, which clears the form and broadcasts the survey data to all connected clients.
   - **Event**: `createSurvey` - Emits survey data to the server.

3. **Toggle Dark Mode**: Admin can toggle between light and dark mode for better accessibility and visual comfort.
   - **Event**: Toggles the `dark-mode` class on the body.

4. **Real-time Results**: Displays the voting results in real-time as votes are cast by users.
   - **Event**: `voteData` - Listens for updated vote data from the server and updates the results display.

### User Page

![User Page Mockup](user-page-mockup.png)

1. **Survey Display**: Users see the survey questions and choices broadcast by the admin in real-time.
   - **Event**: `surveyData` - Listens for new survey data from the server and updates the survey display.

2. **Submit Vote**: Users select their choice and submit their vote. The vote is sent to the server and the user receives a confirmation message.
   - **Event**: `submitVote` - Emits the selected vote data to the server.

3. **Toggle Dark Mode**: Users can toggle between light and dark mode for better accessibility and visual comfort.
   - **Event**: Toggles the `dark-mode` class on the body.

## How to Install and Run the App

### Prerequisites

- Node.js (v12 or later)
- npm (v6 or later)

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/live-vote.git
   cd live-vote
    ```
2. **Install dependencies**:
    ```bash
    npm install
    ```
3. **Start the server**:
    ```bash
    npm start
    ```
4. **Access the admin page**:
    Open `http://localhost:3000/admin.html` in your browser to access the admin page.
5. **Access the user page**:
    Open `http://localhost:3000/` in your browser to access the user page.

## Usage

1. **Creating Surveys - Admin Page**:
    - Add questions and choices using the provided form.
    - Click "Submit Survey" to broadcast the survey to all connected users.
2. **Participating in Surveys - User Page**:
    - Select your preferred choices for each question.
    - Click "Submit Vote" to cast your vote.
3. **Real-time Updates & Reviewing Results**:
    - Admins can view real-time voting results on the admin page.
    - Users can see the survey questions and choices update in real-time.

## Technologies Used
    - Node.js
    - Express
    - Socket.IO
    - HTML/CSS
    - JavaScript
    - Boostrap
