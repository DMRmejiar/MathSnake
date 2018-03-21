var gameStarted = false;

$( document ).ready(function() {
    showIntro();

    // Start game on spacebar press.
    this.onkeypress = function(e) {
      if (gameStarted == false && e.keyCode == 32) { // 32 = Spacebar
        gameStarted = true;
        gamerun();
      }
    }

});

function gamerun() {
  init();
}

function step(){
  update();
  draw();
}

function update() {
  if (!movesnake()) {
    die();
    showConclusion(size)
  }
}

function draw() {
  if (gameStarted) {
      screenclear();
      drawsnake();
      draw_correct_solution();
      draw_trap();
  }
}

function showIntro() {
    var canvas = document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    ctx.font="30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("SERPIENTE MATEMATICA", canvas.width/2, canvas.height/2);

    ctx.font="20px Arial";
    ctx.fillText("presiona espacio para comenzar", canvas.width/2, canvas.height/2+40);
}

function showConclusion(score) {
    screenclear();
    document.getElementById("problem").innerHTML = "";
    var canvas = document.getElementById("canvas");
    var ctx=canvas.getContext("2d");
    ctx.font="30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("FIN DEL JUEGO", canvas.width/2, canvas.height/2);
    ctx.fillText("respuesta correctas: " + score, canvas.width/2, canvas.height/2-40);
    ctx.font="20px Arial";
    ctx.fillText("presiona espacio para comenzar", canvas.width/2, canvas.height/2+80);
}
