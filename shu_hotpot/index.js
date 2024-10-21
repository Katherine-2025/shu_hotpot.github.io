let playerY; // 玩家的位置
let mountainImg; // 山的背景图片
let scrollY; // 视角的Y轴移动量
let posY;
let reachedTop = false;

function preload() {
  // 加载山的图片
  mountainImg = loadImage('pictures/Mountain2.jpg');
  yinyangImg = loadImage('pictures/yinyang.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  playerY = height - 50; // 玩家初始位置
  scrollY = 0;
  posY = 0;
  textAlign(CENTER, CENTER)
}

function draw() {
  background(200);

  // 如果还没有到达山顶，继续移动视角

  posY = lerp(posY, scrollY, 0.05); // ***
  image(mountainImg, 0, posY - height, width, height * 2);

  // 绘制玩家
  fill(255, 0, 0);
  //ellipse(width / 2, playerY - posY, 30, 30);
  image(yinyangImg, width / 2, playerY - posY, 30, 30)


  // 如果scrollY移动到一定值，表示到达山顶
  if (scrollY >= 300) {
    reachedTop = true
    textSize(32);
    fill(0);
    text("You reached the top!", width / 2, height / 2);
  }

  if (scrollY == 0) {
    fill(255)
    textSize(20);
    text('Climbing the Shu Road is no easy task. Every step forward takes effort——press space to keep going!', width / 4, 0, width / 2, height);
  }
}

function keyPressed() {
  // 按空格键控制视角上升
  if (key === ' ' && !reachedTop) {
    scrollY += 3;

    if (scrollY >= 300) {
      setTimeout(() => {
        location.href = 'huoguo.html'
      }, 1000);
    }
  }
}
