let board = Array.from(document.getElementsByClassName('cell'));
let o_turn = false;
let status = document.getElementById('game-status');

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

  return combos.find(combo => {
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
}

board.forEach(cell => {
  cell.addEventListener('click', handleClick, { once: true });
});

function handleClick(e) {
  if (o_turn) {
    e.target.innerText = 'O';
    e.target.style.color = '#b30000';
  } else {
    e.target.innerText = 'X';
    e.target.style.color = '#0033cc';
  }

  if (checkForVictory(board)) {
    let winner = o_turn ? 'O' : 'X';
    let funWinningPhrases = [
      `Hooray! ${winner} won the game!`,
      `Yippee! ${winner} took the day!`,
      `Glorious victory for ${winner}!`
    ];
    let randomIndex = Math.floor(Math.random() * funWinningPhrases.length);
    status.innerText = funWinningPhrases[randomIndex];

    setTimeout(resetBoard, 2000);
  } else if (board.every(cell => cell.innerText !== '')) { // Check for a draw
    let funDrawPhrases = [
      `Oops! It's a draw. Try again!`,
      `A tie! The battlefield is even!`,
      `It's a standoff! Let's have another round!`
    ];
    let randomIndex = Math.floor(Math.random() * funDrawPhrases.length);
    status.innerText = funDrawPhrases[randomIndex];

    setTimeout(resetBoard, 2000);
  } else {
    o_turn = !o_turn;
  }

}

document.getElementById('reset').addEventListener('click', resetBoard);

function resetBoard() {
  board.forEach(cell => {
    cell.innerText = '';
    cell.addEventListener('click', handleClick, { once: true });
  });
  status.innerText = '';
  o_turn = false;
}
