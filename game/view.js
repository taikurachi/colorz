export const GameView = {
  colorElementsContainer: document.querySelector(".color-elements__container"),
  highScoreElement: document.querySelector(".score__highScore"),
  scoreElement: document.querySelector(".score__scoreboard"),
  typedText: document.querySelector(".text-gameOver"),
  playAgainBtn: document.querySelector(".play-again-btn"),

  updateScore(score) {
    this.scoreElement.textContent = `Score: ${score}`;
  },
  updateHighScore(highScore) {
    this.highScoreElement.textContent = `High score: ${highScore}`;
  },
  showGameOverAnimation(color) {
    this.createSplotch(color, -500, -500, 700);
    const endText = "Game Over";
    let i = 0;
    const intervalId = setInterval(() => {
      this.typedText.textContent += endText[i];
      i++;
      if (i === endText.length) {
        clearInterval(intervalId);
        this.playAgainBtn.classList.remove("hidden");
      }
    }, 180);
  },
  createColorElement(color) {
    const colorElement = document.createElement("span");
    colorElement.textContent = color;
    colorElement.classList.add("color-created", "animation-type1");
    colorElement.style.color = color;
    return colorElement;
  },

  appendColorElement(colorElement) {
    this.colorElementsContainer.appendChild(colorElement);
  },
  showPlayAgainBtn() {
    this.playAgainBtn.style.display = "block";
  },
  clearColorElements() {
    this.colorElementsContainer.replaceChildren();
  },
  removeColorElementById(id) {
    document.getElementById(id).remove();
  },
  createSplotch(color, x, y, fontSize) {
    const splotchElement = document.createElement("div");
    splotchElement.classList.add("splotch");
    splotchElement.style.left = `${x}px`;
    splotchElement.style.top = `${y}px`;
    splotchElement.style.backgroundColor = color;
    const scaleFactor = fontSize / 14;
    splotchElement.style.setProperty("--splotch-size", `${50 * scaleFactor}px`);
    this.colorElementsContainer.appendChild(splotchElement);
  },
};
