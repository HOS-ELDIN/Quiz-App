//timer set up
let maintimer = 90;
let timer = maintimer;

// define category span
let testCategory = document.querySelector(".category span");

// define the question
let question = document.querySelector(".quiz-area h2");

// define th answers
let answers = document.querySelectorAll("label");

// define the questions count
let questionCount = document.querySelector(".count span");

// define bullets container
let bulletsContainer = document.querySelector(".bullets");

// define  count down
let pageCountDown = document.querySelector(".count-down");
let minCountDown = document.querySelector(".minutes");
let secCountDown = document.querySelector(".seconds");

// define submit button
let submit = document.querySelector(".submit-button");

// define start window
let start = document.querySelector(".start");

// define start button
let go = document.querySelector(".go");

// define exam selector
let select = document.querySelector(".start select");

// random array for questions
let randomArrayLength = 6;
let randomArray = [];
if (randomArrayLength > 2) {
  while (randomArray.length < randomArrayLength) {
    let randomNumber = Math.floor(Math.random() * randomArrayLength);
    if (randomArray.includes(randomNumber) == false) {
      randomArray.push(randomNumber);
    }
  }
  // console.log(randomArray);
}

//number of the current question
let quesSequence = 0;
let qusNumber = randomArray[quesSequence];

// put category and question count on load
window.onload = () => {
  let testName = document.querySelector(".start select").value;
  testCategory.innerHTML = testName.toUpperCase();
  fetchQuestion(testName, qusNumber);
};

// change category and question count on select
select.oninput = () => {
  let testName = document.querySelector(".start select").value;
  console.log(testName);
  testCategory.innerHTML = testName.toUpperCase();
  fetchQuestion(testName, qusNumber);
};

// starting exam
go.onclick = () => {
  let testName = document.querySelector(".start select").value;

  // hide start window
  start.style.display = "none";
  //##############################################################
  // timer start
  resetTimer();
  let interval = setInterval(countDown, 1000);
  //#############################################################3
  // fetch exam
  fetch(`${testName}_questions.json`)
    .then((response) => {
      let data = response.json();
      return data;
    })
    .then((questions) => {
      // get the questions count
      // let questionsCount = questions.length;
      let questionsCount = randomArrayLength;

      // create bullets upon count
      createBullets(questionsCount);

      let bullets = document.querySelectorAll(".bullets span");
      //adding classes to the bullets
      bullets[quesSequence].classList.add("active");
      bullets[quesSequence].classList.add("done");

      //define the score
      let rightScore = 0;
      let wrongScore = 0;

      //handling submit
      submit.addEventListener("click", () => {
        clearInterval(interval);
        //get selected answer
        let selectedAnswer = document.querySelector(
          ".answers-area .answer input:checked + label"
        );

        // get the right answer
        let rightAns = questions[qusNumber].right_answer;
        // check if the answer is right
        let selected = selectedAnswer ?? question;
        if (selected.innerText === rightAns) {
          rightScore++;
        } else {
          wrongScore++;
        }
        // get the next question
        quesSequence++;
        qusNumber = randomArray[quesSequence];
        //fetch the next question
        if (quesSequence < questionsCount) {
          fetchQuestion(testName, qusNumber);
          bullets[quesSequence].classList.add("active");
          bullets[quesSequence].classList.add("done");

          // reset timer
          resetTimer();
          interval = setInterval(countDown, 1000);
        }
        //remove active from previous bullet
        bullets[quesSequence - 1].classList.remove("active");

        // check if the exam is done
        if (quesSequence == questionsCount) {
          // clearInterval(interval);
          //show result window
          let result = document.querySelector(".result");
          let score = document.querySelector(".result .score");
          let fullMark = document.querySelector(".result .full-mark");
          let test = document.querySelector(".test-name");
          test.innerHTML = testName;
          score.innerHTML = rightScore;
          fullMark.innerHTML = questionsCount;
          result.style.display = "flex";
        }
      });
    });
  //##############################################################
};

// function to fetch Question
function fetchQuestion(testName, qusNumber) {
  fetch(`${testName}_questions.json`)
    .then((response) => {
      let data = response.json();
      return data;
    })
    .then((questions) => {
      // selecting question number
      let questionTilte = questions[qusNumber].title;
      let ansOne = questions[qusNumber].answer_1;
      let ansTwo = questions[qusNumber].answer_2;
      let ansThree = questions[qusNumber].answer_3;
      let ansFour = questions[qusNumber].answer_4;

      // run the get qustion that put the question into page
      getQuestion(questionTilte, ansOne, ansTwo, ansThree, ansFour);
      questionCount.innerHTML = randomArrayLength;

      //get all answers and remove checked status
      let answers = document.querySelectorAll(".answer input");
      answers.forEach(removeCheck);
    });
}

// function to put the question into page
function getQuestion(fQuestion, ans1, ans2, ans3, ans4) {
  question.innerText = fQuestion;
  let randomArray = [];
  while (randomArray.length < 4) {
    let randomNumber = Math.floor(Math.random() * 4);
    if (randomArray.includes(randomNumber) == false) {
      randomArray.push(randomNumber);
    }
  }
  answers[randomArray[0]].innerText = ans1;
  answers[randomArray[1]].innerText = ans2;
  answers[randomArray[2]].innerText = ans3;
  answers[randomArray[3]].innerText = ans4;
}
// function to create bullets and but question count
function createBullets(num) {
  // questionCount.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    bulletsContainer.appendChild(bullet);
  }
}

// test again
let testAgain = document.querySelector(".result button");
testAgain.addEventListener("click", () => {
  window.location.reload();
});

// function to remove checked status
function removeCheck(e) {
  e.checked = false;
}
// count down function
function countDown() {
  timer--;

  // min formating
  minCountDown.innerHTML = Intl.NumberFormat("en", {
    minimumIntegerDigits: 2,
  }).format(Math.floor(timer / 60));

  // sec formating
  secCountDown.innerHTML = Intl.NumberFormat("en", {
    minimumIntegerDigits: 2,
  }).format(timer % 60);

  // action on timer end
  if (timer == 0) {
    // some delay to let the 00:00 show in app
    setTimeout(function () {
      submit.click();
    }, 700);
  }
}
// count down reset
function resetTimer() {
  timer = maintimer;
  minCountDown.innerHTML = Intl.NumberFormat("en", {
    minimumIntegerDigits: 2,
  }).format(Math.floor(timer / 60));
  secCountDown.innerHTML = Intl.NumberFormat("en", {
    minimumIntegerDigits: 2,
  }).format(timer % 60);
}
