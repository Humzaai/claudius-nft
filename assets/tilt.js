/* CLAUDIUS 3D tilt for collection cards
   Cards tilt in perspective toward the cursor, with a glare sheen that
   follows it. Eased with rAF so the motion feels weighted, not twitchy. */
(function () {
  var cards = [].slice.call(document.querySelectorAll(".nft-card"));
  if (!cards.length) return;

  cards.forEach(function (card) {
    var rx = 0, ry = 0, trx = 0, try_ = 0, lift = 0, tlift = 0, raf = null;

    function frame() {
      rx += (trx - rx) * 0.12;
      ry += (try_ - ry) * 0.12;
      lift += (tlift - lift) * 0.12;
      card.style.transform =
        "perspective(950px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)" +
        " translateY(" + (-lift) + "px)";
      if (Math.abs(trx - rx) + Math.abs(try_ - ry) + Math.abs(tlift - lift) > 0.02) {
        raf = requestAnimationFrame(frame);
      } else { raf = null; }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      trx = -py * 10; try_ = px * 12; tlift = 7;
      card.style.setProperty("--mx", ((px + 0.5) * 100) + "%");
      card.style.setProperty("--my", ((py + 0.5) * 100) + "%");
      kick();
    });
    card.addEventListener("mouseleave", function () {
      trx = 0; try_ = 0; tlift = 0; kick();
    });
  });
})();
