// question array, questions as objects
var questions = [
    {
        title: "Which one of this countires where never colonized?",
        choices: ["South Africa",
        "Keneya",
        "Uganda",
        "Ethiopia"],
        answer: "Ethiopia"
    },

    {
        title: "Where is the pyramid of giza located?",
        choices: ["Egypt", 
         "Sudan",
         "Ethiopia",
         "Congo"],
        answer: "Egypt"
    },

    {
        title: "The capital of Togo is?",
        choices: ["Lagos",
            "Asmera",
            "Addis Abeba", 
            "Lome"],
        answer: "Lome"
    },

    {
        title: "Where is the Nubian Desert?",
        choices: ["Ghana",
         "Kenya", 
         "Sudan", 
         "Morroco"],
        answer: "Sudan"
    },

    {
        title: "What is Nigeria's main export?",
        choices: ["Gold",
         "Coffee", 
         "Oil",
         "Wheat"],
        answer: "Oil"
    },

    {
        title: "How many countires are in Africa?",
        choices: [40,
                35,
                54,
                60],
        answer: 54
    },
];

// BASE VARIABLES //
var score = 0;
var questionIndex = 0;

// TIMER VARIABLES //
var startTimer = document.querySelector("#startTimeBtn");
var currentTime = document.querySelector("#currentTime");
var timeLeft = 80;
var timePenalty = 10;
var holdInterval = 0;

// QUIZ SECTION VARIABLES //
// h2 title, hide on start
var title = document.querySelector("#quizTitle");
var quiz = document.querySelector("#quiz");
var quizInfo = document.querySelector("#quizInfo");
// div container for questions and answers
var questionDiv = document.querySelector("#questionDiv");
// p element that becomes quiz question
var quizText = document.querySelector("#quizText");
// special msg variable, use this to display corrent or incorrect over answer text, or highscore?
var specialMsg = document.querySelector("#specialMsg");



// function click start button will start time, hide title, button and quizinfo text
startTimer.addEventListener("click", function(){
    // hide title and start button
    title.hidden = true;
    startTimer.hidden = true;
    
    // timer countdown from 80, calls endQuiz when timer hits 0
    if (holdInterval === 0) {
        holdInterval = setInterval(function() {
            timeLeft--;
            currentTime.textContent = "Timer: " + timeLeft;

            if (timeLeft === 0) {
                clearInterval(holdInterval);
                currentTime.textContent = "Time's Up!";
                endQuiz();
            }
        }, 1000);
    }

    // call questionStart(); with current questionIndex as argument
    questionStart(questionIndex);
});


// renders questions and answer choices to page
var questionStart = function(questionIndex) {
    // clear existing data
    questionDiv.innerHTML = "";
    quizText.innerHTML = "";

    // create questions and choices based on current questionIndex
    var question = questions[questionIndex].title;
    var choices = questions[questionIndex].choices;
    quizText.textContent = question;

    // create button for choices, with style attributes and text based on current questionIndex
    var choiceBtn = document.createElement("button");
    choiceBtn.setAttribute("class", "btn");
    choiceBtn.textContent = choices;

    // split each choice into its own button, event listener to check answer function
    choices.forEach(function (newItem){
        var choiceBtn = document.createElement("button");
        choiceBtn.setAttribute("class", "btn");
        choiceBtn.textContent = newItem;
        questionDiv.appendChild(choiceBtn);
        choiceBtn.addEventListener("click", (compareSelection));
    })
};

// function to compare selection to correct answer
 var compareSelection = function(event) {
     var element = event.target;

     if (element.matches(".btn")) {

        if (element.textContent == questions[questionIndex].answer) {
            score++;
        } else {
           timeLeft = timeLeft - timePenalty;
        }
     }
     // try to set hidden to true here
     // increase questionIndex for next question
     questionIndex++;

     // check if any questions remain, if true call endQuiz(), otherwise restart questionStart with new argument
     if (questionIndex >= questions.length) {
         endQuiz();
     } else {
         questionStart(questionIndex);
     }
 };


 // function to end quiz, enter initials, save score to LS, switch to highscore board on submit
 var endQuiz = function() {
    // clear existing data, hide timer
    questionDiv.innerHTML = "";
    quizText.innerHTML = "";
    currentTime.innerHTML = "";
    
    title.hidden = false;
    title.textContent = "Time's Up!";
    title.setAttribute("class", "title");

    // calculate time remaining, set and replace to score
    if (timeLeft >= 0) {
        var timeRemaining = timeLeft;
        // stop timer
        clearInterval(holdInterval);
        quizText.setAttribute("class", "message");
        quizText.textContent = "Your final score is: " + timeRemaining;
        quizInfo.appendChild(quizText);
    } else if (timeLeft < 0) {
        var timeRemaining = 0;
        // stop timer
        clearInterval(holdInterval);
        quizText.setAttribute("class", "message");
        quizText.textContent = "Your final score is: " + timeRemaining;
        quizInfo.appendChild(quizText);
    }

    // submit highscore section //
    // change questionDiv to form class for styling
    questionDiv.setAttribute("class", "form");

    // label and input 
    var createLabel = document.createElement("label");
    createLabel.setAttribute("id", "label");
    createLabel.textContent = "Enter initials: ";

    questionDiv.appendChild(createLabel);

    var createInput = document.createElement("input");
    createInput.setAttribute("type", "text");
    createInput.setAttribute("id", "initials")
    createInput.textContent = "";

    questionDiv.appendChild(createInput);

    // submit button
    var submit = document.createElement("button");
    submit.setAttribute("type", "submit");
    submit.setAttribute("id", "submit");
    submit.setAttribute("class", "btn");
    submit.textContent = "Save HighScore!";
    questionDiv.appendChild(submit);

    // save initials and score to localStorage
    submit.addEventListener("click", function(){
        // pull value from input
        var userInitials = createInput.value;

        // create object for final score
        var finalScore = {
            initials: userInitials,
            score: timeRemaining
        }

        var allScores = localStorage.getItem("allScores");

        if (allScores === null) {
            allScores = [];
        } else {
            allScores = JSON.parse(allScores);
        }

        allScores.push(finalScore);

        var newScore = JSON.stringify(allScores);
        localStorage.setItem("allScores", newScore);

        location.replace("./highscores.html");
        }
    );

 };