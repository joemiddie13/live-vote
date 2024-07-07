document.addEventListener('DOMContentLoaded', () => {
  const surveyForm = document.getElementById('surveyForm');
  const questionsContainer = document.getElementById('questions');
  const addQuestionButton = document.getElementById('add-question');
  
  // Add new choice to a question
  function addChoice(questionElement) {
      const choicesContainer = questionElement.querySelector('.choices');
      const newChoice = document.createElement('div');
      newChoice.classList.add('choice', 'mb-2');
      newChoice.innerHTML = `
          <div class="form-group d-flex align-items-center">
              <input type="text" name="choice" class="form-control" required>
              <button type="button" class="btn btn-danger ml-2 delete-choice">Delete Choice</button>
          </div>
      `;
      choicesContainer.appendChild(newChoice);

      // Attach event listener for delete choice button
      newChoice.querySelector('.delete-choice').addEventListener('click', () => {
          newChoice.remove();
      });
  }

  // Add new question to the survey
  addQuestionButton.addEventListener('click', () => {
      const newQuestion = document.createElement('div');
      newQuestion.classList.add('question', 'mb-3');
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
      `;
      questionsContainer.appendChild(newQuestion);

      // Attach event listener for adding choices
      newQuestion.querySelector('.add-choice').addEventListener('click', () => addChoice(newQuestion));

      // Attach event listener for delete choice button
      newQuestion.querySelector('.delete-choice').addEventListener('click', (event) => {
          event.target.parentElement.remove();
      });
  });

  // Handle form submission
  surveyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const surveyData = [];
      const questions = document.querySelectorAll('.question');
      
      questions.forEach(question => {
          const questionText = question.querySelector('input[name="question"]').value;
          const choices = question.querySelectorAll('input[name="choice"]');
          const choiceTexts = [];
          
          choices.forEach(choice => {
              choiceTexts.push(choice.value);
          });

          surveyData.push({
              question: questionText,
              choices: choiceTexts
          });
      });

      // Emit survey data to the server
      const socket = io();
      socket.emit('createSurvey', surveyData);

      // Clear form after submission
      surveyForm.reset();
      questionsContainer.innerHTML = '';
  });

  // Attach event listener for initial add choice button
  document.querySelector('.add-choice').addEventListener('click', () => addChoice(document.querySelector('.question')));

  // Attach event listener for initial delete choice button
  document.querySelector('.delete-choice').addEventListener('click', (event) => {
      event.target.parentElement.remove();
  });
});