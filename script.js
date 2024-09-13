const API_URL = 'https://opentdb.com/api.php?amount=5&category=18&type=multiple';  // URL to fetch questions
let currentQuiz = 0;
let score = 0;
let quizData = [];
let hintUsed = false;

const questionEl = document.getElementById('question');
const a_text = document.getElementById('a_text');
const b_text = document.getElementById('b_text');
const c_text = document.getElementById('c_text');
const d_text = document.getElementById('d_text');
const submitBtn = document.getElementById('submit');
const answers = document.querySelectorAll('.answer');
const resultContainer = document.getElementById('result-container');
const hintBtn = document.getElementById('hintBtn');

// Fetch quiz data from API
async function fetchQuizData() {
    const response = await fetch(API_URL);
    const data = await response.json();
    quizData = data.results.map((questionData) => {
        const incorrectAnswers = [...questionData.incorrect_answers];
        const correctAnswer = questionData.correct_answer;
        
        // Randomly shuffle the correct answer into the answer options
        const randomIndex = Math.floor(Math.random() * (incorrectAnswers.length + 1));
        incorrectAnswers.splice(randomIndex, 0, correctAnswer);
        
        return {
            question: questionData.question,
            a: incorrectAnswers[0],
            b: incorrectAnswers[1],
            c: incorrectAnswers[2],
            d: incorrectAnswers[3],
            correct: randomIndex === 0 ? 'a' : randomIndex === 1 ? 'b' : randomIndex === 2 ? 'c' : 'd',
        };
    });
    loadQuiz();
}

// Load a quiz question from the data
function loadQuiz() {
    deselectAnswers();
    
    const currentQuizData = quizData[currentQuiz];
    
    questionEl.innerHTML = decodeHTML(currentQuizData.question);
    a_text.innerHTML = decodeHTML(currentQuizData.a);
    b_text.innerHTML = decodeHTML(currentQuizData.b);
    c_text.innerHTML = decodeHTML(currentQuizData.c);
    d_text.innerHTML = decodeHTML(currentQuizData.d);
    
    submitBtn.disabled = false;  // Enable the submit button after loading a question
}

// Get the selected answer
function getSelected() {
    let answer = undefined;
    
    answers.forEach((ans) => {
        if (ans.checked) {
            answer = ans.id;
        }
    });
    
    return answer;
}

// Deselect all answers
function deselectAnswers() {
    answers.forEach((ans) => {
        ans.checked = false;
        document.getElementById(ans.id + '_text').classList.remove('correct-answer');
    });
}

// Show the correct answer (Hint feature)
function showHint() {
    if (!hintUsed) {
        const correctAnswerId = quizData[currentQuiz].correct;
        document.getElementById(correctAnswerId + '_text').classList.add('correct-answer');
        hintBtn.disabled = true; // Disable the hint button after using
        hintUsed = true; // Mark hint as used
    }
}

// Event listener for hint button
hintBtn.addEventListener('click', showHint);

// Event listener for submit button
submitBtn.addEventListener('click', () => {
    const answer = getSelected();
    
    if (answer) {
        if (answer === quizData[currentQuiz].correct) {
            score++;
        }
        
        currentQuiz++;
        
        if (currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            resultContainer.innerHTML = `<h3>You scored ${score}/${quizData.length}.</h3>
                                        <button onclick="location.reload()">Reload</button>`;
            submitBtn.disabled = true;
        }
    }
});

// Utility function to decode HTML entities in API responses
function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// Initial call to fetch quiz data from API
fetchQuizData();
