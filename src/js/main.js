//Use CommonJS style via browserify to load other modules

var $ = require("jquery");
var ich = require("icanhaz");
var questionTemplate = require("./_questionTemplate.html");
var resultTemplate = require("./_resultTemplate.html");

var score = 0;
var id = 1;

// Set up templates
ich.addTemplate("questionTemplate", questionTemplate);
ich.addTemplate("resultTemplate", resultTemplate);

var Share = require("share");
new Share(".share-button", {
  ui: {
    flyout: "bottom left"
  }
});

var showQuestion = function(questionId) {
  $(".index").html(id + " of " + Object.keys(window.quizData).length);
  $(".question-box").html(ich.questionTemplate(window.quizData[id]));
};

var watchInput = function() {
// show next button when answer is selected
  $(".quiz-box").on("click", "input", (function(){
    $(".next").addClass("active");
    $(".next").attr("disabled", false);
  }));
};

var watchNext = function() {
  $(".next").click(function() {
    // score answer
    var correct = $("input:checked").val();
    if (correct) { score += 1 }
    // keep track of selected answer
    quizData[id].answers.forEach(function(answer) {
      if (answer.id == $("input:checked").attr("id")) {
        answer.selected = "x";
      }
    });

    // move on to next question
    if (id < Object.keys(window.quizData).length) {
      id += 1;
      showQuestion(id);
      $(".next").removeClass("active");
      $(".next").attr("disabled", true);
      // Change button text on last question
      if (id == Object.keys(window.quizData).length) {
        $(".next").html("FINISH");
      }
    } else {
      calculateResult();
    }
  });
};

var calculateResult = function() {
  for (var index in resultsData) {
    var result = resultsData[index];
    if (score >= result.min && score <= result.max) {
      // display result
      result.score = score;
      var answerKey = [];
      for (var question in quizData) { answerKey.push(quizData[question]) }
      result.answerKey = answerKey;
      $(".quiz-box").html(ich.resultTemplate(result));
    }
  }

  $(".retake").removeClass("hidden");
  $(".quiz-container").addClass("results");
  new Share(".share-button", {
    // description: "I got " + result.player + "! Which Seahawk are YOU?",
    // image: result.image,
    ui: {
      flyout: "bottom left",
      button_text: "SHARE RESULTS"
    },
    // facebook: {
    //   caption: "I got " + result.player + "! Which Seahawk are YOU?"
    // }
  });
  $(".share-button").addClass("share-results");
};

showQuestion(id);
watchInput();
watchNext();