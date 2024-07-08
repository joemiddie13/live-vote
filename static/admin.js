document.addEventListener('DOMContentLoaded', () => {
  const surveyForm = document.getElementById('surveyForm'); // Form element for survey creation
  const questionsContainer = document.getElementById('questions'); // Container to hold survey questions
  const addQuestionButton = document.getElementById('add-question'); // Button to add a new question
  const socket = io(); // Initialize a WebSocket connection
  let surveys = []; // Array to store survey data

  // Function to add a new choice to a question
  function addChoice(questionElement) {
    const choicesContainer = questionElement.querySelector('.choices'); // Container to hold choices for a question
    const newChoice = document.createElement('div'); // Create a new choice element
    newChoice.classList.add('choice', 'mb-2'); // Add classes for styling
    newChoice.innerHTML = `
      <div class="form-group d-flex align-items-center">
        <input type="text" name="choice" class="form-control" required>
        <button type="button" class="btn btn-danger ml-2 delete-choice">Delete Choice</button>
      </div>
    `; // Set the inner HTML for the new choice element
    choicesContainer.appendChild(newChoice); // Append the new choice element to the choices container

    // Attach event listener for the delete choice button
    newChoice.querySelector('.delete-choice').addEventListener('click', () => {
      newChoice.remove(); // Remove the choice element when the delete button is clicked
    });
  }

  // Event listener to add a new question to the survey
  addQuestionButton.addEventListener('click', () => {
    const newQuestion = document.createElement('div'); // Create a new question element
    newQuestion.classList.add('question', 'mb-3'); // Add classes for styling
    newQuestion.innerHTML = `
      <div class="form-group">
        <label>Question:</label>
        <input type="text" name="question" class="form-control" required>
      </div>
      <button type="button" class="btn btn-success mb-2 add-choice">Add Choice</button>
      <div class="choices">
        <div class="choice mb-2">
          <div class="form-group d-flex align-items-center">
            <input type="text" name="choice" class="form-control" required>
            <button type="button" class="btn btn-danger ml-2 delete-choice">Delete Choice</button>
          </div>
        </div>
      </div>
    `; // Set the inner HTML for the new question element
    questionsContainer.appendChild(newQuestion); // Append the new question element to the questions container

    // Attach event listener for adding choices to the new question
    newQuestion.querySelector('.add-choice').addEventListener('click', () => addChoice(newQuestion));

    // Attach event listener for the delete choice button
    newQuestion.querySelector('.delete-choice').addEventListener('click', (event) => {
      event.target.parentElement.remove(); // Remove the choice element when the delete button is clicked
    });
  });

  // Event listener to handle form submission
  surveyForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    const surveyData = []; // Array to store survey data
    const questions = document.querySelectorAll('.question'); // Select all question elements

    // Iterate over each question element
    questions.forEach(question => {
      const questionText = question.querySelector('input[name="question"]').value; // Get the question text
      const choices = question.querySelectorAll('input[name="choice"]'); // Get all choice elements for the question
      const choiceTexts = []; // Array to store choice texts

      // Iterate over each choice element and get its value
      choices.forEach(choice => {
        choiceTexts.push(choice.value);
      });

      // Add the question and its choices to the survey data array
      surveyData.push({
        question: questionText,
        choices: choiceTexts
      });
    });

    // Emit the survey data to the server
    socket.emit('createSurvey', surveyData);

    // Clear the form after submission
    surveyForm.reset();
    questionsContainer.innerHTML = '';
  });

  // Attach event listener for the initial add choice button
  document.querySelector('.add-choice').addEventListener('click', () => addChoice(document.querySelector('.question')));

  // Attach event listener for the initial delete choice button
  document.querySelector('.delete-choice').addEventListener('click', (event) => {
    event.target.parentElement.remove(); // Remove the choice element when the delete button is clicked
  });

  // Listen for survey data updates from the server
  socket.on('surveyData', (surveyData) => {
    surveys = surveyData; // Update the surveys array with the received data
  });

  // Listen for vote data updates from the server
  socket.on('voteData', (votes) => {
    console.log('Received votes:', votes); // Log the received votes to the console
    updateResults(votes); // Update the results display
  });

  // Function to update the results display
  function updateResults(votes) {
    let resultsContainer = document.getElementById('resultsContainer'); // Select the results container element
    if (!resultsContainer) {
      resultsContainer = document.createElement('div'); // Create a new results container element if it doesn't exist
      resultsContainer.id = 'resultsContainer'; // Set the ID of the results container
      questionsContainer.parentElement.insertBefore(resultsContainer, questionsContainer.nextSibling); // Insert the results container after the questions container
    } else {
      resultsContainer.innerHTML = ''; // Clear the existing results
    }

    // Iterate over each survey
    surveys.forEach((survey, questionIndex) => {
      const questionResult = document.createElement('div'); // Create a new element for the question results
      questionResult.classList.add('question-result', 'mb-3'); // Add classes for styling

      const questionTitle = document.createElement('h3'); // Create an element for the question title
      questionTitle.textContent = survey.question; // Set the question title text
      questionResult.appendChild(questionTitle); // Append the question title to the question result element

      const questionVotes = votes[questionIndex] || {}; // Get the votes for the question, or an empty object if none exist
      // Iterate over each choice in the question
      Object.keys(questionVotes).forEach(choice => {
        const choiceResult = document.createElement('div'); // Create a new element for the choice result
        choiceResult.classList.add('choice-result', 'd-flex', 'justify-content-between'); // Add classes for styling

        const choiceText = document.createElement('span'); // Create an element for the choice text
        choiceText.textContent = choice; // Set the choice text

        const choiceVotes = document.createElement('span'); // Create an element for the choice votes
        choiceVotes.textContent = questionVotes[choice]; // Set the choice votes

        choiceResult.appendChild(choiceText); // Append the choice text to the choice result element
        choiceResult.appendChild(choiceVotes); // Append the choice votes to the choice result element
        questionResult.appendChild(choiceResult); // Append the choice result element to the question result element
      });

      resultsContainer.appendChild(questionResult); // Append the question result element to the results container
    });
  }
});