/* ---------------------------------------------------------------
   coverage-set.js — choose a set that covers every named target.

   Unlike select-set.js, this widget accepts multiple equally valid
   minimal answers. It is for paths, sequences, tests, or scenarios
   where one candidate may cover several targets.

   Markup contract (styling reuses .rg-* in lesson.css):

   <div class="coverage-set" data-coverage-set>
     <script type="application/json">
     {
       "prompt": "Choose as few sequences as possible.",
       "itemNoun": "sequence",
       "coverageNoun": "transition",
       "coverageItems": [
         { "id": "ab", "label": "A → B" }
       ],
       "items": [
         { "id": "one", "label": "A → B → C",
           "covers": ["ab", "bc"],
           "why": "Why this path is useful." }
       ]
     }
     </script>
   </div>

   Candidate pools are intentionally small lesson exercises. For pools
   of twenty items or fewer, the widget calculates the true minimum set
   size so alternate minimal answers receive the same feedback.
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

  function plural(count, noun) {
    return count + " " + noun + (count === 1 ? "" : "s");
  }

  function initCoverageSet(root) {
    var cfgNode = root.querySelector('script[type="application/json"]');
    if (!cfgNode) return;

    var cfg;
    try {
      cfg = JSON.parse(cfgNode.textContent);
    } catch (error) {
      root.appendChild(
        el("p", "rg-hint", "Coverage-set config failed to parse: " + error.message)
      );
      return;
    }

    var items = cfg.items || [];
    var targets = cfg.coverageItems || [];
    var itemNoun = cfg.itemNoun || "item";
    var coverageNoun = cfg.coverageNoun || "target";
    var targetLabel = {};
    var picked = {};
    var nodes = {};

    targets.forEach(function (target) {
      targetLabel[target.id] = target.label;
    });

    function coveredBy(candidateItems) {
      var covered = {};
      candidateItems.forEach(function (item) {
        (item.covers || []).forEach(function (targetId) {
          covered[targetId] = true;
        });
      });
      return covered;
    }

    function missingFrom(candidateItems) {
      var covered = coveredBy(candidateItems);
      return targets.filter(function (target) {
        return !covered[target.id];
      });
    }

    function minimumSize() {
      if (items.length > 20) return null;
      var limit = Math.pow(2, items.length);
      var best = items.length + 1;

      for (var mask = 1; mask < limit; mask++) {
        var chosen = [];
        for (var i = 0; i < items.length; i++) {
          if (mask & (1 << i)) chosen.push(items[i]);
        }
        if (chosen.length >= best) continue;
        if (missingFrom(chosen).length === 0) best = chosen.length;
      }

      return best <= items.length ? best : null;
    }

    var bestSize = minimumSize();

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

      var coverageLabels = (item.covers || []).map(function (targetId) {
        return targetLabel[targetId] || targetId;
      });
      box.appendChild(
        el(
          "p",
          "rg-note",
          "Covers: " + (coverageLabels.length ? coverageLabels.join("; ") : "nothing")
        )
      );

      var verdict = el("div", "rg-verdict");
      verdict.hidden = true;
      box.appendChild(verdict);

      toggle.addEventListener("click", function () {
        picked[item.id] = !picked[item.id];
        toggle.setAttribute("aria-pressed", picked[item.id] ? "true" : "false");
        toggle.textContent = picked[item.id] ? "✓ included" : "＋ include";
        box.className = picked[item.id] ? "rg-item is-picked" : "rg-item";
        verdict.hidden = true;
        summary.hidden = true;
        refresh();
      });

      nodes[item.id] = { box: box, toggle: toggle, verdict: verdict };
      root.appendChild(box);
    });

    var actions = el("div", "rg-actions");
    var check = el("button", "btn", "Check my coverage");
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

    function selectedItems() {
      return items.filter(function (item) {
        return picked[item.id];
      });
    }

    function refresh() {
      var selected = selectedItems();
      var covered = coveredBy(selected);
      var coveredCount = targets.filter(function (target) {
        return covered[target.id];
      }).length;
      check.disabled = selected.length === 0;
      hint.textContent =
        plural(selected.length, itemNoun) +
        " selected · " +
        coveredCount +
        " of " +
        targets.length +
        " " +
        coverageNoun +
        (targets.length === 1 ? "" : "s") +
        " covered";
    }

    check.addEventListener("click", function () {
      var selected = selectedItems();
      var missing = missingFrom(selected);
      var complete = missing.length === 0;

      items.forEach(function (item) {
        var node = nodes[item.id].verdict;
        if (!picked[item.id]) {
          node.hidden = true;
          return;
        }

        var withoutThis = selected.filter(function (candidate) {
          return candidate.id !== item.id;
        });
        var redundant = complete && missingFrom(withoutThis).length === 0;
        node.className = "rg-verdict " + (redundant ? "v-near" : "v-hit");
        node.innerHTML =
          '<span class="rg-verdict-label">' +
          (redundant
            ? "Redundant in this set — removing it loses no coverage."
            : "Useful in this set — removing it creates a gap.") +
          "</span>" +
          (item.why || "");
        node.hidden = false;
      });

      if (!complete) {
        summary.className = "rg-verdict v-miss";
        summary.innerHTML =
          '<span class="rg-verdict-label">Coverage gap.</span>Still missing: ' +
          missing
            .map(function (target) {
              return target.label;
            })
            .join("; ") +
          ".";
      } else if (bestSize != null && selected.length === bestSize) {
        summary.className = "rg-verdict v-hit";
        summary.innerHTML =
          '<span class="rg-verdict-label">Complete and minimal.</span>' +
          plural(selected.length, itemNoun) +
          " cover every " +
          coverageNoun +
          ". Another set may be equally small; coverage, not matching an answer key, is what makes it valid.";
      } else {
        summary.className = "rg-verdict v-near";
        summary.innerHTML =
          '<span class="rg-verdict-label">Complete, with extra work.</span>' +
          plural(selected.length, itemNoun) +
          " cover everything" +
          (bestSize == null
            ? "."
            : ", but the smallest covering set uses " + plural(bestSize, itemNoun) + ".");
      }
      summary.hidden = false;
    });

    reset.addEventListener("click", function () {
      items.forEach(function (item) {
        picked[item.id] = false;
        nodes[item.id].box.className = "rg-item";
        nodes[item.id].toggle.setAttribute("aria-pressed", "false");
        nodes[item.id].toggle.textContent = "＋ include";
        nodes[item.id].verdict.hidden = true;
      });
      summary.hidden = true;
      refresh();
    });

    refresh();
  }

  function boot() {
    var roots = document.querySelectorAll("[data-coverage-set]");
    for (var i = 0; i < roots.length; i++) initCoverageSet(roots[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
