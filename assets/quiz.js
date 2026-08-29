/* ---------------------------------------------------------------
   quiz.js — reusable retrieval-practice widget.

   Markup contract (styling lives in lesson.css):

   <div class="quiz" data-quiz>
     <p class="quiz-q"><span class="quiz-num">Recall 1</span>Question?</p>
     <ol class="quiz-options">
       <li><button data-correct
                   data-feedback="Why this is right.">Option text</button></li>
       <li><button data-feedback="Why this is wrong.">Option text</button></li>
     </ol>
   </div>

   - Exactly one button per quiz carries `data-correct`.
   - Answering locks the quiz and reveals corrective feedback: the
     learner sees why their pick failed AND where the right answer was.
     Corrective feedback beats a bare score for storage strength.
   - Any element with [data-quiz-score] gets a live "n of m" tally.

   Classic script, no modules — these files are opened over file://.
   --------------------------------------------------------------- */
(function () {
  "use strict";

  var answered = 0;
  var correct = 0;
  var total = 0;

  function updateScore() {
    var targets = document.querySelectorAll("[data-quiz-score]");
    for (var i = 0; i < targets.length; i++) {
      targets[i].textContent =
        answered === 0
          ? total + " questions, none answered yet"
          : correct + " of " + answered + " right (" + total + " in total)";
    }
  }

  /* rightLabel is captured before the tick mark is injected into the
     button, otherwise the mark ends up quoted back in the feedback. */
  function feedbackFor(chosen, rightBtn, rightLabel, wasRight) {
    var lines = [];
    if (wasRight) {
      lines.push("<strong>Correct.</strong> " + (chosen.dataset.feedback || ""));
    } else {
      lines.push(
        "<strong>Not quite.</strong> " + (chosen.dataset.feedback || "")
      );
      if (rightBtn && rightBtn.dataset.feedback) {
        lines.push(
          "<strong>The answer was &ldquo;" +
            rightLabel +
            "&rdquo;.</strong> " +
            rightBtn.dataset.feedback
        );
      }
    }
    return lines.join("<br><br>");
  }

  function initQuiz(quiz) {
    var buttons = quiz.querySelectorAll(".quiz-options button");
    if (!buttons.length) return;
    total += 1;

    var rightBtn = quiz.querySelector(".quiz-options button[data-correct]");
    var rightLabel = rightBtn ? rightBtn.textContent.trim() : "";
    var panel = document.createElement("div");
    panel.className = "quiz-feedback";
    panel.setAttribute("role", "status");
    panel.setAttribute("aria-live", "polite");
    panel.hidden = true;
    quiz.appendChild(panel);

    function choose(btn) {
      var wasRight = btn.hasAttribute("data-correct");
      answered += 1;
      if (wasRight) correct += 1;

      for (var i = 0; i < buttons.length; i++) {
        var b = buttons[i];
        b.disabled = true;
        if (b === btn) {
          b.className = wasRight ? "is-correct" : "is-wrong";
          b.insertAdjacentHTML(
            "afterbegin",
            '<span class="quiz-mark" aria-hidden="true">' +
              (wasRight ? "✓" : "✗") +
              "</span>"
          );
        } else if (b === rightBtn) {
          b.className = "is-correct";
          b.insertAdjacentHTML(
            "afterbegin",
            '<span class="quiz-mark" aria-hidden="true">✓</span>'
          );
        } else {
          b.className = "is-muted";
        }
      }

      panel.innerHTML = feedbackFor(btn, rightBtn, rightLabel, wasRight);
      panel.hidden = false;
      updateScore();
    }

    for (var j = 0; j < buttons.length; j++) {
      (function (b) {
        b.addEventListener("click", function () {
          choose(b);
        });
      })(buttons[j]);
    }
  }

  function boot() {
    var quizzes = document.querySelectorAll("[data-quiz]");
    for (var i = 0; i < quizzes.length; i++) initQuiz(quizzes[i]);
    updateScore();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
