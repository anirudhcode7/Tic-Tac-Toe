let board = Array.from(document.getElementsByClassName('cell'));
let o_turn = false;
let gameEnded = false;
let status = document.getElementById('game-status');
let line = document.getElementById('line'); // You should have a line element in your HTML
let clickSound = document.getElementById('click-sound');
let winSound = document.getElementById('win-sound');

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
    let funWinningPhrases = [
      `Hooray! ${winner} won the game!`,
      `Yippee! ${winner} took the day!`,
      `Glorious victory for ${winner}!`
    ];
    let randomIndex = Math.floor(Math.random() * funWinningPhrases.length);
    status.innerText = funWinningPhrases[randomIndex];

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
    status.innerText = funDrawPhrases[randomIndex];

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
  o_turn = false;
}
