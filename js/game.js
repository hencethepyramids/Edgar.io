// game.js
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const fileInput = document.getElementById('fileInput');
const fileInputLabel = document.getElementById('fileInputLabel');
const playBtn = document.getElementById('playBtn');
const customizeBallBtn = document.getElementById('customizeBallBtn');

// Set canvas dimensions based on window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player;
const foods = [];
const mapSpeedMultiplier = 0.02;

let selectedColor = getRandomColor(); // Default color

function startGame() {
  // Hide color picker and file input
  colorPicker.style.display = 'none';
  fileInput.style.display = 'none';
  fileInputLabel.style.display = 'none';

  // Hide Play button
  playBtn.style.display = 'none';

  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';

  // Enable the lines below to enable the image upload option
  fileInputLabel.style.display = 'block';
  fileInput.style.display = 'block';

  // Generate initial food blobs
  for (let i = 0; i < 20; i++) {
    generateFood();
  }

  // Set notebook paper background with reduced opacity
  canvas.style.backgroundImage = 'url("images/notebook-paper-background.png")';
  canvas.style.backgroundSize = 'cover';
  canvas.style.opacity = '0.5'; // Adjust the opacity as needed

  // Set the initial size of the player
  player = createPlayer(canvas.width / 2, canvas.height / 2, 10, selectedColor);

  // Resize canvas on window resize
  window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
  });

  gameloop();
}

// Helper function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function createPlayer(x, y, radius, color) {
  return {
    x,
    y,
    radius,
    initialRadius: radius,
    color,
    speed: 0,
    acceleration: 0.02,
    friction: 0.98,
  };
}

function generateFood() {
  const neonColors = ['#ff00ff', '#00ffff', '#ff0000', '#00ff00', '#ffff00'];

  const food = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: 5,
    color: neonColors[Math.floor(Math.random() * neonColors.length)],
  };

  foods.push(food);
}

function drawPlayer() {
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();
  ctx.closePath();
}

function drawFood(food) {
  ctx.beginPath();
  ctx.arc(food.x, food.y, food.radius, 0, Math.PI * 2);
  ctx.fillStyle = food.color;
  ctx.fill();
  ctx.closePath();
}

function update(event) {
  if (player) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Normalize the mouse coordinates based on canvas dimensions
    const canvasRect = canvas.getBoundingClientRect();
    const normalizedMouseX = (mouseX - canvasRect.left) / canvasRect.width;
    const normalizedMouseY = (mouseY - canvasRect.top) / canvasRect.height;

    // Calculate the angle between the current position and the normalized mouse position
    const dx = normalizedMouseX * canvas.width - player.x;
    const dy = normalizedMouseY * canvas.height - player.y;
    const angle = Math.atan2(dy, dx);

    // Set the speed and direction of the player towards the normalized mouse position
    player.speed = 5; // You can adjust the speed as needed
    player.x += player.speed * Math.cos(angle);
    player.y += player.speed * Math.sin(angle);

    // Apply friction to slow down player
    player.speed *= player.friction;

    // Check for collision with food
    for (let i = foods.length - 1; i >= 0; i--) {
      const food = foods[i];
      const distance = Math.sqrt((player.x - food.x) ** 2 + (player.y - food.y) ** 2);

      if (distance < player.radius + food.radius) {
        // Player consumed the food
        foods.splice(i, 1);
        player.radius += 2;
        player.speed -= 0.02;
      }
    }

    // Move the map with the player
    canvas.style.backgroundPositionX = -player.x * mapSpeedMultiplier + 'px';
    canvas.style.backgroundPositionY = -player.y * mapSpeedMultiplier + 'px';
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();

  // Draw food blobs with neon colors
  for (const food of foods) {
    drawFood(food);
  }
}

function gameloop() {
  canvas.addEventListener('mousemove', function (event) {
    update(event);
  });

  draw();
  requestAnimationFrame(gameloop);
}

// Updated openColorPicker function
function openColorPicker() {
  // Navigate to the customization page
  window.location.href = "customize.html";
}

// Event handler for file input (image upload)
function handleImageUpload() {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Handle image upload logic
      // For now, just log the result to the console
      console.log(e.target.result);

      // Show Play button
      playBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

// Update the Customize Ball button to call the new function
customizeBallBtn.addEventListener('click', openColorPicker);

// Update the Play button to call the new function
playBtn.addEventListener('click', startGame);
