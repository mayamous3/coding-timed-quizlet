// Define the set of quiz questions and answers in an array.
const quiz = [
{
    number: "1",
    ask: "What is JavaScript?",
    answer: ["A markup language","A server-side programming language","A client-side programming language","A database management system"],
    correct: "A client-side programming language"
},
{
    number:"2",
    ask: "Which keyword is used to declare a variable in JavaScript?",
    answer: ["var","let","const","all of the above"],
    correct: "all of the above"
},
{
    number: "3",
    ask: "What is the correct way to comment a single line in JavaScript?",
    answer: ["<!-- This is a comment -->","/* This is a comment */","// This is a comment","'This is a comment'"],
    correct: "// This is a comment"
},
{
    number: "4",
    ask: "What is the purpose of the 'forEach' method in JavaScript",
    answer: ["To create a new array based on the elements of the original array.",
        "To add a new element to the beginning of an array.",
        "To iterate over each element of an array and execute a callback function.",
        "To sort the elements of an array in ascending order."],
    correct: "To iterate over each element of an array and execute a callback function."
},
{
    number: "5",
    ask: "Which built-in method can be used to convert a string to all uppercase letters?",
    answer: ["toUpperCase()","toUpper()","convertUpperCase()","uppercase()"],
    correct: "toUpperCase()"
}
];

const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');
const quizContainer = document.getElementById('quizzy');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('pointTotal');
const initialsInput = document.getElementById('initialsInput');
const submitButton = document.getElementById('submitButton');
const pastElement = document.getElementById('pastScore');

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 90; // Total time for the quiz in seconds
let timerInterval;
let pastScores = [];

// Function to display the current question
function displayQuestion() {
    const questionObj = quiz[currentQuestionIndex];
    const questionElement = document.createElement('div');
    questionElement.innerHTML = `
        <p>${questionObj.number}. ${questionObj.ask}</p>
    `;

    const answerList = document.createElement('ul');
    questionObj.answer.forEach((answer) => {
        const answerItem = document.createElement('li');
        answerItem.textContent = answer;
        answerList.appendChild(answerItem);
    });

    answerList.addEventListener('click', handleAnswerClick);
    questionElement.appendChild(answerList);
    quizContainer.innerHTML = '';
    quizContainer.appendChild(questionElement);
}

// Function for the click event on answers
function handleAnswerClick(event) {
    const selectedAnswer = event.target.textContent;
    const questionObj = quiz[currentQuestionIndex];
    if (selectedAnswer === questionObj.correct) {
        score += 20;
    } else {
        score -= 10;
        timeLeft -= 10;
            if (timeLeft < 0) {
                timeLeft = 0; // Ensure that the timeLeft doesn't become negative
             }
            }

    currentQuestionIndex++;

    if (currentQuestionIndex < quiz.length) {
        displayQuestion();
        scoreElement.textContent = `${score}`; 
    } else {
        endQuiz();
    }
}

// Function to start the quiz
function startQuiz() {
    startButton.style.display = 'none';
    endButton.style.display = 'inline';
    timerElement.textContent = '90';
    scoreElement.textContent = '0';
    displayQuestion();
    timerInterval = setInterval(updateTimer, 1000);
}

// Function to end the quiz
function endQuiz() {
    clearInterval(timerInterval);
    quizContainer.innerHTML = '<p>Quiz Completed!</p>';
    scoreElement.textContent = `${score}`;
    endButton.style.display = 'none';
    submitButton.style.display = 'inline';


    // Save the score to local storage
    localStorage.setItem('userScore', score);
}


// Function to update the timer
function updateTimer() {
    timeLeft--;
    timerElement.textContent = `${timeLeft} seconds`;
    if (timeLeft <= 0) {
        endQuiz();
    }
}
// Function to save down quiz attempts
function submitQuiz() {
    const initials = initialsInput ;
    if (initials === ''){
        alert('Must save initials.');
        return;
    }

    const quizAttempt = {
        date: new Date().toLocaleString(),
        initials: initials,
        score: score
    };

    pastScores.push(quizAttempt);
    
    localStorage.setItem('pastScores', JSON.stringify(pastScores));

}

// Event listener for the start button
startButton.addEventListener('click', startQuiz);

// Event listener for the end button
endButton.addEventListener('click', endQuiz);

// Event listener for submit button
submitButton.addEventListener('click', submitQuiz);

// Display Past Scores
function displayPastScores() {
    pastElement.innerHTML = '';
    pastScores.forEach((attempt) => {
        const scoreItem = document.createElement('div');
        scoreItem.textContent = `${attempt.date} - ${attempt.initials}: ${attempt.score}`;
        pastElement.appendChild(scoreItem);
    });
}

displayPastScores();

// Use local Storage to populate the final userScore
window.addEventListener('load', function() {
    const savedScore = localStorage.getItem('userScore');
    if (savedScore !== null) {
        score = parseInt(savedScore);
        scoreElement.textContent = `Final Score: ${score}`;
    }
});

// Go get past saved scores 
window.addEventListener('load', function() {
    const savedAttempts = localStorage.getItem('quizAttempt');
    if (savedAttempts !== null) {
        quizAttempt = JSON.parse(quizAttempt);
    }
});

// Clear local storage using event listener 'before unload' so that score doesn't persist when page is refreshed.
window.addEventListener('beforeunload', function() {
    localStorage.removeItem('userScore');
});

// Retrieve past quiz attempts from local storage when the page loads
window.addEventListener('load', function() {
    const savedAttempts = localStorage.getItem('pastScores');
    if (savedAttempts !== null) {
        pastScores = JSON.parse(savedAttempts);
        displayPastScores();
    }
});