const socket = io(); // Initialize a WebSocket connection

// Listen for survey data updates from the server
socket.on('surveyData', (surveys) => {
    const surveyContainer = document.getElementById('surveyContainer'); // Get the container for surveys
    surveyContainer.innerHTML = ''; // Clear previous content

    // Iterate over each survey
    surveys.forEach((survey, index) => {
        const surveyElement = document.createElement('div'); // Create a new survey element
        surveyElement.classList.add('survey', 'card', 'mb-3', 'p-3'); // Add classes for styling

        const questionElement = document.createElement('h2'); // Create an element for the question
        questionElement.textContent = survey.question; // Set the question text
        surveyElement.appendChild(questionElement); // Append the question element to the survey element

        // Iterate over each choice in the survey
        survey.choices.forEach(choice => {
            const choiceElement = document.createElement('div'); // Create a new choice element
            choiceElement.classList.add('choice', 'form-check'); // Add classes for styling

            const choiceInput = document.createElement('input'); // Create an input element for the choice
            choiceInput.type = 'radio'; // Set the input type to radio
            choiceInput.name = `question${index}`; // Set the name attribute for the radio group
            choiceInput.value = choice; // Set the value of the input to the choice text
            choiceInput.classList.add('form-check-input'); // Add a class for styling

            const choiceLabel = document.createElement('label'); // Create a label element for the choice
            choiceLabel.textContent = choice; // Set the label text to the choice text
            choiceLabel.classList.add('form-check-label', 'ml-2'); // Add classes for styling

            choiceElement.appendChild(choiceInput); // Append the input element to the choice element
            choiceElement.appendChild(choiceLabel); // Append the label element to the choice element
            surveyElement.appendChild(choiceElement); // Append the choice element to the survey element
        });

        surveyContainer.appendChild(surveyElement); // Append the survey element to the survey container
    });
});

// Event listener for the submit vote button
document.getElementById('submitVote').addEventListener('click', () => {
    const surveyContainer = document.getElementById('surveyContainer'); // Get the container for surveys
    const surveys = surveyContainer.getElementsByClassName('survey'); // Get all survey elements

    // Iterate over each survey element
    Array.from(surveys).forEach((survey, questionIndex) => {
        const selectedChoice = survey.querySelector('input[type="radio"]:checked'); // Get the selected choice
        if (selectedChoice) {
            const voteData = {
                questionIndex: questionIndex, // Index of the question
                choice: selectedChoice.value // Selected choice
            };
            socket.emit('submitVote', voteData); // Emit the vote data to the server
        }
    });

    alert('Your vote has been submitted!'); // Display a confirmation message
});