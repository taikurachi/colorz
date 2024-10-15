import { GameModel } from "./model.js";
import { GameView } from "./view.js";

export const GameController = {
  init() {
    this.bindEvents();
    this.updateViewFromModel();
    this.checkGameOver();
    GameModel.colorSpawnInterval = setInterval(
      this.spawnColorElement.bind(this),
      GameModel.getSpawnInterval()
    );
    requestAnimationFrame(this.updateColorPositions.bind(this));
  },

  bindEvents() {
    document
      .querySelector(".color-input")
      .addEventListener("input", this.handleUserInput.bind(this));
  },

  handleUserInput(event) {
    GameModel.typedString = event.target.value.toLowerCase();
    GameModel.colors.forEach((color) => {
      if (GameModel.typedString === color) {
        const colorElement = document.getElementById(`color-${color}`);
        if (colorElement) {
          const fontSize = parseFloat(getComputedStyle(colorElement).fontSize);
          GameView.createSplotch(
            color,
            parseInt(colorElement.style.left),
            parseInt(colorElement.style.top),
            fontSize
          );
          GameView.removeColorElementById(`color-${color}`);
          GameModel.incrementScore();
          this.updateViewFromModel();
          GameModel.typedString = "";
          event.target.value = "";
        }
      }
    });
  },

  spawnColorElement() {
    const color =
      GameModel.colors[Math.floor(Math.random() * GameModel.colors.length)];
    const colorElement = GameView.createColorElement(color);
    const elementRect = colorElement.getBoundingClientRect();
    const xPos = Math.random() * (window.innerWidth - elementRect.width);
    const yPos = Math.random() * (window.innerHeight - elementRect.height);
    colorElement.style.left = `${xPos}px`;
    colorElement.style.top = `${yPos}px`;
    colorElement.id = `color-${color}`;
    colorElement.velocityX = (Math.random() - 0.5) * 4;
    colorElement.velocityY = (Math.random() - 0.5) * 4;
    GameModel.colorElements.push(colorElement);
    GameView.appendColorElement(colorElement);
  },

  updateColorPositions() {
    GameModel.colorElements.forEach((colorElement) => {
      let currentX = parseFloat(colorElement.style.left);
      let currentY = parseFloat(colorElement.style.top);
      let newX = currentX + colorElement.velocityX;
      let newY = currentY + colorElement.velocityY;

      let elementWidth = colorElement.offsetWidth;
      let elementHeight = colorElement.offsetHeight;

      if (newX < 0 || newX + elementWidth > window.innerWidth) {
        colorElement.velocityX = -colorElement.velocityX;
        newX = Math.min(Math.max(newX, 0), window.innerWidth - elementWidth);
      }

      if (newY < 0 || newY + elementHeight > window.innerHeight) {
        colorElement.velocityY = -colorElement.velocityY;
        newY = Math.min(Math.max(newY, 0), window.innerHeight - elementHeight);
      }

      colorElement.style.left = `${newX}px`;
      colorElement.style.top = `${newY}px`;
    });

    requestAnimationFrame(this.updateColorPositions.bind(this));
  },

  updateViewFromModel() {
    GameView.updateScore(GameModel.score);
    GameView.updateHighScore(GameModel.highScore);
  },

  checkGameOver() {
    GameView.colorElementsContainer.addEventListener(
      "animationend",
      function (event) {
        if (event.target.classList.contains("color-created")) {
          const targetElement = event.target;
          GameView.clearColorElements();
          GameView.showGameOverAnimation(targetElement.textContent);
          clearInterval(GameModel.colorSpawnInterval);
          GameView.showPlayAgainBtn();
        }
      }
    );
  },
};

GameController.init();
