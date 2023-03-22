(() => {
  const chess = new Chess();
  const button = document.querySelector("button");

  document
    .querySelector("input")
    .addEventListener("input", (e) => chess.setSpeed(e.target.value));

  button.addEventListener("click", async (e) => {
    chess.reset();
    e.target.disabled = true;
    chess.start().then(() => {
      e.target.disabled = false;
    });
  });
})();
