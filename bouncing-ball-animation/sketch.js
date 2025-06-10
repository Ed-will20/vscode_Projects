// sketch.js with squash-stretch

let x, y;
let vx, vy;
const gravity = 0.6;
const damping = 0.75;
const radius = 30;

function setup() {
  createCanvas(400, 400);
  x = width / 2;
  y = radius;
  vx = 2;
  vy = 0;
}

function draw() {
  background(30);

  // Update physics
  vy += gravity;
  x += vx;
  y += vy;

  // Bounce off bottom
  if (y + radius > height) {
    y = height - radius;
    // before reversing vy, capture impact speed for squash
    let impactSpeed = vy;
    vy = -vy * damping;
    // You might store impactSpeed to control squash intensity, but here we use transient in rendering below.
  }
  // Bounce sides
  if (x + radius > width || x - radius < 0) {
    vx = -vx;
  }

  // Compute squash/stretch factor based on vertical velocity
  // Map vy to a scale factor: when |vy| is large (fast), more stretch; near zero (top of arc), near normal shape.
  // Here we use a simple mapping: scale between 0.7 and 1.3 depending on vy.
  let maxStretch = 1.3;
  let maxSquash = 0.7; // when hitting ground
  // Map vy (which can be large positive or negative) to a value between squash and stretch.
  // For simplicity, we clamp vy to a range:
  let v = constrain( vy, -15, 15 ); // tune this range for your gravity/speed
  // Normalize: -15..15 → -1..1
  let norm = map(v, -15, 15, -1, 1);
  // If norm<0 (going up fast), elongate vertically (stretch): scaleY > 1
  // If norm>0 (falling fast), squash on impact: scaleY < 1
  // We'll invert for visual: falling (vy positive) → squash, rising (vy negative) → stretch.
  let scaleY = map(norm, -1, 1, maxStretch, maxSquash);
  let scaleX = 1 / scaleY; // to roughly conserve volume
  
  // Draw squashed/stretched ball:
  push();
  translate(x, y);
  scale(scaleX, scaleY);
  fill(200, 100, 100);
  noStroke();
  circle(0, 0, radius * 2);
  pop();
}