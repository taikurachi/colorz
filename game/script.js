const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "cyan",
  "magenta",
  "lime",
  "teal",
  "navy",
  "maroon",
  "olive",
  "fuchsia",
  "silver",
  "gold",
  "coral",
  "salmon",
  "indigo",
  "violet",
  "turquoise",
  "plum",
  "sienna",
  "tan",
  "khaki",
  "lavender",
  "peru",
  "pink",
  "tomato",
  "crimson",
  "gainsboro",
  "gray",
  "moccasin",
  "orchid",
  "thistle",
  "wheat",
  "azure",
  "beige",
  "bisque",
  "brown",
  "burlywood",
  "chartreuse",
  "chocolate",
  "cornsilk",
  "honeydew",
  "ivory",
  "linen",
  "seashell",
  "snow",
  "black",
];

let typedString = "";
let score = 0;
let colorSpawnInterval;
let highscore = 0;
const startTime = new Date().getTime();
const colorElements = [];
const highScoreElement = document.getElementById("highScore");
const scoreElement = document.getElementById("score");
const endText = "Game Over";
const typedText = document.querySelector(".gameOver");
const colorElementsContainer = document.querySelector(
  ".color-elements__container"
);

function incrementScore() {
  score++;
  scoreElement.textContent = score;
  if (score >= 2) {
    clearInterval(colorSpawnInterval);
    colorSpawnInterval = setInterval(
      createRandomColorElement,
      getSpawnInterval()
    );
  }
}

//game over animation
function typeGameOver() {
  let i = 0;
  let intervalId = setInterval(typeLetter, 180);

  function typeLetter() {
    typedText.textContent += endText[i];
    i++;

    if (i === endText.length) {
      clearInterval(intervalId);
      const buttonGameOver = document.querySelector(".hidden");
      buttonGameOver.classList.remove("hidden");
    }
  }
}

// Function to create a random color element on the screen
function createRandomColorElement() {
  const color = colors[Math.floor(Math.random() * colors.length)];
  const colorElement = document.createElement("span");
  const randomAnimationTypes = [
    "animation-type1",
    "animation-type2",
    "animation-type3",
    "animation-type4",
  ];
  const randomAnimation =
    randomAnimationTypes[
      Math.floor(Math.random() * randomAnimationTypes.length)
    ];
  colorElement.textContent = color;
  colorElement.classList.add("color-created", randomAnimation);
  colorElement.style.color = color;
  const elementRect = colorElement.getBoundingClientRect();
  const xPos = Math.random() * (window.innerWidth - elementRect.width);
  const yPos = Math.random() * (window.innerHeight - elementRect.height);
  colorElement.style.left = xPos + "px";
  colorElement.style.top = yPos + "px";
  colorElement.velocityX = (Math.random() - 0.5) * 4;
  colorElement.velocityY = (Math.random() - 0.5) * 4;
  colorElements.push(colorElement);
  colorElement.id = "color-" + color;
  colorElementsContainer.appendChild(colorElement);
}

// Function to create a splotch on the screen
function createSplotch(color, x, y, fontSize) {
  const splotchElement = document.createElement("div");
  splotchElement.classList.add("splotch");
  splotchElement.style.left = x + "px";
  splotchElement.style.top = y + "px";
  splotchElement.style.backgroundColor = color;

  const scaleFactor = fontSize / 14;

  splotchElement.style.setProperty("--splotch-size", 50 * scaleFactor + "px");
  colorElementsContainer.appendChild(splotchElement);
}

function gameOverHappen() {
  colorElementsContainer.addEventListener("animationend", function (event) {
    if (event.target.classList.contains("color-created")) {
      const targetElement = event.target;
      const color = getComputedStyle(targetElement).color;
      clearInterval(colorSpawnInterval);
      colorElementsContainer.replaceChildren();
      createSplotch(color, -500, -500, 700);
      typeGameOver();
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        let highScoreElement = document.getElementById("highScore");
        highScoreElement.textContent = "High Score: " + highScore;
      }
    }
  });
}
gameOverHappen();

function removeColorElement(color) {
  document.getElementById("color-" + color).remove();
}

document
  .getElementById("colorInput")
  .addEventListener("input", function (event) {
    typedString = event.target.value.toLowerCase();
    colors.forEach(function (color) {
      if (typedString === color) {
        const colorElement = document.getElementById("color-" + color);
        if (colorElement) {
          let computedFontSize = parseFloat(
            getComputedStyle(colorElement).fontSize
          );
          // Create a splotch at the position of the color element

          createSplotch(
            color,
            parseInt(colorElement.style.left),
            parseInt(colorElement.style.top),
            computedFontSize
          );
          // Remove the color element, increment the score, and reset the typed string

          removeColorElement(color);
          incrementScore();
          typedString = "";
          event.target.value = "";
        }
      }
    });
  });

colorSpawnInterval = setInterval(createRandomColorElement, getSpawnInterval());

function updateColorElementPositions() {
  //iterate through each color element
  colorElements.forEach((colorElement) => {
    // Get the current X and Y position of the color element

    let currentX = parseFloat(colorElement.style.left);
    let currentY = parseFloat(colorElement.style.top);

    // Calculate the new X and Y positions of the color element
    let newX = currentX + colorElement.velocityX;
    let newY = currentY + colorElement.velocityY;

    //get the dimensions of the color element
    let elementWidth = colorElement.offsetWidth;
    let elementHeight = colorElement.offsetHeight;

    // Check for collisions with the viewport boundaries along x-axis
    if (newX < 0 || newX + elementWidth > window.innerWidth) {
      colorElement.velocityX = -colorElement.velocityX; //reverse x velocity
      newX = Math.min(Math.max(newX, 0), window.innerWidth - elementWidth); //limit the x position to be within the viewport
    }

    //check for collisions with the viewport boundaries along y-axis
    if (newY < 0 || newY + elementHeight > window.innerHeight) {
      colorElement.velocityY = -colorElement.velocityY; //reverse y velocity
      newY = Math.min(Math.max(newY, 0), window.innerHeight - elementHeight); //limit the new y position to be within the viewport
    }

    colorElement.style.left = newX + "px";
    colorElement.style.top = newY + "px";
  });

  requestAnimationFrame(updateColorElementPositions);
}

updateColorElementPositions();

function getSpawnInterval() {
  const baseInterval = 2000;
  const intervalDecrease = 1000;
  const minimumInterval = 800;
  const timePlayed = new Date().getTime() - startTime;

  const newInterval =
    baseInterval - Math.floor(timePlayed / intervalDecrease) * 30; // game becomes harder the longer you play
  return Math.max(newInterval, minimumInterval);
}

// Load the high score from localStorage (if it exists)
if (localStorage.getItem("highScore")) {
  highScore = parseInt(localStorage.getItem("highScore"));
  highScoreElement.textContent = "High Score: " + highScore;
}
