/**
 * Represents a chess board used to solve the 8 queen problem.
 */
class Chess {
  /**
   * Private field for the queen chess piece Unicode character.
   * @type {string}
   * @private
   */
  #queen = "&#x265B;";

  #speed = 100;

  /**
   * 2D array representing the chess board.
   * @type {number[][]}
   * @private
   */
  #board = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  /**
   * Private method for selecting a chess board field element by its row and column.
   * @param {number} i - The row index.
   * @param {number} j - The column index.
   * @returns {HTMLElement} The selected field element.
   * @private
   */
  #field = (i, j) =>
    document.querySelector(
      `.row:nth-child(${i + 1}) .field:nth-of-type(${j + 1})`
    );

  /**
   * Private method for checking if a given position is a valid placement for a queen.
   * @param {number} x - The row index.
   * @param {number} y - The column index.
   * @returns {boolean} Whether the given position is valid.
   * @private
   */
  #isValid(x, y) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (i === x && j === y) continue;
        if (
          this.#board[x].includes(1) ||
          this.#board[i][y] === 1 ||
          (this.#board[i][j] === 1 && (i + j === x + y || i - j === x - y))
        )
          return false;
      }
    }
    return true;
  }

  /**
   * Private method for displaying the chess board on the web page.
   * @private
   */
  #display() {
    Array.from(document.querySelectorAll(".field")).forEach(
      (e) => (e.innerHTML = "")
    );
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.#board[i][j]) this.#field(i, j).innerHTML += this.#queen;
      }
    }
  }

  /**
   * Resets the chess board to its initial state with no queens placed.
   */
  reset() {
    this.#board = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.#display();
  }

  /**
   * Setter method for setting animation speed.
   * @param {number} value - speed value 0 - 100.
   */
  setSpeed = (value) => (this.#speed = value);

  async start() {
    let backTrack = false;
    let i = 0;
    while (i < 8) {
      if (backTrack) {
        if (this.#board[i].indexOf(1) === 7) {
          this.#board[i][7] = 0;
          this.#display();
          i--;
          continue;
        }
      }

      let j = backTrack ? this.#board[i].indexOf(1) + 1 : 0;
      while (j < 8) {
        if (backTrack) {
          this.#board[i][j - 1] = 0;
          this.#display();
          backTrack = false;
        }

        this.#field(i, j).style.border = "5px solid red";
        await new Promise((resolve) => setTimeout(resolve, this.#speed * 5));
        this.#field(i, j).style.border = "";

        if (this.#isValid(i, j)) {
          this.#board[i][j] = 1;
          this.#display();
          if (this.#board[7].includes(1)) return;
          break;
        }

        if (j === 7) {
          backTrack = true;
          i -= 2;
        }

        j++;
      }

      i++;
    }
  }
}
