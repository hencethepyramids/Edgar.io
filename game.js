// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions based on window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  initialRadius: 10,
  radius: 10,
  color: 'rgba(255, 87, 51, 0.8)', // Darker and more opaque color
  speed: 0,
  acceleration: 0.02,
  friction: 0.98,
};

const foods = [];
const mapSpeedMultiplier = 0.02;

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

// Generate random food blobs with neon colors
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
