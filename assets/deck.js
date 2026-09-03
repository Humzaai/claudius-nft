/* CLAUDIUS deck animation
   The fanned card deck reacts to scroll: scrolling down slides the cards one
   way, scrolling up slides them the opposite way, then they spring back into
   the fan. Each card also tilts in 3D under the cursor and reveals its
   description card on hover. */
(function () {
  var deck = document.getElementById("deck-track");
  if (!deck) return;
  var cards = [].slice.call(deck.querySelectorAll(".deck-card"));

  // base fan layout per card index (-4 .. 4)
  function base(i) {
    return {
      tx: i * 150,
      ty: Math.abs(i) * 26,
      rot: i * 5.5,
      scale: 1 - Math.abs(i) * 0.075,
      z: 10 - Math.abs(i)
    };
  }

  // entrance deal: cards start stacked in the center, fan outward staggered
  var introStart = performance.now() + 350;   // small beat before the deal
  var INTRO_MS = 1000, STAGGER_MS = 130;
  function easeOutBack(t) {
    var c = 1.15;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  }
  function introProgress(i, now) {
    var t = (now - introStart - Math.abs(i) * STAGGER_MS) / INTRO_MS;
    return t <= 0 ? 0 : t >= 1 ? 1 : easeOutBack(t);
  }

  var shift = 0;      // current slide offset
  var impulse = 0;    // scroll energy, decays each frame
  var lastY = window.scrollY;

  window.addEventListener("scroll", function () {
    var dy = window.scrollY - lastY;
    lastY = window.scrollY;
    impulse = Math.max(-380, Math.min(380, impulse + dy * 1.8));
  }, { passive: true });

  // wheel also fires when the page can't scroll further (top/bottom)
  window.addEventListener("wheel", function (e) {
    impulse = Math.max(-380, Math.min(380, impulse + e.deltaY * 0.5));
  }, { passive: true });

  // 3D tilt + flip-to-open per card
  cards.forEach(function (card) {
    card._rx = 0; card._ry = 0;
    card._trxTarget = 0; card._tryTarget = 0;
    card._flip = 0; card._flipTarget = 0;   // 0 = ornate back, 180 = revealed
    card.addEventListener("click", function () {
      card._flipTarget = card._flipTarget === 0 ? 180 : 0;
      if (card._flipTarget === 180) {
        card.classList.remove("opened");        // restart flash animation
        void card.offsetWidth;
        card.classList.add("opened");
      } else {
        card.classList.remove("opened");
      }
    });
    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card._tryTarget = px * 22;
      card._trxTarget = -py * 16;
      card._hover = true;
    });
    card.addEventListener("mouseleave", function () {
      card._trxTarget = 0; card._tryTarget = 0; card._hover = false;
    });
  });

  var centerRevealed = false;

  function frame() {
    var now = performance.now();
    impulse *= 0.962;                   // energy decays → cards settle back
    shift += (impulse - shift) * 0.085;  // smooth chase

    cards.forEach(function (card) {
      var i = parseFloat(card.getAttribute("data-i"));
      var b = base(i);
      var p = introProgress(i, now);    // 0 = stacked center, 1 = fanned out
      var travel = (0.45 + Math.abs(i) * 0.28) * p;   // outer cards travel more
      var tx = b.tx * p + shift * travel;
      var rot = b.rot * p + shift * 0.012 * (i === 0 ? 1 : i);
      var scale = (b.scale * p + (1 - p) * 0.72) + (card._hover ? 0.05 : 0);
      b.ty = b.ty * p;

      // once the outermost cards land, flip the whole deck open in a wave
      // (center first, spreading outward) so every unique relic is revealed
      if (!centerRevealed && i === 0 && introProgress(4, now) >= 1) {
        centerRevealed = true;
        cards.forEach(function (c) {
          var ci = Math.abs(parseFloat(c.getAttribute("data-i")));
          setTimeout(function () {
            if (c._flipTarget === 0) c.click();
          }, 400 + ci * 140);
        });
      }
      card._rx += (card._trxTarget - card._rx) * 0.1;
      card._ry += (card._tryTarget - card._ry) * 0.1;
      card._flip += (card._flipTarget - card._flip) * 0.1;   // eased flip
      card.style.transform =
        "translate(" + (tx - 135) + "px," + b.ty + "px)" +
        " rotate(" + rot + "deg)" +
        " rotateX(" + card._rx + "deg) rotateY(" + (card._ry + card._flip) + "deg)" +
        " scale(" + scale + ")";
      card.style.zIndex = card._hover ? 20 : b.z;
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
