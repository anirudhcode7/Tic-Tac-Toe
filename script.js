let board = Array.from(document.getElementsByClassName('cell'));
let o_turn = false;

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
    setTimeout(() => {
      alert('We have a winner!');
      resetBoard();
    }, 100);
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
  o_turn = false;
}
