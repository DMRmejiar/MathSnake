var ctx;
var WIDTH;
var HEIGHT;

var dx = 20;
var dy = 20;
var dr = 15;

// 0: left
// 1: up
// 2: right
// 3: down
var direction;

var snake;
var size;

var correct_solution;
var trap;
var trap_num;

var id;

var solution_number;

var problem;

var snake_color = [
  "#d11141",
  "#00b159",
  "#00aedb",
  "#f37735",
  "#ffc425"
];

var actual_snake_color = "#d11141";

var actual_number_color = "#00b159";

function create_operation(){

  var operator = Math.floor(Math.random() * 4);
  var max_random_r;
  var max_random_l;
  if(operator > 1){
    max_random_r = 50;
    max_random_l = 100;
  }else{
    max_random_r = 100;
    max_random_l = 100;
  }
  var number_one = Math.floor(Math.random() * max_random_l) + 1;
  var number_two = Math.floor(Math.random() * max_random_r) + 1;
  if(operator ==  3){
    number_one = number_one * number_two;
  }

  switch (operator) {
    case 0:
      problem = number_one + " + " + number_two;
      trap_num = (number_one + number_two) + Math.floor(Math.random() * 3) + 1;
      solution_number = number_one + number_two;
      break;
    case 1:
      problem = number_one + " - " + number_two;
      trap_num = (number_one - number_two) + Math.floor(Math.random() * 3) + 1;
      solution_number = number_one - number_two;
      break;
    case 2:
      problem = number_one + " * " + number_two;
      trap_num = (number_one * number_two) + Math.floor(Math.random() * 3) + 1;
      solution_number = number_one * number_two;
      break;
    case 3:
      problem = number_one + " / " + number_two;
      trap_num = (number_one * number_two) + Math.floor(Math.random() * 3) + 1;
      solution_number = Math.floor(number_one / number_two);
      break;
    default:
  }
}

function init() {
  ctx = $('#canvas')[0].getContext("2d");
  WIDTH = $("#canvas").width();
  HEIGHT = $("#canvas").height();

  //init trap
  trap = Array();
  trap.x = 0;
  trap.y = 0;

  createsnake();
  new_number();
  new_trap();

  direction = 0;
  size = 0;

  id = setInterval(step, 700);
}

function onKeyDown(evt) {
  if (evt.keyCode == 32) {
    return;
  }
  newdir = evt.keyCode - 37;

  // only lateral turns are allowed
  // (that is, no u-turns)
  if (newdir != direction && newdir != direction+2 && newdir != direction-2) {
    direction = newdir;
  }
}

if ($.browser.mozilla) {
    $(document).keypress(onKeyDown);
} else {
    $(document).keydown(onKeyDown);
}

function createsnake() {
  snake = Array();
  var head = Array();
  head.x = WIDTH/2;
  head.y = HEIGHT/2;
  snake.push(head);
}

function collision(n, trap) {
  // are we out of the playground?
  if (n.x < 0 || n.x > WIDTH -1 || n.y < 0 || n.y > HEIGHT-1) {
    return true;
  }

  // are we eating ourselves?
  for (var i = 0; i < snake.length; i++) {
    if ((snake[i].x == n.x && snake[i].y == n.y) || (trap.x == n.x && trap.y == n.y)) {
      return true;
    }
  }
  return false;
}

function new_number() {
  create_operation();
  document.getElementById("problem").innerHTML = problem;

  var wcells = WIDTH/dx -8;
  var hcells = HEIGHT/dy -8;

  do{
    var flag = false;
    var randomx = Math.floor(Math.random()*wcells) + 4;
    var randomy = Math.floor(Math.random()*hcells) + 4;
    for (var i = 0; i < snake.length; i++) {
      if ((snake[i].x == randomx && snake[i].y == randomy)) {
        flag ==  true;
      }
    }
  }while(flag)
  correct_solution = Array();
  correct_solution.x = randomx * dx;
  correct_solution.y = randomy * dy;
  correct_solution.r = dr;
  size = size+1;
}

function new_trap() {

  var wcells = WIDTH/dx -8;
  var hcells = HEIGHT/dy -8;

  do{
    do{
      var flag = false;
      var randomx = Math.floor(Math.random()*wcells) + 4;
      var randomy = Math.floor(Math.random()*hcells) + 4;
      for (var i = 0; i < snake.length; i++) {
        if ((snake[i].x == randomx && snake[i].y == randomy)) {
          flag ==  true;
        }
      }
    }while(flag)

  trap = Array();
  trap.x = randomx * dx;
  trap.y = randomy * dy;

  }while(trap.x == correct_solution.x || trap.y == correct_solution.y)

  trap.r = dr;
}

function meal(n) {
  return (n.x == correct_solution.x && n.y == correct_solution.y);
}

function movesnake() {

  h = snake[0]; // peek head

  // create new head relative to current head
  var n = Array();
  switch (direction) {
    case 0: // left
      n.x = h.x - dx;
      n.y = h.y;
      break;
    case 1: // up
      n.x = h.x;
      n.y = h.y - dy;
      break;
    case 2: // right
      n.x = h.x + dx;
      n.y = h.y;
      break;
    case 3: // down
      n.x = h.x;
      n.y = h.y + dy;
      break;
  }

  // if out of box or collision with ourselves, we die
  if (collision(n, trap)) {
    return false;
  }

  snake.unshift(n);

  // if there's correct_solution there
  if (meal(n)) {
    var numbercolortemp = Math.floor(Math.random() * 5);
    actual_snake_color = snake_color[numbercolortemp];
    actual_number_color = snake_color[(numbercolortemp-1)%5];
    new_number(); // we eat it and another shows up
    new_trap();

  } else {
    snake.pop();
    // we only remove the tail if there wasn't correct_solution
    // if there was correct_solution, the snake grew
  }

  return true;

}

function die() {
  if (id) {
    clearInterval(id);
  }
  gameStarted = false;
}

function rect(x,y,w,h) {
  ctx.beginPath();
  ctx.rect(x,y,w,h);
  ctx.closePath();
  ctx.fill();
}

function screenclear() {
  ctx.fillStyle = "#000000";
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  rect(0,0,WIDTH,HEIGHT);
}

function drawsnake() {
  ctx.fillStyle = actual_snake_color;
  snake.forEach(function(p) {
    rect(p.x, p.y, dx, dy);
  })
}

function draw_correct_solution() {
  ctx.fillStyle = actual_number_color;
  ctx.fillText(solution_number,correct_solution.x+correct_solution.r-10, correct_solution.y+correct_solution.r+3);
}

function draw_trap() {
  ctx.fillStyle = actual_number_color;
  ctx.fillText( trap_num,trap.x+trap.r-10, trap.y+trap.r+3);
}
