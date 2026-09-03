/* CLAUDIUS shared interactivity
   Toast feedback, newsletter signup, collection filters, collect buttons,
   and placeholder actions so every control on the site responds. */
(function () {
  // ---- toast ----
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 3200);
  }

  // ---- generic: any element with data-toast responds with feedback ----
  document.querySelectorAll("[data-toast]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      if (el.tagName === "A" || el.tagName === "BUTTON") e.preventDefault();
      toast(el.getAttribute("data-toast"));
    });
  });

  // ---- newsletter ----
  document.querySelectorAll(".nl-row").forEach(function (row) {
    var input = row.querySelector("input");
    var btn = row.querySelector(".btn");
    function submit(e) {
      e.preventDefault();
      var v = (input.value || "").trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
        toast("Enter a valid email to receive the scrolls.");
        input.focus();
        return;
      }
      try { localStorage.setItem("claudius-newsletter", v); } catch (err) {}
      input.value = "";
      toast("You're on the list. The next scroll finds you first.");
    }
    btn.addEventListener("click", submit);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(e); });
  });

  // ---- collect buttons on NFT cards ----
  document.querySelectorAll(".nft-card").forEach(function (card) {
    var collect = card.querySelector(".collect");
    if (!collect) return;
    collect.addEventListener("click", function (e) {
      e.stopPropagation();
      var name = card.querySelector("h3").textContent.split(":")[0].trim();
      toast(name + " reserved (demo). Wallet minting opens with the next drop.");
    });
  });

  // ---- team parallax (homepage) ----
  // cards drift in alternating directions as the section scrolls through
  // the viewport: outer cards rise while the middle one sinks, smoothly eased
  var teamGrid = document.querySelector(".team-grid");
  if (teamGrid) {
    var teamCards = [].slice.call(teamGrid.querySelectorAll(".team-card"));
    var dirs = [-1, 1, -1];        // up, down, up
    var tCur = 0, tTarget = 0;

    function teamScroll() {
      var r = teamGrid.getBoundingClientRect();
      // -1 .. 1 as the section travels from below the viewport center to above it
      var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      tTarget = Math.max(-1, Math.min(1, p));
    }
    window.addEventListener("scroll", teamScroll, { passive: true });
    teamScroll();

    (function teamFrame() {
      tCur += (tTarget - tCur) * 0.07;   // lazy chase, same feel as the deck
      teamCards.forEach(function (card, idx) {
        var y = dirs[idx] * tCur * -70 + (idx === 1 ? 40 : 0);
        card.style.transform = "translateY(" + y + "px)";
      });
      requestAnimationFrame(teamFrame);
    })();
  }

  // ---- collection filters ----
  var pills = [].slice.call(document.querySelectorAll(".filter-bar .btn[data-filter]"));
  if (pills.length) {
    var cards = [].slice.call(document.querySelectorAll(".nft-card"));
    pills.forEach(function (pill) {
      pill.addEventListener("click", function () {
        pills.forEach(function (x) { x.classList.remove("on"); });
        pill.classList.add("on");
        var cat = pill.getAttribute("data-filter");
        var shown = 0;
        cards.forEach(function (card) {
          var hit = cat === "all" || card.getAttribute("data-cat") === cat;
          card.style.display = hit ? "" : "none";
          if (hit) shown++;
        });
        toast(shown + (shown === 1 ? " relic" : " relics") + " in this tier.");
      });
    });
  }
})();
