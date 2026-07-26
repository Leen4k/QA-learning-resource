/* ---------------------------------------------------------------
   risk-grid.js — interactive likelihood x impact triage widget.

   Markup contract:

   <div class="risk-grid" data-risk-grid>
     <script type="application/json">
     {
       "items": [
         { "id": "A",
           "title": "Short risk statement",
           "note": "Optional context shown under the title",
           "likelihood": "M",
           "impact": "H",
           "why": "The reasoning a hiring manager would accept." }
       ]
     }
     </script>
   </div>

   The learner sets two dials per item, then checks. Feedback is
   graded, not binary — risk scoring is a judgement call, so an
   answer one step away is marked *defensible* rather than wrong.
   What is being trained is the habit of scoring the two factors
   SEPARATELY and having a reason for each.

   Classic script, no modules — these files are opened over file://.
   --------------------------------------------------------------- */
(function () {
  "use strict";

  var LEVELS = ["L", "M", "H"];
  var VALUE = { L: 1, M: 2, H: 3 };
  var WORD = { L: "Low", M: "Medium", H: "High" };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function segmented(name, onPick) {
    var wrap = el("div", "rg-seg");
    wrap.setAttribute("role", "group");
    wrap.setAttribute("aria-label", name);
    LEVELS.forEach(function (lv) {
      var b = el("button", null, WORD[lv]);
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.dataset.level = lv;
      b.addEventListener("click", function () {
        var sibs = wrap.querySelectorAll("button");
        for (var i = 0; i < sibs.length; i++)
          sibs[i].setAttribute("aria-pressed", "false");
        b.setAttribute("aria-pressed", "true");
        onPick(lv);
      });
      wrap.appendChild(b);
    });
    return wrap;
  }

  function buildMatrix() {
    var table = el("table", "rg-matrix");

    var cap = el(
      "caption",
      "rg-hint",
      "Vertical axis: impact. Horizontal axis: likelihood."
    );
    cap.style.captionSide = "bottom";
    cap.style.textAlign = "left";
    cap.style.paddingTop = "0.4rem";
    table.appendChild(cap);

    var head = el("tr");
    head.appendChild(el("th"));
    var likHead = el("th", null, "Likelihood &rarr;");
    likHead.colSpan = 3;
    head.appendChild(likHead);
    table.appendChild(head);

    var labels = el("tr");
    labels.appendChild(el("th"));
    LEVELS.forEach(function (lv) {
      labels.appendChild(el("th", null, WORD[lv]));
    });
    table.appendChild(labels);

    ["H", "M", "L"].forEach(function (imp) {
      var row = el("tr");
      var yl = el("th", null, '<span class="rg-axis-y">' + WORD[imp] + "</span>");
      row.appendChild(yl);
      LEVELS.forEach(function (lik) {
        var score = VALUE[lik] * VALUE[imp];
        var cell = el("td", "rg-cell-" + score);
        cell.dataset.cell = lik + imp;
        row.appendChild(cell);
      });
      table.appendChild(row);
    });

    return table;
  }

  function verdictFor(distance) {
    if (distance === 0)
      return { cls: "v-hit", label: "Same call as the reference answer." };
    if (distance === 1)
      return {
        cls: "v-near",
        label: "Defensible — one step from the reference answer."
      };
    return { cls: "v-miss", label: "Worth a rethink — two or more steps off." };
  }

  function initGrid(root) {
    var cfgNode = root.querySelector('script[type="application/json"]');
    if (!cfgNode) return;
    var cfg;
    try {
      cfg = JSON.parse(cfgNode.textContent);
    } catch (e) {
      root.appendChild(
        el("p", "rg-hint", "Risk grid config failed to parse: " + e.message)
      );
      return;
    }

    var items = cfg.items || [];
    var state = {};
    var itemNodes = {};

    var list = el("div", "rg-list");
    items.forEach(function (item) {
      state[item.id] = { likelihood: null, impact: null };

      var box = el("div", "rg-item");
      var head = el("div", "rg-item-head");
      head.appendChild(el("span", "rg-badge", item.id));
      head.appendChild(el("span", "rg-title", item.title));
      box.appendChild(head);
      if (item.note) box.appendChild(el("p", "rg-note", item.note));

      var dials = el("div", "rg-dials");

      var likWrap = el("div");
      likWrap.appendChild(
        el(
          "span",
          "rg-dial-label",
          "Likelihood &mdash; how probable is it?"
        )
      );
      likWrap.appendChild(
        segmented("Likelihood for " + item.id, function (lv) {
          state[item.id].likelihood = lv;
          refresh();
        })
      );

      var impWrap = el("div");
      impWrap.appendChild(
        el("span", "rg-dial-label", "Impact &mdash; how bad if it happens?")
      );
      impWrap.appendChild(
        segmented("Impact for " + item.id, function (lv) {
          state[item.id].impact = lv;
          refresh();
        })
      );

      dials.appendChild(likWrap);
      dials.appendChild(impWrap);
      box.appendChild(dials);

      var verdict = el("div", "rg-verdict");
      verdict.hidden = true;
      box.appendChild(verdict);

      itemNodes[item.id] = { box: box, verdict: verdict };
      list.appendChild(box);
    });
    root.appendChild(list);

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

    var matrix = buildMatrix();
    root.appendChild(matrix);

    var results = el("div", "rg-results");
    results.hidden = true;
    root.appendChild(results);

    function placeChips() {
      var cells = matrix.querySelectorAll("td");
      for (var i = 0; i < cells.length; i++) cells[i].innerHTML = "";
      items.forEach(function (item) {
        var s = state[item.id];
        if (!s.likelihood || !s.impact) return;
        var cell = matrix.querySelector(
          '[data-cell="' + s.likelihood + s.impact + '"]'
        );
        if (cell) cell.appendChild(el("span", "rg-chip", item.id));
      });
    }

    function refresh() {
      var done = items.filter(function (item) {
        var s = state[item.id];
        return s.likelihood && s.impact;
      }).length;
      check.disabled = done < items.length;
      hint.textContent =
        done < items.length
          ? done + " of " + items.length + " risks scored"
          : "All scored — check your triage.";
      placeChips();
    }

    check.addEventListener("click", function () {
      var scored = items.map(function (item) {
        var s = state[item.id];
        var d =
          Math.abs(VALUE[s.likelihood] - VALUE[item.likelihood]) +
          Math.abs(VALUE[s.impact] - VALUE[item.impact]);
        var v = verdictFor(d);
        var node = itemNodes[item.id].verdict;
        node.className = "rg-verdict " + v.cls;
        node.innerHTML =
          '<span class="rg-verdict-label">' +
          v.label +
          "</span>You said likelihood " +
          WORD[s.likelihood].toLowerCase() +
          ", impact " +
          WORD[s.impact].toLowerCase() +
          ". Reference: likelihood " +
          WORD[item.likelihood].toLowerCase() +
          ", impact " +
          WORD[item.impact].toLowerCase() +
          ". " +
          item.why;
        node.hidden = false;
        return {
          item: item,
          yours: VALUE[s.likelihood] * VALUE[s.impact],
          ref: VALUE[item.likelihood] * VALUE[item.impact]
        };
      });

      var yourOrder = scored
        .slice()
        .sort(function (a, b) {
          return b.yours - a.yours;
        })
        .map(function (r) {
          return r.item.id + " (" + r.yours + ")";
        })
        .join(" &rarr; ");

      var refOrder = scored
        .slice()
        .sort(function (a, b) {
          return b.ref - a.ref;
        })
        .map(function (r) {
          return r.item.id + " (" + r.ref + ")";
        })
        .join(" &rarr; ");

      results.innerHTML =
        '<h3>Your test order</h3><ul class="rg-ranking"><li><strong>Yours:</strong> ' +
        yourOrder +
        "</li><li><strong>Reference:</strong> " +
        refOrder +
        "</li></ul><p class=\"rg-hint\">Risk level here is likelihood &times; impact on a 1&ndash;3 scale, so scores run 1 to 9. The number is a sorting aid, not a truth. If your order differs but each score has a reason behind it, you have done the exercise correctly &mdash; bring the disagreement to your teacher.</p>";
      results.hidden = false;
      results.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    reset.addEventListener("click", function () {
      items.forEach(function (item) {
        state[item.id] = { likelihood: null, impact: null };
        itemNodes[item.id].verdict.hidden = true;
      });
      var pressed = root.querySelectorAll('.rg-seg button[aria-pressed="true"]');
      for (var i = 0; i < pressed.length; i++)
        pressed[i].setAttribute("aria-pressed", "false");
      results.hidden = true;
      refresh();
    });

    refresh();
  }

  function boot() {
    var grids = document.querySelectorAll("[data-risk-grid]");
    for (var i = 0; i < grids.length; i++) initGrid(grids[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
