//audio assets
class AudioController{
    constructor(){
        this.bgmusic =new Audio('audio/2-cherry-cute-bgm-271158.mp3');
        this.flipSound = new Audio('audio/flipcard.mp3');
        this.matchSound = new Audio('audio/match-sound.mp3');
        this.victorySound = new Audio('audio/success.mp3');
        this.gameOverSound= new Audio('audio/game-over-arcade.mp3');
        this.bgmusic.volume=0.6;
        this.matchSound.volume= 0.5;
        this.bgmusic.loop= true;
    }
    startMusic(){
        this.bgmusic.play();
    }
    stopMusic(){
        this.bgmusic.pause();
        this.bgmusic.currentTime =0;
    }
    flip(){
        this.flipSound.play();
    }
    match(){
        this.matchSound.play();
    }
    victory(){
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver(){
        this.stopMusic();
        this.gameOverSound.play();
    }
}


//mix and match class
class mixandmatch{
    constructor(totalTime, cards){
        this.cardArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining  = totalTime;
        this.timer = document.getElementById('time');
        this.ticker = document.getElementById('Flips');
        this.audioController= new AudioController();

     }
     startGame(){
        this.cardToCheck = null;//the frist to click or is there card to check
        this.totalClicks = 0;
        this.timeRemaining= this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffelCards(this.cardArray);
            this.countDown = this.startCountDown();
            this.busy=false;
            },500);
            this.hideCards();
            this.timer.innerText = this.timeRemaining;
            this.ticker.innerText= this.totalClicks;
       
     }
      hideCards(){
        this.cardArray.forEach(card =>
        {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
      }
     //updating flip counts
     flipCard(card){
            if(this.canFlipCard(card)){
                this.audioController.flip();
                this.totalClicks++;
                this.ticker.innerText = this.totalClicks;
                card.classList.add('visible');
    
                //if stmt  
                if(this.cardToCheck)
                    //check for match
                    this.checkForCardMatch(card);
                else
                this.cardToCheck = card; 
            }
         }
        
    //card match
    checkForCardMatch(card){
        if(this.getCardType(card) === this.getCardType(this.cardToCheck))
            //match
             this.cardMatch(card, this.cardToCheck);
        else
              this.misMatched(card, this.cardToCheck);
    
    
        this.cardToCheck= null;
    }
    
    //getCardType(card){}
    
    
    cardMatch(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if (this.matchedCards.length === this.cardArray.length)
            this.victory();
    
    }
    misMatched(card1,card2){
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        },1000);
    
    }
    
    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }
    startCountDown(){
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText= this.timeRemaining;
            if(this.timeRemaining === 0){
                
                    this.gameOver();
                
            }
        },1000);
      }


        gameOver(){
            clearInterval(this.countDown);
            this.audioController.gameOver();
            document.getElementById('game-over').classList.add('visible');
        }

        victory(){
            clearInterval(this.countDown);
            this.audioController.victory();
            document.getElementById('win').classList.add('visible');
        }

     shuffelCards(){
        for (let i = this.cardArray.length - 1; i> 0; i--){
            let randIndex = Math.floor(Math.random() * ( i+1));
            this.cardArray[randIndex].style.order = i;
            this.cardArray[i].style.order = randIndex;

        };
     }

     canFlipCard(card){
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck;
     }
}




//on ready
function ready(){
  let overlays =Array.from(document.getElementsByClassName('overlay-text'));
  let cards = Array.from(document.getElementsByClassName('card')); 
    let game = new mixandmatch(100,cards);


  overlays.forEach(overlay => {
    overlay.addEventListener('click', () => 
    {
        overlay.classList.remove('visible');
        game.startGame();
      
  });
  });
  cards.forEach(card =>{
    card.addEventListener('click',()=>{
        game.flipCard(card);
    });
  } );

}



window.onload = function() {
    // Retrieve the name from localStorage
    const userName = localStorage.getItem('userName');  

    if (userName) {
        showCenteredMessage(`Welcome back, ${userName}! ◝(ᵔᵕᵔ)◜✨`);
    } else {
    
        showModal();
    }
};

// Function to display the centered message in the middle of the screen for a few seconds
function showCenteredMessage(message) {
    const messageElement = document.getElementById('centeredMessage');
    messageElement.innerText = message;  t
    messageElement.style.display = 'block'; 

    setTimeout(() => {
        messageElement.style.display = 'none'; 
    }, 3000);
}

// Show the modal for entering the name
function showModal() {
 
    document.getElementById('overlay').style.display = 'flex';
    document.body.classList.add('no-scroll'); 

    // Handle the form submission
    document.getElementById('submitName').onclick = function() {
        const enteredName = document.getElementById('nameInput').value;
        if (enteredName) {
          
            localStorage.setItem('userName', enteredName);
            document.getElementById('overlay').style.display = 'none';
            document.body.classList.remove('no-scroll');
            showCenteredMessage(`Welcome, ${enteredName}! (๑'ᵕ'๑)⸝*✨`);
        } else {
            alert('Please enter a name!');
        }
    };
}

if (document.readyState =='loading'){
    document.addEventListener('DOMContentLoaded',ready);
}else{
    ready();
}

let audioController = new AudioController();