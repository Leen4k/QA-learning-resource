/* ---------------------------------------------------------------
   select-set.js — pick the minimal set that still does the job.

   For drills where the answer is a *set*, not a label: which test
   values to run, which risks to cover, which tests to automate.
   Trains the two failure modes at once — leaving out something that
   mattered, and piling in redundant work that finds nothing new.

   Markup contract (styling reuses the .rg-* primitives in lesson.css):

   <div class="select-set" data-select-set>
     <script type="application/json">
     {
       "prompt": "Optional line shown above the pool",
       "itemNoun": "value",
       "items": [
         { "id": "1", "label": "-0.01", "note": "optional",
           "include": true,
           "why": "Why it earns its place, or why it adds nothing." }
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

  function initSet(root) {
    var cfgNode = root.querySelector('script[type="application/json"]');
    if (!cfgNode) return;
    var cfg;
    try {
      cfg = JSON.parse(cfgNode.textContent);
    } catch (e) {
      root.appendChild(
        el("p", "rg-hint", "Select-set config failed to parse: " + e.message)
      );
      return;
    }

    var items = cfg.items || [];
    var noun = cfg.itemNoun || "item";
    var picked = {};
    var nodes = {};

    if (cfg.prompt) root.appendChild(el("p", "rg-note", cfg.prompt));

    items.forEach(function (item) {
      picked[item.id] = false;

      var box = el("div", "rg-item");
      var head = el("div", "rg-item-head");

      var toggle = el("button", "ss-toggle", "＋ include");
      toggle.type = "button";
      toggle.setAttribute("aria-pressed", "false");
      head.appendChild(toggle);
      head.appendChild(el("span", "rg-title", item.label));
      box.appendChild(head);
      if (item.note) box.appendChild(el("p", "rg-note", item.note));

      var verdict = el("div", "rg-verdict");
      verdict.hidden = true;
      box.appendChild(verdict);

      toggle.addEventListener("click", function () {
        picked[item.id] = !picked[item.id];
        toggle.setAttribute("aria-pressed", picked[item.id] ? "true" : "false");
        toggle.textContent = picked[item.id] ? "✓ included" : "＋ include";
        box.className = picked[item.id] ? "rg-item is-picked" : "rg-item";
        refresh();
      });

      nodes[item.id] = { verdict: verdict, box: box };
      root.appendChild(box);
    });

    var actions = el("div", "rg-actions");
    var check = el("button", "btn", "Check my set");
    check.type = "button";
    var reset = el("button", "btn btn-quiet", "Clear");
    reset.type = "button";
    var hint = el("span", "rg-hint", "");
    actions.appendChild(check);
    actions.appendChild(reset);
    actions.appendChild(hint);
    root.appendChild(actions);

    var summary = el("div", "rg-verdict");
    summary.hidden = true;
    root.appendChild(summary);

    function refresh() {
      var n = items.filter(function (i) {
        return picked[i.id];
      }).length;
      hint.textContent = n + " " + noun + (n === 1 ? "" : "s") + " selected";
    }

    check.addEventListener("click", function () {
      var missed = 0;
      var redundant = 0;
      var needed = 0;

      items.forEach(function (item) {
        if (item.include) needed += 1;
        var got = picked[item.id];
        var cls, label;

        if (item.include && got) {
          cls = "v-hit";
          label = "Kept — this one earns its place.";
        } else if (item.include && !got) {
          cls = "v-miss";
          label = "Missed — leaving this out loses coverage.";
          missed += 1;
        } else if (!item.include && got) {
          cls = "v-near";
          label = "Redundant — no new coverage.";
          redundant += 1;
        } else {
          cls = "v-hit";
          label = "Left out — right call.";
        }

        var node = nodes[item.id].verdict;
        node.className = "rg-verdict " + cls;
        node.innerHTML =
          '<span class="rg-verdict-label">' + label + "</span>" + item.why;
        node.hidden = false;
      });

      var clean = missed === 0 && redundant === 0;
      summary.className =
        "rg-verdict " + (clean ? "v-hit" : missed ? "v-miss" : "v-near");
      summary.innerHTML =
        '<span class="rg-verdict-label">' +
        (clean
          ? "Exactly the minimal set."
          : missed + " missed, " + redundant + " redundant.") +
        "</span>A covering set here is " +
        needed +
        " " +
        noun +
        (needed === 1 ? "" : "s") +
        ". Missing one leaves a gap. Adding extras is not <em>wrong</em> — it is just work that finds nothing new, and on a real project that time comes out of something else.";
      summary.hidden = false;
    });

    reset.addEventListener("click", function () {
      items.forEach(function (item) {
        picked[item.id] = false;
        nodes[item.id].verdict.hidden = true;
        nodes[item.id].box.className = "rg-item";
      });
      var tgs = root.querySelectorAll(".ss-toggle");
      for (var i = 0; i < tgs.length; i++) {
        tgs[i].setAttribute("aria-pressed", "false");
        tgs[i].textContent = "＋ include";
      }
      summary.hidden = true;
      refresh();
    });

    refresh();
  }

  function boot() {
    var all = document.querySelectorAll("[data-select-set]");
    for (var i = 0; i < all.length; i++) initSet(all[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
