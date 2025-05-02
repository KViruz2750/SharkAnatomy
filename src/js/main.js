// This file contains the JavaScript code for the introduction page. 
// It handles the button click event to navigate to the quiz page.

document.addEventListener('DOMContentLoaded', () => {
    const startQuizButton = document.getElementById('start-quiz-button');

    startQuizButton.addEventListener('click', () => {
        window.location.href = 'quiz.html';
    });
});