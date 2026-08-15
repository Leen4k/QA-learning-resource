/* ---------------------------------------------------------------
   defect-triage.js — grade severity and priority as separate dials.

   Markup contract (styling reuses the .rg-* primitives in lesson.css):

   <div class="defect-triage" data-defect-triage>
     <script type="application/json">
     {
       "severityLevels": [
         { "id": "low", "label": "Low" },
         { "id": "medium", "label": "Medium" },
         { "id": "high", "label": "High" }
       ],
       "priorityLevels": [
         { "id": "p3", "label": "P3" },
         { "id": "p2", "label": "P2" },
         { "id": "p1", "label": "P1" }
       ],
       "items": [
         { "id": "A", "title": "Observed failure", "note": "Context",
           "severity": "high", "priority": "p1",
           "whySeverity": "Impact reasoning.",
           "whyPriority": "Scheduling reasoning." }
       ]
     }
     </script>
   </div>

   Levels must be ordered from least to most urgent. Exact matches use
   the reference call; answers one level away are marked defensible,
   because triage labels are project judgement rather than facts.
   Classic script, no modules — lessons open over file://.
   --------------------------------------------------------------- */
(function () {
  "use strict";

  function el(tag, cls, html) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function labelsById(levels) {
    var labels = {};
    levels.forEach(function (level) {
      labels[level.id] = level.label;
    });
    return labels;
  }

  function distance(levels, chosen, reference) {
    var chosenIndex = levels.findIndex(function (level) {
      return level.id === chosen;
    });
    var referenceIndex = levels.findIndex(function (level) {
      return level.id === reference;
    });
    return Math.abs(chosenIndex - referenceIndex);
  }

  function grade(levelDistance) {
    if (levelDistance === 0) {
      return { cls: "v-hit", label: "Same call as the reference." };
    }
    if (levelDistance === 1) {
      return { cls: "v-near", label: "Defensible — one level away." };
    }
    return { cls: "v-miss", label: "Worth a rethink — two levels away." };
  }

  function segmented(label, levels, onPick) {
    var group = el("div", "rg-seg");
    group.setAttribute("role", "group");
    group.setAttribute("aria-label", label);

    levels.forEach(function (level) {
      var button = el("button", null, level.label);
      button.type = "button";
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", function () {
        var siblings = group.querySelectorAll("button");
        for (var i = 0; i < siblings.length; i++) {
          siblings[i].setAttribute("aria-pressed", "false");
        }
        button.setAttribute("aria-pressed", "true");
        onPick(level.id);
      });
      group.appendChild(button);
    });

    return group;
  }

  function initTriage(root) {
    var configNode = root.querySelector('script[type="application/json"]');
    if (!configNode) return;

    var config;
    try {
      config = JSON.parse(configNode.textContent);
    } catch (error) {
      root.appendChild(
        el("p", "rg-hint", "Defect-triage config failed to parse: " + error.message)
      );
      return;
    }

    var severityLevels = config.severityLevels || [];
    var priorityLevels = config.priorityLevels || [];
    var items = config.items || [];
    var severityLabel = labelsById(severityLevels);
    var priorityLabel = labelsById(priorityLevels);
    var state = {};
    var nodes = {};

    items.forEach(function (item) {
      state[item.id] = { severity: null, priority: null };

      var box = el("div", "rg-item");
      var head = el("div", "rg-item-head");
      head.appendChild(el("span", "rg-badge", item.id));
      head.appendChild(el("span", "rg-title", item.title));
      box.appendChild(head);
      if (item.note) box.appendChild(el("p", "rg-note", item.note));

      var dials = el("div", "rg-dials");
      var severityWrap = el("div");
      severityWrap.appendChild(
        el("span", "rg-dial-label", "Severity &mdash; how bad is the impact?")
      );
      severityWrap.appendChild(
        segmented("Severity for " + item.id, severityLevels, function (level) {
          state[item.id].severity = level;
          refresh();
        })
      );

      var priorityWrap = el("div");
      priorityWrap.appendChild(
        el("span", "rg-dial-label", "Priority &mdash; when should it compete?")
      );
      priorityWrap.appendChild(
        segmented("Priority for " + item.id, priorityLevels, function (level) {
          state[item.id].priority = level;
          refresh();
        })
      );

      dials.appendChild(severityWrap);
      dials.appendChild(priorityWrap);
      box.appendChild(dials);

      var verdict = el("div", "rg-verdict");
      verdict.hidden = true;
      box.appendChild(verdict);
      nodes[item.id] = { verdict: verdict };
      root.appendChild(box);
    });

    var actions = el("div", "rg-actions");
    var check = el("button", "btn", "Check my triage");
    check.type = "button";
    check.disabled = true;
    var reset = el("button", "btn btn-quiet", "Clear");
    reset.type = "button";
    var hint = el("span", "rg-hint", "");
    actions.appendChild(check);
    actions.appendChild(reset);
    actions.appendChild(hint);
    root.appendChild(actions);

    function refresh() {
      var completed = items.filter(function (item) {
        return state[item.id].severity && state[item.id].priority;
      }).length;
      check.disabled = completed < items.length;
      hint.textContent =
        completed < items.length
          ? completed + " of " + items.length + " defects triaged"
          : "All triaged — compare your reasoning.";
    }

    check.addEventListener("click", function () {
      items.forEach(function (item) {
        var answer = state[item.id];
        var severityGrade = grade(
          distance(severityLevels, answer.severity, item.severity)
        );
        var priorityGrade = grade(
          distance(priorityLevels, answer.priority, item.priority)
        );
        var overall =
          severityGrade.cls === "v-miss" || priorityGrade.cls === "v-miss"
            ? "v-miss"
            : severityGrade.cls === "v-near" || priorityGrade.cls === "v-near"
              ? "v-near"
              : "v-hit";
        var verdict = nodes[item.id].verdict;
        verdict.className = "rg-verdict " + overall;
        verdict.innerHTML =
          '<span class="rg-verdict-label">Severity: ' +
          severityGrade.label +
          " You chose " +
          severityLabel[answer.severity] +
          "; reference " +
          severityLabel[item.severity] +
          ".</span>" +
          item.whySeverity +
          '<span class="rg-verdict-label">Priority: ' +
          priorityGrade.label +
          " You chose " +
          priorityLabel[answer.priority] +
          "; reference " +
          priorityLabel[item.priority] +
          ".</span>" +
          item.whyPriority;
        verdict.hidden = false;
      });
    });

    reset.addEventListener("click", function () {
      items.forEach(function (item) {
        state[item.id] = { severity: null, priority: null };
        nodes[item.id].verdict.hidden = true;
      });
      var pressed = root.querySelectorAll('.rg-seg button[aria-pressed="true"]');
      for (var i = 0; i < pressed.length; i++) {
        pressed[i].setAttribute("aria-pressed", "false");
      }
      refresh();
    });

    refresh();
  }

  function boot() {
    var roots = document.querySelectorAll("[data-defect-triage]");
    for (var i = 0; i < roots.length; i++) initTriage(roots[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
