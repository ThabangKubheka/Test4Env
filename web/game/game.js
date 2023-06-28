const cards = document.querySelectorAll('.card');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');
const timerElement = document.getElementById('timer');
const resultElement = document.getElementById('result');

const accessToken = sessionStorage.getItem("Authorization")
const refreshToken = sessionStorage.getItem("RefreshToken")



function logout(){
  sessionStorage.removeItem("Authorization");
  sessionStorage.removeItem("RefreshToken");
}

let playerScore = 0;
let computerScore = 0;
let round = 0;
let timer;
let timeExpired = false;

function handleClick() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

cards.forEach(card => {
  card.addEventListener('click', function () {

    if (playerScore === 3 || computerScore === 3 || timeExpired===true) {
      return; 
    }
    const playerChoice = this.querySelector('img').getAttribute('alt');
    const computerChoice = generateComputerChoice();
    updateSelectedCards(playerChoice, computerChoice);
    timer=startTimer();

    const winner = determineWinner(playerChoice, computerChoice);
    if (winner === 'player') {
      playerScore++;
      playerScoreElement.textContent = playerScore;
    } else if (winner === 'computer') {
      computerScore++;
      computerScoreElement.textContent = computerScore;
    }
    round++;

    if (playerScore === 3 || computerScore === 3 ) {
      endGame();
    } else {
      timer = startTimer();
    }
    
  });
});

function generateComputerChoice() {
  const choices = ['Rock', 'Paper', 'Scissor'];
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

function updateSelectedCards(playerChoice, computerChoice) {
  const playerSelectedCard = document.querySelector('.player .selected-card img');
  if (playerChoice) {
    playerSelectedCard.setAttribute('src', `${playerChoice.toLowerCase()}.png`);
    playerSelectedCard.setAttribute('alt', playerChoice);
  }

  const computerSelectedCard = document.querySelector('.computer .selected-card img');
  if (computerChoice) {
    computerSelectedCard.setAttribute('src', `${computerChoice.toLowerCase()}.png`);
    computerSelectedCard.setAttribute('alt', computerChoice);
  }
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'tie';
  } else if (
    (playerChoice === 'Rock' && computerChoice === 'Scissor') ||
    (playerChoice === 'Paper' && computerChoice === 'Rock') ||
    (playerChoice === 'Scissor' && computerChoice === 'Paper')
  ) {
    return 'player';
  } else {
    return 'computer';
  }
}

function startTimer() {
  resetTimer();
  let time = 5;
  timerElement.textContent = time;

  timer=  setInterval(() => {
    time--;
    timerElement.textContent = time;

    if (time === 0) {
      timeExpired = true;
      endGame();
    }
  }, 1000);

  return timer
}

function resetTimer() {
  clearInterval(timer);
  timerElement.textContent = '';
}

function endGame() {
  resetTimer();
  cards.forEach(card => card.removeEventListener('click', handleClick));

  if (timeExpired || playerScore < computerScore) {
    resultElement.textContent = "Oops! You lost the game.";
    submitScore('loss');
  } else if (playerScore > computerScore) {
    console.log(timer)
    resultElement.textContent = "Congratulations! You won the game.";
    submitScore('win');
  } else {
    submitScore('loss');
    resultElement.textContent = "Oops! You lost the game.";
  }
}


function resetGame() {
  playerScore = 0;
  computerScore = 0;
  round = 0;
  resetTimer();
  cards.forEach(card => {
    card.removeEventListener('click', handleClick);
  });
  playerScoreElement.textContent = playerScore;
  computerScoreElement.textContent = computerScore;
  resultElement.textContent = '';
  updateSelectedCards('', '');
  timer = startTimer();
  timeExpired = false;
}

const replayButton = document.getElementById('replay-button');
replayButton.addEventListener('click', resetGame);

const submitScore= (state) => {
  fetch('https://djqw8yat5yomm.cloudfront.net/api/scores/postScore', {
      method: 'POST',
      mode: "cors",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'origin': 'https://d3vbn0ixkks4al.cloudfront.net',
        'AccessToken': accessToken,
        'RefreshToken': refreshToken,
      },
      body: JSON.stringify({state})
  })
  .then(response => {
    if (response.status === 200) {
      console.log('Could not update scores for non user');
    }
    else if (response.status === 201) {
      console.log("Success",response);
      sessionStorage.removeItem("Authorization");
      sessionStorage.removeItem("RefreshToken");
      sessionStorage.setItem("Authorization", response.headers.get('Authorization').split(' ')[1]);
      sessionStorage.setItem("RefreshToken", response.headers.get('RefreshToken').split(' ')[1]);
    }
    else if (response.status === 401) {
      window.location.href = '/login';
    }
    else if (response.status === 500) {
      console.log("Failed",response);
    }
  });
}

