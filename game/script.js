let colors = [
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
// Initialize variables to store the typed string and the current score

let typedString = "";
let score = 0;

let gameOverTriggered = false; //set up flag for game over
let colorSpawnInterval;

// Function to increment the score and update the score display

function incrementScore() {
  if (gameOverTriggered) {
    return;
  }
  score++;
  let scoreElement = document.getElementById("score");
  scoreElement.textContent = score; //update score display
  if (score >= 2) {
    clearInterval(colorSpawnInterval); //clear interval for spawning
    intervalDecider = getSpawnInterval();
    colorSpawnInterval = setInterval(createRandomColorElement, intervalDecider); //new interval
    console.log(intervalDecider);
  }
}

//game over animation
function typeGameOver() {
  let i = 0;
  let endText = "Game Over";
  let typedText = document.querySelector(".gameOver");

  let intervalId = setInterval(typeLetter, 180); // Call typeLetter every 180ms

  function typeLetter() {
    typedText.textContent += endText[i]; // Append next letter to text content
    i++; // Increment index

    if (i === endText.length) {
      clearInterval(intervalId); // Stop the interval when all letters have been typed
      console.log("done typing");
      let buttonGameOver = document.querySelector(".hidden");
      buttonGameOver.classList.remove("hidden");
      console.log(buttonGameOver);
    }
  }
}

// Flag to prevent multiple "Game Over" animations from being triggered

let hasGameOverBeenCalled = false;

// Function to end the game and stop spawning colors
function gameOver(color) {
  gameOverTriggered = true;
  clearInterval(colorSpawnInterval); //
  document.body.style.backgroundColor = color;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore); //high score storage
    let highScoreElement = document.getElementById("highScore");
    highScoreElement.textContent = "High Score: " + highScore; //updating high score element
  }
}

// Function to create a random color element on the screen
function createRandomColorElement() {
  let color = colors[Math.floor(Math.random() * colors.length)];
  let colorElement = document.createElement("span");
  const fontSizeComputed = getComputedStyle(colorElement);
  let colorInnerText = document.createElement("span");
  colorInnerText.textContent = color;
  colorInnerText.classList.add("color-name-inner");
  colorElement.appendChild(colorInnerText);
  colorElement.classList.add("color-name");
  colorElement.dataset.fontSize = getComputedStyle(colorElement).fontSize;
  colorElement.style.color = color;

  document.body.appendChild(colorElement);

  // Calculate position before appending to the DOM

  let elementRect = colorElement.getBoundingClientRect();
  let xPos = Math.random() * (window.innerWidth - elementRect.width);
  let yPos = Math.random() * (window.innerHeight - elementRect.height);
  colorElement.style.left = xPos + "px";
  colorElement.style.top = yPos + "px";

  colorElement.velocityX = (Math.random() - 0.5) * 4;
  colorElement.velocityY = (Math.random() - 0.5) * 4;
  colorElements.push(colorElement);
  scheduleColorElementRemoval(colorElement, 10000); // 10 seconds delay

  // Set a unique ID for the color element and set a timeout to remove it after 10 seconds
  colorElement.id = "color-" + color;

  function scheduleColorElementRemoval(colorElement, delay) {
    let creationTime = new Date().getTime();

    setTimeout(function () {
      if (document.getElementById("color-" + color)) {
        let colorElement = document.getElementById("color-" + color);
        let elementRect = colorElement.getBoundingClientRect();

        // Check if the element is visible within the viewport
        let isVisible =
          elementRect.top >= -elementRect.height / 2 &&
          elementRect.left >= -elementRect.width / 2 &&
          elementRect.bottom <= window.innerHeight + elementRect.height / 2 &&
          elementRect.right <= window.innerWidth + elementRect.width / 2;

        let currentTime = new Date().getTime();
        let timeOnScreen = currentTime - creationTime;

        if (isVisible && timeOnScreen > 10000 && !hasGameOverBeenCalled) {
          typeGameOver();
          gameOver(color);
          hasGameOverBeenCalled = true;
        } else {
          removeColorElement(colorElement.id.split("-")[1]);
        }
      }
    }, delay);
  }
}

// Function to create a splotch on the screen
function createSplotch(color, x, y, fontSize) {
  // Create a new splotch element and set its position and background color
  let splotchElement = document.createElement("div");
  splotchElement.classList.add("splotch");
  splotchElement.style.left = x + "px";
  splotchElement.style.top = y + "px";
  splotchElement.style.backgroundColor = color;

  // Set the size of the splotch based on the font size

  let scaleFactor = fontSize / 14;

  // Set random values for the before and after pseudo-elements of the splotch
  splotchElement.style.setProperty("--splotch-size", 50 * scaleFactor + "px");
  splotchElement.style.setProperty("--before-top", Math.random() * 50 + "%");
  splotchElement.style.setProperty("--before-left", Math.random() * 50 + "%");

  splotchElement.style.setProperty(
    "--after-width",
    30 + Math.random() * 40 + "%"
  );
  splotchElement.style.setProperty(
    "--after-height",
    30 + Math.random() * 40 + "%"
  );
  splotchElement.style.setProperty(
    "--after-top",
    50 + Math.random() * 50 + "%"
  );
  splotchElement.style.setProperty("--after-left", Math.random() * 50 + "%");

  document.body.appendChild(splotchElement);
}

function displayGameOverText(gameOverElement, index = 0) {
  if (index < gameOverElement.textContent.length) {
    let letterElement = document.createElement("span");
    letterElement.textContent = gameOverElement.textContent[index];
    gameOverElement.appendChild(letterElement);

    setTimeout(() => displayGameOverText(gameOverElement, index + 1), 100);
  }
}

function removeColorElement(color) {
  let colorElement = document.getElementById("color-" + color);
  if (colorElement) {
    document.body.removeChild(colorElement);
  }
}

document
  .getElementById("colorInput")
  .addEventListener("input", function (event) {
    typedString = event.target.value.toLowerCase(); //typing into the input box instead of randomly typing onto the screen

    colors.forEach(function (color) {
      if (typedString.endsWith(color)) {
        let colorElement = document.getElementById("color-" + color);
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

let intervalDecider = 2000;

function intervalTimer() {
  colorSpawnInterval = setInterval(function () {
    createRandomColorElement();
  }, intervalDecider);
}

intervalTimer();

let colorElements = [];

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

    // Update the element's position
    colorElement.style.left = newX + "px";
    colorElement.style.top = newY + "px";
  });

  // Call this function again on the next animation frame
  requestAnimationFrame(updateColorElementPositions);
}

// Start updating the element positions
updateColorElementPositions();

let startTime = new Date().getTime();
//creating faster spawn intervals to make the game harder
function getSpawnInterval() {
  let baseInterval = 2000;
  let intervalDecrease = 1000;
  let minimumInterval = 900;
  let timePlayed = new Date().getTime() - startTime;

  let newInterval =
    baseInterval - Math.floor(timePlayed / intervalDecrease) * 30; // game becomes harder the longer you play
  return Math.max(newInterval, minimumInterval);
}

// Initialize a variable to store the high score
let highScore = 0;

// Load the high score from localStorage (if it exists)
if (localStorage.getItem("highScore")) {
  highScore = parseInt(localStorage.getItem("highScore"));
  let highScoreElement = document.getElementById("highScore");
  highScoreElement.textContent = "High Score: " + highScore;
}
