/* ---------------------------------------------------------------
   classify.js — sort items into categories, with graded feedback.

   The workhorse widget for "which bucket does this belong in?"
   drills: test levels, test types, functional vs non-functional,
   defect vs failure, product vs project risk.

   Markup contract (styling reuses the .rg-* primitives in lesson.css):

   <div class="classify" data-classify>
     <script type="application/json">
     {
       "prompt": "Optional line shown above the items",
       "categories": [
         { "id": "comp", "label": "Component" },
         { "id": "sys",  "label": "System" }
       ],
       "items": [
         { "id": "1",
           "text": "The thing being classified",
           "note": "Optional extra context",
           "answer": "sys",
           "why": "Why that is the right bucket — and why the tempting
                   wrong one is tempting." }
       ]
     }
     </script>
   </div>

   Classic script, no modules — these files are opened over file://.
   --------------------------------------------------------------- */
(function () {
  "use strict";

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function initClassify(root) {
    var cfgNode = root.querySelector('script[type="application/json"]');
    if (!cfgNode) return;
    var cfg;
    try {
      cfg = JSON.parse(cfgNode.textContent);
    } catch (e) {
      root.appendChild(
        el("p", "rg-hint", "Classify config failed to parse: " + e.message)
      );
      return;
    }

    var cats = cfg.categories || [];
    var items = cfg.items || [];
    var state = {};
    var nodes = {};

    var labelOf = {};
    var focusOf = {};
    cats.forEach(function (c) {
      labelOf[c.id] = c.label;
      focusOf[c.id] = c.focus || "that test object and objective";
    });

    if (cfg.prompt) root.appendChild(el("p", "rg-note", cfg.prompt));

    items.forEach(function (item, idx) {
      state[item.id] = null;

      var box = el("div", "rg-item");
      var head = el("div", "rg-item-head");
      head.appendChild(el("span", "rg-badge", String(idx + 1)));
      var title = el("span", "rg-title", item.text);
      title.id = "classify-" + item.id + "-title";
      head.appendChild(title);
      box.appendChild(head);
      if (item.note) box.appendChild(el("p", "rg-note", item.note));

      var seg = el("div", "rg-seg");
      seg.setAttribute("role", "group");
      seg.setAttribute("aria-labelledby", title.id);
      cats.forEach(function (c) {
        var b = el("button", null, c.label);
        b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", function () {
          var sibs = seg.querySelectorAll("button");
          for (var i = 0; i < sibs.length; i++)
            sibs[i].setAttribute("aria-pressed", "false");
          b.setAttribute("aria-pressed", "true");
          state[item.id] = c.id;
          refresh();
        });
        seg.appendChild(b);
      });
      box.appendChild(seg);

      var verdict = el("div", "rg-verdict");
      verdict.setAttribute("role", "status");
      verdict.setAttribute("aria-live", "polite");
      verdict.hidden = true;
      box.appendChild(verdict);

      nodes[item.id] = { verdict: verdict };
      root.appendChild(box);
    });

    var actions = el("div", "rg-actions");
    var check = el("button", "btn", "Check my answers");
    check.type = "button";
    check.disabled = true;
    var reset = el("button", "btn btn-quiet", "Clear");
    reset.type = "button";
    var hint = el("span", "rg-hint", "");
    actions.appendChild(check);
    actions.appendChild(reset);
    actions.appendChild(hint);
    root.appendChild(actions);

    var summary = el("p", "rg-hint");
    summary.setAttribute("role", "status");
    summary.setAttribute("aria-live", "polite");
    summary.hidden = true;
    root.appendChild(summary);

    function refresh() {
      var done = items.filter(function (i) {
        return state[i.id];
      }).length;
      check.disabled = done < items.length;
      hint.textContent =
        done < items.length
          ? done + " of " + items.length + " sorted"
          : "All sorted — check your answers.";
    }

    check.addEventListener("click", function () {
      var right = 0;
      items.forEach(function (item) {
        var ok = state[item.id] === item.answer;
        if (ok) right += 1;
        var node = nodes[item.id].verdict;
        node.className = "rg-verdict " + (ok ? "v-hit" : "v-miss");
        node.innerHTML =
          '<span class="rg-verdict-label">' +
          (ok ? "Correct — " : "Not this one — ") +
          labelOf[item.answer] +
          "</span>" +
          (ok
            ? ""
            : "You said <em>" + labelOf[state[item.id]] +
              "</em>, which would fit when the primary focus is " +
              focusOf[state[item.id]] + ". ") +
          item.why;
        node.hidden = false;
      });
      summary.textContent =
        right + " of " + items.length + " correct.";
      summary.hidden = false;
    });

    reset.addEventListener("click", function () {
      items.forEach(function (item) {
        state[item.id] = null;
        nodes[item.id].verdict.hidden = true;
      });
      var pressed = root.querySelectorAll('.rg-seg button[aria-pressed="true"]');
      for (var i = 0; i < pressed.length; i++)
        pressed[i].setAttribute("aria-pressed", "false");
      summary.hidden = true;
      refresh();
    });

    refresh();
  }

  function boot() {
    var all = document.querySelectorAll("[data-classify]");
    for (var i = 0; i < all.length; i++) initClassify(all[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
