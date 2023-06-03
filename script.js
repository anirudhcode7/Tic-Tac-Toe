let board = Array.from(document.getElementsByClassName('cell'));
let o_turn = false;
let gameEnded = false;
let status = document.getElementById('game-status');
let line = document.getElementById('line'); // You should have a line element in your HTML
let clickSound = document.getElementById('click-sound');
let winSound = document.getElementById('win-sound');

let totalGames = 3;
let winsX = 0;
let winsO = 0;
let gamesPlayed = 0;
let seriesCompleted = false;

let scoreElement = document.getElementById("score");

function typeStatus(message) {
  let i = 0;
  let speed = 50; // Speed/duration of the effect in milliseconds
  status.innerHTML = "";
  message = message.trim(); // remove leading and trailing spaces
  typeWriter();

  function typeWriter() {
    if (i < message.length) {
      status.innerHTML += message.charAt(i);
      i++;
      setTimeout(typeWriter, speed);
    }
    else {
      i=0;
    }
  }
}

function initializeScorecard(){
  scoreElement.innerText = `Score - X: ${winsX}, O: ${winsO}`
  typeStatus(`Game: ${gamesPlayed + 1}/${totalGames}`);
}

// Call initializeGame when the page loads
window.onload = initializeScorecard;

// Update this function to incr ement the win counters
function declareWinner(winner) {
  if (winner == 'X') {
    winsX++;
  } else if (winner == 'O') {
    winsO++;
  }

  document.querySelector('#score').innerText = `Score - X: ${winsX}, O: ${winsO}`;

  if (gamesPlayed == totalGames) {
    if (winsX > winsO) {
      document.querySelector('#quote-container').style.display = "block";
      typeStatus("Player X won the series!");
    } else if (winsO > winsX) {
      document.querySelector('#quote-container').style.display = "block";
      typeStatus("Player O won the series!");
    } else {
      typeStatus("The series ended in a draw!");
    }
    seriesCompleted = true;
  }
}

function setRandomQuote() {
  fetch('https://api.quotable.io/random')
    .then(response => response.json())
    .then(data => {
      let quoteElement = document.getElementById('quote');
      let authorElement = document.getElementById('quote-author');
      
      quoteElement.innerText = `"${data.content}"`;
      authorElement.innerText = `- ${data.author}`;
    })
    .catch(err => {
      console.error(err);
      // In case the quote fetching fails, we can fall back to a default message
      let quoteElement = document.getElementById('quote');
      quoteElement.innerText = "Quote loading failed.";
    });
}


function checkForVictory(squares) {
  let combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  let winningCombo =  combos.find(combo => {
    if (
      squares[combo[0]].innerText &&
      squares[combo[0]].innerText === squares[combo[1]].innerText &&
      squares[combo[0]].innerText === squares[combo[2]].innerText
    ) {
      return true;
    } else {
      return false;
    }
  });

  if(winningCombo) {
    let startRect = board[winningCombo[0]].getBoundingClientRect();
    let endRect = board[winningCombo[2]].getBoundingClientRect();
    let boardRect = document.getElementById('tic-tac-toe-board').getBoundingClientRect();

    // Calculate the center point of each cell

    let startX = startRect.left + window.pageXOffset + startRect.width / 2;
    let startY = startRect.top + window.pageYOffset + startRect.height / 2;
    let endX = endRect.left + window.pageXOffset + endRect.width / 2;
    let endY = endRect.top + window.pageYOffset + endRect.height / 2;


    line.style.width = Math.sqrt(Math.pow(startX - endX, 2) + Math.pow(startY - endY, 2)) + "px";
    line.style.transform = "rotate(" + Math.atan2(endY - startY, endX - startX) + "rad)";
    line.style.top = startY + "px";
    line.style.transformOrigin = 'left center';
    line.style.left = startX + "px";
    line.style.display = "block";
    line.style.zIndex = 10000;

    return true;
  }
  else {
    return false;
  }

}

