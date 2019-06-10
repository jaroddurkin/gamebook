/*

These are the game scripts for Gamebook.
All games should have one function to place their content into the division #game_inner on the note page and run the
game for the first time. All games should automatically restart.

Go to the bottom of this file for a list of games.

 */

/*
Touch Swipe

 */
function swipedetect(el, callback){

    var touchsurface = el,
    swipedir,
    startX,
    startY,
    distX,
    distY,
    threshold = 150, //required min distance traveled to be considered swipe
    restraint = 100, // maximum distance allowed at the same time in perpendicular direction
    allowedTime = 300, // maximum time allowed to travel that distance
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}

    touchsurface.addEventListener('touchstart', function(e){
        var touchobj = e.changedTouches[0]
        swipedir = 'none'
        dist = 0
        startX = touchobj.pageX
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)

    touchsurface.addEventListener('touchmove', function(e){
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)

    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}

/*

BIC BAC BOE
RunBicBacBoe() to start

Modified from tutorial by Cody Seibert
Available at https://www.youtube.com/watch?v=ra2_rKV0mDE

*/

const BBB_PLAYER_TOKEN = 'X';
const BBB_COMPUTER_TOKEN = 'O';
let grid = [
        [' ',' ',' '],
        [' ',' ',' '],
        [' ',' ',' ']
        ];

function BBBGameOver(player) {
    let winner = $("#winner");
    winner.text(player + " wins!");
    winner.show();
    setTimeout(function(){ winner.hide(); BBBRestart() }, 2000)
}

function BBBRestart() {
    grid = [
        [' ',' ',' '],
        [' ',' ',' '],
        [' ',' ',' ']
        ];
    $(".bbb-col").text("");
}

function BBBIsGameOver() {
    // Check for every possible combination of
    for (let i = 0; i < 3; i++) {
        if (grid[i][0] !== ' ' && grid[i][0] === grid[i][1] && grid[i][0] === grid[i][2]) {
            return grid[i][0]
        }
    }

    for (let j = 0; j < 3; j++) {
        if (grid[0][j] !== ' ' && grid[0][j] === grid[1][j] && grid[0][j] === grid[2][j]) {
            return grid[0][j]
        }
    }

    if (grid[0][0] !== ' ' && grid[0][0] === grid[1][1] && grid[0][0] === grid[2][2]) {
        return grid[0][0]
    }

    if (grid[2][0] !== ' ' && grid[2][0] === grid[1][1] && grid[2][0] === grid[0][2]) {
        return grid[2][0]
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === ' '){
                return false;
            }
        }
    }


    return "It's a TIE! NO ONE ";
}

function BBBMoveAI() {
    let empty_spaces = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (grid[i][j] === ' ') {
                empty_spaces.push([i,j])
            }
        }
    }

    if(empty_spaces.length > 0) {
    let rand = empty_spaces[Math.floor(Math.random() * empty_spaces.length)];
        return {
            i: rand[0],
            j: rand[1]
        };
    }
    return null;
}

function RunBicBacBoe() {

    $("#game_inner").html('<div id="bicbacboe"> <div class="bbb-row"> <div class="bbb-col" data-i=0 data-j=0></div> <div class="bbb-col" data-i=0 data-j=1></div> <div class="bbb-col" data-i=0 data-j=2></div> </div> <div class="bbb-row"> <div class="bbb-col" data-i=1 data-j=0></div> <div class="bbb-col" data-i=1 data-j=1></div> <div class="bbb-col" data-i=1 data-j=2></div> </div> <div class="bbb-row"> <div class="bbb-col" data-i=2 data-j=0></div> <div class="bbb-col" data-i=2 data-j=1></div> <div class="bbb-col" data-i=2 data-j=2></div> </div> <div id="winner"></div> </div>');

    $(".bbb-col").click(function() {
        let $this = $(this);
        const i = $(this).data('i');
        const j = $(this).data('j');
        if (grid[i][j] != " " || BBBIsGameOver() !== false) {
            return false;
        }

        $this.html(BBB_PLAYER_TOKEN);


        grid[i][j] = BBB_PLAYER_TOKEN;

        let gameState = BBBIsGameOver();
        if (gameState) {
            BBBGameOver(gameState);
            return;
        } else {
            const move = BBBMoveAI();
            grid[move.i][move.j] = BBB_COMPUTER_TOKEN;
            $('.bbb-col[data-i=' + move.i + '][ data-j=' + move.j + ']').html(BBB_COMPUTER_TOKEN);
        }
        gameState = BBBIsGameOver();
        if (gameState) {
            BBBGameOver(gameState)
        }
    });
}


/*

SNACK

 */

let cvs, ctx;
let box = 25;
let snake, food, score, d, game;

function RunSnack() {
    $("#game_inner").html('<div id="snake_container"><canvas id="snake" width="475" height="475"></canvas></div>');
    cvs = document.getElementById('snake');
    ctx = cvs.getContext('2d');
    restart();
}

function restart() {
    clearInterval(game);
    snake = [];
    snake[0] = {
        x : 9 * box,
        y : 10 * box
    };

    food = {
        x : Math.floor(Math.random()*17+1) * box,
        y : Math.floor(Math.random()*15+3) * box
    }
    score = 0;
    d = "";
    swipedetect(cvs, function(swipedir){
        let new_dir = swipedir.toUpperCase()
        if( new_dir == "LEFT" && d != "RIGHT"){
            d = "LEFT";
        }else if(new_dir == "UP" && d != "DOWN"){
            d = "UP";
        }else if(new_dir == "RIGHT" && d != "LEFT"){
            d = "RIGHT";
        }else if(new_dir == "DOWN" && d != "UP"){
            d = "DOWN";
        }
    })
    document.addEventListener("keydown",direction);
    game = setInterval(draw,120);
}
function direction(event){
    let key = event.keyCode;
    if( key == 37 && d != "RIGHT"){
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
    }
}
function draw(){
    ctx.fillStyle = "#89CFF0";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = "white";
    ctx.fillRect(box,3*box,17*box,15*box);
    ctx.fillStyle = "black";
    ctx.strokeRect(box,3*box,17*box,15*box);
    for(let i = 0; i < snake.length; i++){
        ctx.fillStyle = (i === 0)? "green" : "yellow";
        ctx.fillRect(snake[i].x,snake[i].y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    ctx.fillStyle = "red";
    ctx.fillRect(food.x,food.y,box,box);
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if( d === "LEFT") snakeX -= box;
    if( d === "UP") snakeY -= box;
    if( d === "RIGHT") snakeX += box;
    if( d === "DOWN") snakeY += box;
    if(snakeX === food.x && snakeY === food.y){
        score++;
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
    }else{
        snake.pop();
    }
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    if(snakeX < box || snakeX > 17 * box ||
       snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        restart();
    } else {
        snake.unshift(newHead);
    }

    ctx.fillStyle = "black";
    ctx.font = "45px Helvetica";
    ctx.fillText(score,2*box,2*box);

}

function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x === array[i].x && head.y === array[i].y){
            return true;
        }
    }
    return false;
}



// All Games Here
const games = [RunBicBacBoe, RunSnack]

function RandomGame() {
    games[Math.floor(Math.random() * games.length)]()
}