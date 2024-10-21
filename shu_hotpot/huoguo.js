let hotPot;
let ingredients = [];
let selectedIngredient = null;
let imgHotPotList;
let imgHotPotIndex = 0;
let imgFoodList = []

let imgBowl
let bowlPos = { x: 0, y: 0 }

// Declare variables for the particle system and texture
let particleTexture;
let particleSystem;

function preload() {
  const bambooShoots = loadImage("img/bambooShoots.png");
  const beef = loadImage("img/beef.png");
  const beefOmasum = loadImage("img/beefOmasum.png");
  const crabWillow = loadImage("img/crabWillow.png");
  const duckBlood = loadImage("img/duckBlood.png");
  const ringingRoll = loadImage("img/ringingRoll.png");
  const vegetable = loadImage("img/vegetable.png");
  const noodle = loadImage("img/noodle.png");
  imgHotPotList = [loadImage("img/hotpot.png"), loadImage("img/hotpot_1.png")];
  imgBowl = loadImage("img/bowl.png");
  particleTexture = loadImage('/img/particle_texture.png');
  imgFoodList = [
    { "value": beef, "name": "beef" },
    { "value": beefOmasum, "name": "beefOmasum" },
    { "value": crabWillow, "name": "crabWillow" },
    { "value": duckBlood, "name": "duckBlood" },
    { "value": ringingRoll, "name": "ringingRoll" },
    { "value": vegetable, "name": "vegetable" },
    { "value": noodle, "name": "noodle" },
    { "value": bambooShoots, "name": "bambooShoots" }
  ];
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  // pot
  hotPot = new Pot(width / 2, height / 2 - 80, 250);

  // food
  for (let i = 0; i < imgFoodList.length; i++) {
    let img = imgFoodList[i];
    ingredients.push(new Ingredient(50, 30 + 80 * i, 20, img.name, random(3, 10), img.value));
  }
  // ingredients.push(new Ingredient(50, 50, 20, "beef", 5));
  // ingredients.push(new Ingredient(50, 100, 20, "Lamb", 7));
  // ingredients.push(new Ingredient(50, 150, 20, "Noodle", 3, imgNoodle));

}

function draw() {
  background(255, 165, 0);

  // Draw pot
  hotPot.display();
  drawBowl()
  // Draw and update ingredients
  for (let i = 0; i < ingredients.length; i++) {
    let ing = ingredients[i];
    ing.drag();
    ing.checkBoiled(hotPot);
    ing.display();
  }
  if (particleSystem) {
    // Calculate the wind force based on the mouse x position
    let dx = 0;
    let wind = createVector(dx, -0.01);

    // Apply the wind and run the particle system
    particleSystem.applyForce(wind);
    particleSystem.run();
    particleSystem.addParticle();
  }

  // stroke(241, 157, 56)
  stroke(0)
  strokeWeight(2)
  push()
  translate(mouseX - 5, mouseY + 10)
  rotate(-0.1)
  line(0, -100, 0, 0)
  pop()

  push()
  translate(mouseX + 5, mouseY + 10)
  rotate(0.1)
  line(0, -100, 0, 0)
  pop()
}

function drawBowl() {
  push();
  imageMode(CENTER);
  bowlPos.x = width / 2;
  bowlPos.y = height / 2 + (250 * imgHotPotList[imgHotPotIndex].height / imgHotPotList[imgHotPotIndex].width);

  translate(bowlPos.x, bowlPos.y);
  image(imgBowl, 0, 0, 200, 200 * imgBowl.height / imgBowl.width);
  pop();
}

// Ingredient class
class Ingredient {
  constructor(x, y, rad, name, duration, img) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    //
    this.boiledTime = 0;
    // color
    this.r = 150;
    this.g = 150;
    this.b = 150;
    //
    this.name = name;
    this.duration = duration;
    this.img = img;
    this.life = true
  }
  display() {
    if (this.life) {

      push();
      translate(this.x, this.y);

      if (this.img) {
        tint(this.r, this.g, this.b);
        imageMode(CENTER);
        image(this.img, 0, 0, this.rad * 2, this.rad * 2);
      } else {
        fill(this.r, this.g, this.b);
        stroke(0);
        strokeWeight(2);
        circle(0, 0, this.rad * 2);
      }

      // name
      fill(0);
      noStroke();
      text(this.name, 0, 0);

      // display the boiled duration
      fill(0);
      text(this.boiledTime, 30, 20);
      text("Sec: " + floor(this.boiledTime / 60), 30, 40); // 60 frame per sec
      pop();
    }
  }
  drag() {
    if (this == selectedIngredient) {
      this.x = mouseX;
      this.y = mouseY;
    }
  }
  checkGrabbed(x, y) {
    let distance = dist(x, y, this.x, this.y);
    if (distance < this.rad) {
      selectedIngredient = this; // *****
    }
  }
  checkBoiled(pot) {
    let distance = dist(pot.x, pot.y, this.x, this.y);
    if (distance < pot.rad - this.rad) {
      this.boiledTime++;
      //
      let sec = this.duration * 60;
      if (this.boiledTime > sec - 60 && this.boiledTime < sec + 60) {
        // good time!
        this.r = 255;
        this.g = 255;
        this.b = 255;
      } else if (this.boiledTime >= 300) {
        // overcooked!
        this.r = 128;
        this.g = 128;
        this.b = 0;
      }
    }
  }
  checkBowl(bowlPos) {
    if (dist(bowlPos.x, bowlPos.y, this.x, this.y) < 65) {
      this.life = false;
    }
  }
}

