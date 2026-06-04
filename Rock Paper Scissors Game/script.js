// Game Variables
let userScore = 0;
let compScore = 0;

// Emoji dictionary to map text choices to icons
const choicesMap = {
    'rock': '🪨',
    'paper': '📄',
    'scissors': '✂️'
};

// Array of possible choices for the computer
const choices = ['rock', 'paper', 'scissors'];

// Main Game Logic
function playGame(userChoice) {
    // 1. Generate computer choice
    const compChoice = choices[Math.floor(Math.random() * choices.length)];

    // 2. Update the display icons
    document.getElementById('user-display').innerText = choicesMap[userChoice];
    document.getElementById('comp-display').innerText = choicesMap[compChoice];

    // 3. Determine the winner
    const resultMsgElement = document.getElementById('result-message');
    resultMsgElement.className = 'result-message'; // Reset classes

    if (userChoice === compChoice) {
        // Tie
        resultMsgElement.innerText = "It's a Tie!";
        resultMsgElement.classList.add('tie-text');
    } 
    else if (
        (userChoice === 'rock' && compChoice === 'scissors') ||
        (userChoice === 'paper' && compChoice === 'rock') ||
        (userChoice === 'scissors' && compChoice === 'paper')
    ) {
        // User Wins
        userScore++;
        document.getElementById('user-score').innerText = userScore;
        resultMsgElement.innerText = `You Win! ${capitalize(userChoice)} beats ${capitalize(compChoice)}.`;
        resultMsgElement.classList.add('win-text');
    } 
    else {
        // Computer Wins
        compScore++;
        document.getElementById('comp-score').innerText = compScore;
        resultMsgElement.innerText = `You Lose! ${capitalize(compChoice)} beats ${capitalize(userChoice)}.`;
        resultMsgElement.classList.add('lose-text');
    }
}

// Restart Game Logic
function resetGame() {
    // Reset scores
    userScore = 0;
    compScore = 0;
    document.getElementById('user-score').innerText = userScore;
    document.getElementById('comp-score').innerText = compScore;

    // Reset UI displays
    document.getElementById('user-display').innerText = '❓';
    document.getElementById('comp-display').innerText = '❓';
    
    const resultMsgElement = document.getElementById('result-message');
    resultMsgElement.innerText = 'Make your move to start!';
    resultMsgElement.className = 'result-message'; // Remove win/lose/tie color classes
}

// Helper function to capitalize the first letter of the choices in the text message
function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
}