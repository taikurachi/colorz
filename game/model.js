import { colors } from "./data.js";

export const GameModel = {
  colors,
  score: 0,
  highScore: localStorage.getItem("highScore")
    ? parseInt(localStorage.getItem("highScore"))
    : 0,
  typedString: "",
  colorElements: [],
  startTime: new Date().getTime(),
  colorSpawnInterval: null,

  incrementScore() {
    this.score++;
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore);
    }
  },

  getSpawnInterval() {
    const baseInterval = 2000;
    const intervalDecrease = 1000;
    const minimumInterval = 800;
    const timePlayed = new Date().getTime() - this.startTime;
    return Math.max(
      baseInterval - Math.floor(timePlayed / intervalDecrease) * 30,
      minimumInterval
    );
  },
};