class Pot {
  constructor(x, y, rad) {
    this.x = x;
    this.y = y;
    this.rad = rad;
    this.imgWidth = this.rad * 2;
    this.imgHeight = this.imgWidth * imgHotPotList[imgHotPotIndex].height / imgHotPotList[imgHotPotIndex].width;
    // button boundary
    this.btnBoundary = this.imgWidth / 2 + 50
    // Initialize the particle system
    particleSystem = new ParticleSystem(
      0,
      createVector(this.x, this.y),
      particleTexture,
      { w: 300, h: 60 }
    );
  }
  display() {
    push();
    translate(this.x, this.y); // shift the origin

    imageMode(CENTER);
    image(imgHotPotList[imgHotPotIndex], 0, 0, this.imgWidth, this.imgHeight);
    // play with this functon
    noFill();
    stroke(color('rgba(255, 255, 255, 0.6)'));
    ellipse(6, -26, this.imgWidth - 146, this.imgHeight - 90);
    strokeWeight(2);
    circle(random(-50, 100), random(-100, 100), random(10, 20));

    // Switch button
    fill(0)
    let x = this.btnBoundary
    triangle(x, 0, x + 50, 25, x, 50);
    triangle(-x, 0, -x - 50, 25, -x, 50);
    pop();
  }
  // next hotPot img button
  nextBtnclick() {
    let x = this.btnBoundary
    if (pointInTriangle(this.x + x, this.y, this.x + x + 50, this.y + 25, this.x + x, this.y + 50)) {
      imgHotPotIndex = (imgHotPotIndex + 1) % imgHotPotList.length;
    }
  }
  // prev hotPot img button
  prevBtnclick() {
    let x = this.btnBoundary
    if (pointInTriangle(this.x - x, this.y, this.x - x - 50, this.y + 25, this.x - x, this.y + 50)) {
      imgHotPotIndex = (imgHotPotIndex - 1 + imgHotPotList.length) % imgHotPotList.length;
    }
  }
}

class ParticleSystem {
  constructor(particleCount, origin, textureImage, imgSize) {

    this.particles = [];

    // Make a copy of the input vector
    this.origin = origin.copy();
    this.img = textureImage;
    this.imgSize = imgSize;
    for (let i = 0; i < particleCount; ++i) {
      this.particles.push(new Particle(this.origin, this.img, this.imgSize));
    }
  }

  run() {
    // Loop through and run each particle
    for (let i = this.particles.length - 1; i >= 0; i -= 1) {
      let particle = this.particles[i];
      particle.run();

      // Remove dead particles
      if (particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }

  // Apply force to each particle
  applyForce(dir) {
    for (let particle of this.particles) {
      particle.applyForce(dir);
    }
  }

  addParticle() {
    this.particles.push(new Particle(this.origin, this.img, this.imgSize));
  }
} // class ParticleSystem

class Particle {
  constructor(pos, imageTexture, imgSize) {
    this.loc = pos.copy();

    let xSpeed = randomGaussian();
    let ySpeed = randomGaussian() * 0.3 - 1.0;

    this.velocity = createVector(xSpeed, ySpeed);
    this.acceleration = createVector();
    this.lifespan = 100.0;
    this.texture = imageTexture;
    this.color = color('rgba(255, 255, 255, 0.06)');
    this.imgSize = imgSize;
  }

  // Update and draw the particle
  run() {
    this.update();
    this.render();
  }

  // Draw the particle
  render() {
    push();
    imageMode(CENTER);
    tint(color(`rgba(255, 255, 255, ${map(100 - this.lifespan, 0, 100.0, 0.01, 0.1)})`));
    image(this.texture, this.loc.x, this.loc.y, this.imgSize.w, this.imgSize.h);
    pop();
  }

  applyForce(f) {
    // Add the force vector to the current acceleration vector
    this.acceleration.add(f);
  }

  isDead() {
    return this.lifespan <= 0.0;
  }

  // Update the particle's position, velocity, lifespan
  update() {
    this.velocity.add(this.acceleration);
    this.loc.add(this.velocity);
    this.lifespan -= 1;

    // Set the acceleration to zero
    this.acceleration.mult(0);
  }
} // class Particle
function pointInTriangle(x1, y1, x2, y2, x3, y3) {
  var divisor = (y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3);
  var a = ((y2 - y3) * (mouseX - x3) + (x3 - x2) * (mouseY - y3)) / divisor;
  var b = ((y3 - y1) * (mouseX - x3) + (x1 - x3) * (mouseY - y3)) / divisor;
  var c = 1 - a - b;

  return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1
}

function mousePressed() {
  // check if an ingredient is clicked
  for (let i = 0; i < ingredients.length; i++) {
    let ing = ingredients[i];
    ing.checkGrabbed(mouseX, mouseY);
  }
}

function mouseReleased() {
  selectedIngredient = null;
  for (let i = 0; i < ingredients.length; i++) {
    let ing = ingredients[i];
    ing.checkBowl(bowlPos);
  }
}

function mouseClicked() {
  hotPot.nextBtnclick()
  hotPot.prevBtnclick()
}