board.forEach(cell => {
  cell.addEventListener('click', handleClick, { once: true });
});

function handleClick(e) {
  if(gameEnded) {
    return; // Return early if the game has ended
  }

  if (o_turn) {
    e.target.innerText = 'O';
    e.target.style.color = '#b30000';
  } else {
    e.target.innerText = 'X';
    e.target.style.color = '#0033cc';
  }

  if (checkForVictory(board)) {
    gameEnded = true;
    winSound.currentTime = 0;
    winSound.play();
    let winner = o_turn ? 'O' : 'X';
    gamesPlayed++;
    declareWinner(winner);
    if(seriesCompleted){
      return;
    }
    let funWinningPhrases = [
      `Hooray! ${winner} won the game!`,
      `Yippee! ${winner} took the day!`,
      `Glorious victory for ${winner}!`
    ];
    let randomIndex = Math.floor(Math.random() * funWinningPhrases.length);
    // status.innerText = funWinningPhrases[randomIndex];
    typeStatus(funWinningPhrases[randomIndex]);
    setRandomQuote();

  } else if (board.every(cell => cell.innerText !== '')) { // Check for a draw
    gameEnded = true;
    clickSound.currentTime = 0; 
    clickSound.play();
    let funDrawPhrases = [
      `Oops! It's a draw. Try again!`,
      `A tie! The battlefield is even!`,
      `It's a standoff! Let's have another round!`
    ];
    let randomIndex = Math.floor(Math.random() * funDrawPhrases.length);
    // status.innerText = funDrawPhrases[randomIndex];
    typeStatus(funDrawPhrases[randomIndex]);
    gamesPlayed++;
    if (gamesPlayed == totalGames){
      setTimeout(function(){
        declareWinner('D');
      },2000);
    }
  } else {
    clickSound.currentTime = 0; 
    clickSound.play();
    o_turn = !o_turn;
  }

}

document.getElementById('reset').addEventListener('click', resetBoard);

function resetBoard() {
  clickSound.currentTime = 0; 
  clickSound.play();
  line.style.width = 0;
  gameEnded = false;
  board.forEach(cell => {
    cell.innerText = '';
    cell.addEventListener('click', handleClick, { once: true });
  });
  status.innerText = '';
  if (gamesPlayed < totalGames) {
    typeStatus(`Game ${gamesPlayed + 1}/${totalGames}`);
  }
  if(seriesCompleted){
    typeStatus('Starting a new series');
    gamesPlayed = 0;
    setTimeout(function(){
      typeStatus(`Game: ${gamesPlayed+1}/${totalGames}`);
    },2000);
    seriesCompleted = false;
    winsX = 0;
    winsO = 0;
    document.querySelector('#score').innerText = `Score - X: ${winsX}, O: ${winsO}`;
  }
  o_turn = false;
}

let icons = ['X', 'O']; // The characters to fall

delay = 0; // The time for the first character to fall

let fallingIconContainer = document.getElementById('falling-icons');

// Creating 100 falling characters
for (let i = 0; i < 100; i++) {
    setTimeout(function() {
        let icon = document.createElement('div');
        icon.className = 'icon-fall';
        icon.innerText = icons[Math.floor(Math.random() * icons.length)];

        // Randomize the horizontal position and the speed
        icon.style.left = Math.random() * 100 + '%';
        icon.style.animationDuration = (Math.random() * 5 + 2) + 's'; // duration between 2 and 7 seconds

        fallingIconContainer.appendChild(icon);

        // After the icon has fallen, remove it
        setTimeout(function() {
            fallingIconContainer.removeChild(icon);
        }, (parseInt(icon.style.animationDuration) + 1) * 1000);
    }, delay * 1000);

    // Increase the delay for the next character
    delay += 0.2;
}

// Optionally, after the last character has fallen, remove the falling icons container
setTimeout(function() {
    fallingIconContainer.remove();
}, delay * 1000);

