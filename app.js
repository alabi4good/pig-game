/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

*/


let gameController = (()=> {
    var scores, currentScore, activePlayer, dice1, dice2, gamePlaying;
    
    var DOM = {
        btnRoll : '.btn-roll',
        dice1: '#dice1',
        dice2: '#dice2',
        btnHold: '.btn-hold',
        btnNew: '.btn-new',
        targetScore: '#score-target',
        rollIcon: '.ion-ios-loop',
        holdIcon: '.ion-ios-download-outline',
        newGameIcon: '.ion-ios-plus-outline',
        diceSound: '#diceSound',
        nextPlayerSound: '#nextPlayerSound',
        newGameSound: '#newGameSound',
        player1: '#name-0',
        player2: '#name-1'

    };

    var setUpEventListener = function() {
        //roll dice
        document.querySelector(DOM.btnRoll).addEventListener('click', rollDice);

        //update the GLOBAL SCORE
        document.querySelector(DOM.btnHold).addEventListener('click', updateScore);

        //start a new game
        document.querySelector(DOM.btnNew).addEventListener('click', gameStart);

        // remove animate class after transitionend
        document.querySelector(DOM.rollIcon).addEventListener('animationend', removeAnimation);
        document.querySelector(DOM.holdIcon).addEventListener('animationend', removeAnimation);
        document.querySelector(DOM.newGameIcon).addEventListener('animationend', removeAnimation);
    };

    // roll dice
    var rollDice = function() { 
        if(gamePlaying) {

            //animate the btn roll icon using animate.css classes
            document.querySelector(DOM.rollIcon).classList.add('animated');
            document.querySelector(DOM.rollIcon).classList.add('bounce');

            // Get dice images
            var diceImg1 = document.querySelector(DOM.dice1);
            var diceImg2 = document.querySelector(DOM.dice2);

            //1. get the both dices random numbers
            dice1 = Math.floor(Math.random() * 6) + 1;
            dice2 = Math.floor(Math.random() * 6) + 1;

            //2. use the random numbesr to display the the dice images in the UI
            diceImg1.src = 'img/dice-' + dice1 + '.png';
            diceImg2.src = 'img/dice-' + dice2 + '.png';
            diceImg1.style.display = 'block';
            diceImg2.style.display = 'block';

            //3. play the dice sound
            document.querySelector(DOM.diceSound).currentTime = 0;
            document.querySelector(DOM.diceSound).play();
    
            //3. if the dice is no equal to 1, update the current score and display in the UI for the activeplayer
            if(dice2 === 1 && dice1 === 1) {
                //4. switch to the next player
                nextPlayer();
            }else{
                currentScore += dice1 + dice2;
                document.querySelector('#current-' + activePlayer).textContent = currentScore;
            }
        }
        
    };

    //update the GLOBAL score
    var updateScore = function() {

        //animate the hold btn icon using animate.css classes
        document.querySelector(DOM.holdIcon).classList.add('animated');
        document.querySelector(DOM.holdIcon).classList.add('jello');

        //get target score
        var targetScore = document.querySelector(DOM.targetScore).value;
        //set  default value of targetScore = 100 if no value is entered
        targetScore = targetScore || 100;

        // Update the score as long as gameplaying is true
        if(gamePlaying) {
            //1. Add the currentScore of the active player to the score array
            scores[activePlayer] += currentScore;
        }

        //2. check if score is greater than or equal to the target score to know the winner
        if(scores[activePlayer] >= targetScore) {
            //Add the winner class to the activePlayer
            document.querySelector('#name-' + activePlayer).textContent = 'WINNER!';
            document.querySelector('#name-' + activePlayer).classList.add('winner');
            document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

            // Add animate.css classes to the winner
            document.querySelector('#name-' + activePlayer).classList.add('animated');
            document.querySelector('#name-' + activePlayer).classList.add('flip');

            // Remove the active class from the player
            document.querySelector('.player-'+ activePlayer + '-panel').classList.remove('active');

            //Hide the dice images
            document.querySelector(DOM.dice1).style.display = 'none';
            document.querySelector(DOM.dice2).style.display = 'none';

            //stop the game
            gamePlaying = false;
        }else{
            //If score is not up to 100, Update the score of the activeplayer in the UI
            document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
            
            //Move to the next player
            nextPlayer();
        }
            

        
    };

    // remove animate.css classes
    var removeAnimation = function(e) {
            e.target.classList.remove('animated');
            e.target.classList.remove('bounce'); 
            e.target.classList.remove('jello');
            e.target.classList.remove('wobble');      
    };

    //next player
    var nextPlayer = function() {
        
        activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;

        // Play next player sound
        document.querySelector(DOM.nextPlayerSound).currentTime = 0;
        document.querySelector(DOM.nextPlayerSound).play();

        // reset the current score back to zero and update it in the UI
        currentScore = 0;
        document.querySelector('#current-0').textContent = currentScore;
        document.querySelector('#current-1').textContent = currentScore;

        //hide the image again
        document.querySelector(DOM.dice1).style.display = 'none';
        document.querySelector(DOM.dice2).style.display = 'none';

        //toggle the active class from both players
        document.querySelector('.player-0-panel').classList.toggle('active');
        document.querySelector('.player-1-panel').classList.toggle('active');
        
    };

    var gameStart = ()=> {
        // reset all the scores when the game starts for the first time
        scores = [0, 0];
        currentScore = 0;
        activePlayer = 0;
        gamePlaying = true;
        
        document.querySelector(DOM.dice1).style.display = 'none';
        document.querySelector(DOM.dice2).style.display = 'none';
        document.querySelector('#current-0').textContent = '0';
        document.querySelector('#current-1').textContent = '0';
        document.querySelector('#score-0').textContent = '0';
        document.querySelector('#score-1').textContent = '0';

        document.querySelector('.player-0-panel').classList.remove('active');
        document.querySelector('.player-1-panel').classList.remove('active');
        document.querySelector('.player-0-panel').classList.add('active');

        document.querySelector('#name-0').classList.remove('winner');
        document.querySelector('#name-1').classList.remove('winner');
        document.querySelector('#name-0').textContent = 'Player 1';
        document.querySelector('#name-1').textContent = 'Player 2';
        
        document.querySelector('#score-target').value = '';

        //animate the new btn icon using animate.css classes
        document.querySelector(DOM.newGameIcon).classList.add('animated');
        document.querySelector(DOM.newGameIcon).classList.add('wobble');

        // Remove the animate.css flip class from both players on game start or new game
        document.querySelector(DOM.player1).classList.remove('flip');
        document.querySelector(DOM.player2).classList.remove('flip');

        //Play the new game sound
        document.querySelector(DOM.newGameSound).currentTime = 0;
        document.querySelector(DOM.newGameSound).play();
        
    }

    return {
        init: ()=> {
            gameStart();         
            // Event handler
            setUpEventListener();
        }
    }
    
})();

gameController.init();




