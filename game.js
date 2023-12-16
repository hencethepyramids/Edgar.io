// game.js
const startScreen = document.getElementById('startScreen');
const gameScreen = document.getElementById('gameScreen');
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const fileInput = document.getElementById('fileInput');
const fileInputLabel = document.getElementById('fileInputLabel');

// Set canvas dimensions based on window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player;
const foods = [];
const mapSpeedMultiplier = 0.02;

function startGame() {
  startScreen.style.display = 'none';
  gameScreen.style.display = 'block';

  // Get color from the color picker
  const selectedColor = colorPicker.value;

  // Uncomment the line below to enable the color picker option
  player = createPlayer(canvas.width / 2, canvas.height / 2, 10, selectedColor);

  // Uncomment the lines below to enable the image upload option
  fileInputLabel.style.display = 'block';
  fileInput.style.display = 'block';

  // Generate initial food blobs
  for (let i = 0; i < 20; i++) {
    generateFood();
  }

  // Set notebook paper background with reduced opacity
  canvas.style.backgroundImage = 'url("notebook-paper-background.jpg")';
  canvas.style.backgroundSize = 'cover';
  canvas.style.opacity = '0.5'; // Adjust the opacity as needed

  // Set the initial size of the player
  player.radius = player.initialRadius;

  // Resize canvas on window resize
  window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
  });

  gameloop();
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
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Apply physics to player movement
  const dx = mouseX - player.x;
  const dy = mouseY - player.y;
  const angle = Math.atan2(dy, dx);
  const force = 0.1;

  player.speed += force;
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

colorPicker.addEventListener('input', function () {
  // Uncomment the line below to enable the color picker option
  player.color = colorPicker.value;
});

fileInput.addEventListener('change', function () {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // Uncomment the line below to enable the image upload option
      // player = createPlayer(canvas.width / 2, canvas.height / 2, 30, e.target.result);
    };
    reader.readAsDataURL(file);
  }
});
