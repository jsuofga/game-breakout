// Get DOM elements
rulesBtn = document.getElementById("how-to-play-btn")
closeBtn = document.getElementById("close-btn")
rules = document.getElementById("rules")
playAgainBtn = document.getElementById("play-again-btn")

//Add event Listners
rulesBtn.addEventListener("click", showRules);
closeBtn.addEventListener("click", closeRules);
document.addEventListener("keydown", updatePaddleLocation);
playAgainBtn.addEventListener("click", playAgain);

// setup canvas
var canvas = document.getElementById("gameCanvas");
var ctx = gameCanvas.getContext("2d");

// initialize globals
let ballSpeed = 3
let bricks = []
let score = 0
let life = 3


function showRules(){
    rules.classList.remove("hide-rules")
}

function closeRules(){
    rules.classList.add("hide-rules")
}


//Define Ball 
class Ball  {
    constructor(){
        this.x = canvas.width/2,   //ball x 
        this.y = canvas.height-100,  //ball y
        this.size = 10, //radius of ball
        this.dx = ballSpeed,
        this.dy = -ballSpeed // initially start ball moving up so use negative since canvas y direction
        this.play = true    // ball in play
        this.ballResponse = [-1.-.9,-.8,-.7,-.6,-.5,.5,.6,.7,.8,.9,1] // random ball trajectories
      
    }
     drawBall(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Outer circle
        ctx.fillStyle = '#ffffff'
        ctx.fill();
        ctx.closePath();
    }
    updateBallLocation(){

        // move ball 
            this.y = this.y + this.dy // initially start ball moving up
            this.x = this.x + this.dx // initially start ball moving right

        // ball collides with  top wall. If ball touches top, change y direction 180 degrees
         if(this.y -this.size < 0 ){
            this.dy *= -1
            this.y = this.y + this.dy 
            this.x = this.x + this.dx
        }
        // ball collides with left or right wall.If ball touches left or right, change X direction 180 degrees
        if (this.x -this.size < 0 || this.x + this.size > canvas.width){
            this.dx *= -1
            this.y = this.y + this.dy 
            this.x = this.x + this.dx
        }
        //  ball collides with bottom wall
        if(this.y - this.size > canvas.height){ 

            // Set flag to serve new ball. Pause the ball for 1 second
             this.play = false
             setTimeout(()=>{ this.play = true}, 1000)

            //  Decrement ballLife by 1
               life -= 1   

            // Serve another Ball
                paddle.x= canvas.width/2 - 50,  // move paddle to middle
                paddle.y= canvas.height-75, // move paddle to middle
                ball.x = canvas.width/2   //ball x 
                ball.y = paddle.y - paddle.height  //ball y
                ball.dx = ballSpeed
                ball.dy = -ballSpeed
          
        }

    }
    ballHitBrickTest(){
        //Cycle thru the bricks[] and test for collision with ball
        bricks.forEach((item,index)=>{
      
            // ball and paddle collision detection
            if(  ball.x + ball.size >= item.x && // left side
                 ball.x - ball.size <= item.x + item.width && //right side
                 ball.y + ball.size >= item.y  && // top side
                 ball.y - ball.size <= item.y + item.height // bottom side
              ){
                // console.log(`touched brick${index}`)

                //Remove touched brick from brick []
                    bricks.splice(index,1)
                // Bouce ball off Brick
                    ball.dx = 5
                    ball.dy = 5
                    this.dy *= -1
                    this.y = this.y + this.dy 
                    this.x = this.x + this.dx
                
                // Increment Score
                    score += 1
            }
        })

    }
}

