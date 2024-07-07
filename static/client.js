const socket = io();

socket.on('surveyData', (surveys) => {
    const surveyContainer = document.getElementById('surveyContainer');
    surveyContainer.innerHTML = ''; // Clear previous content

    surveys.forEach((survey, index) => {
        const surveyElement = document.createElement('div');
        surveyElement.classList.add('survey');

        const questionElement = document.createElement('h2');
        questionElement.textContent = survey.question;
        surveyElement.appendChild(questionElement);

        survey.choices.forEach(choice => {
            const choiceElement = document.createElement('div');
            choiceElement.classList.add('choice');
            
            const choiceLabel = document.createElement('label');
            choiceLabel.textContent = choice;
            
            const choiceInput = document.createElement('input');
            choiceInput.type = 'radio';
            choiceInput.name = `question${index}`;
            choiceInput.value = choice;
            
            choiceElement.appendChild(choiceInput);
            choiceElement.appendChild(choiceLabel);
            surveyElement.appendChild(choiceElement);
        });

        surveyContainer.appendChild(surveyElement);
    });
});