let ball = new Ball

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Paddle {
    constructor(){
        this.width= 100,
        this.height= 30,
        this.x= canvas.width/2 - 50,
        this.y= canvas.height-75,
        this.speed=30,
        this.dx=0
    }
    drawPaddle(){
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }
    touchBallTest(){
        if(ball.x +  ball.size >= this.x && //left side
            ball.x - ball.size <= this.x + this.width  && //right side
            ball.y + ball.size >= this.y &&  // top
            ball.y -ball.size  <= this.y + this.height // top
            ){
                // ball touched paddle, change ball Y direction 180 degrees
                ball.dx = 3
                ball.dy = 3
                ball.dy *= -1
                ball.dx *= ball.ballResponse[Math.floor(Math.random() * ball.ballResponse.length)]
                ball.y = ball.y + ball.dy 
                ball.x = ball.x + ball.dx
         }
    }
}

let paddle = new Paddle

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Draw Score and Life Left
function drawScore(){
    ctx.font = "20px Arial";
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`Score: ${score}`, 10, 20);
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`Ball: ${life}`, 700, 20);
}

// Bricks Class constructor
class Brick {
    constructor(_i){
        this.id = _i
        this.row = Math.trunc(_i/10) + 1
        this.width = 50 //width of brick
        this.height = 20 //heigh of brick
        this.x_BetweenBricks = 27
        this.x = (this.x_BetweenBricks*(1+_i) + _i * this.width) - 772*(this.row -1)
        this.y = 60 * this.row;
        this.colorR = Math.floor(Math.random() * (Math.floor(255) - Math.ceil(100)) + Math.ceil(100)); // get a random R number betwee 100 -255
        this.colorG = Math.floor(Math.random() * (Math.floor(255) - Math.ceil(100)) + Math.ceil(100)); // get a random G number betwee 100 -255
        this.colorB = Math.floor(Math.random() * (Math.floor(255) - Math.ceil(100)) + Math.ceil(100)); // get a random B number betwee 100 -255
    }
    renderBrick(){
        //console.log(`brick ${this.id} at ${this.x}`)
        ctx.fillStyle = `rgb(${this.colorR },${this.colorG },${this.colorB })`;
        ctx.fillRect(this.x, this.y, this.width, this.height);
}

}

// Instantiate Bricks 
for(let i = 0; i<=39; i++){
    bricks[i] = new Brick(i)
}

//Draw Bricks
function drawBricks(){
    bricks.forEach( (item) => item.renderBrick())
}

// Paddle move. check for Left and Righ Arrow movement and change paddle x position
function updatePaddleLocation(e){
  
    if(e.key == 'ArrowLeft'){
        //boundary test
        if(paddle.x <= 0){
            paddle.x = paddle.x
        }else{
           paddle.x = paddle.x - paddle.speed
        }
       
    }else if(e.key == 'ArrowRight'){
          //boundary test
        if(paddle.x >= canvas.width - paddle.width){
            paddle.x = paddle.x
        }else{
           paddle.x = paddle.x + paddle.speed
        }
     
    }
}

function playAgain(){

    ball.play = true
    location.reload();
    

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function gameStatus(){
    if (life >= 1 && score < 36){

    }else if(life >= 1 && score == 36 ){
        ball.play = false
        ctx.font = "20px Arial";
        ctx.fillStyle = '#ffffff'
        ctx.fillText(`GAME OVER. Got All Bricks!`, 350, canvas.height/2);
        ctx.fillStyle = '#ffffff'
         // show play again button
         playAgainBtn.removeAttribute("hidden")
    } else{
        ball.play = false
        ctx.font = "20px Arial";
        ctx.fillStyle = '#ffffff'
        ctx.fillText(`GAME OVER`, 350, canvas.height/2);
        ctx.fillStyle = '#ffffff'

        // show play again button
        playAgainBtn.removeAttribute("hidden")
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// This is the main loop. draw() loop will repeat forever 
function draw(){  

    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(ball.play == true ){
        ball.updateBallLocation()
    }
    ball.ballHitBrickTest()
    ball.drawBall()
    paddle.touchBallTest()
    paddle.drawPaddle()
    drawBricks()
    drawScore()
    gameStatus()

    requestAnimationFrame(draw)  // setInterval and calls update 60 per second
}

// Call draw() once to start the draw loop recursively
draw()

