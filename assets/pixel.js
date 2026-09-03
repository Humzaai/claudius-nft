/* CLAUDIUS pixel Claude renderer
   Draws the pixel-art Claude mascot (doge-meme style, but Claude) onto a
   canvas inside every element with class "pixel-claude".
   Variants recolor the body / add a gold laurel band:
     data-variant="orange" (default) | "gold" | "teal" | "marble" | "shadow"
*/
(function () {
  // . transparent | K outline/black | O body | D body shade | H highlight
  // B laurel band (only painted for variants that define B)
  var MAP = [
    "....................",
    "....................",
    "....KKKKKKKKKKKK....",
    "...KOOOOOOOOOOOOK...",
    "..KOOHOOOOOOOOHOOK..",
    "..KOOOOOOOOOOOOOOK..",
    "..KBBBBBBBBBBBBBBK..",
    "..KOOOOOOOOOOOOOOK..",
    "..KOOKKKOOOOKKKOOK..",
    "..KOKOOOKOOKOOOKOK..",
    "..KOOOOOOOOOOOOOOK..",
    "..KOOOOOOOOOOOOOOK..",
    "..KOOOOODOODOOOOOK..",
    "..KOOOOOOOOOOOOOOK..",
    "..KDOODOODDOODOODK..",
    "...KDK..KDK..KDK....",
    "...KKK..KKK..KKK....",
    "....................",
    "....................",
    "...................."
  ];

  // "clawd": flat wide-bodied creature with side arms, four legs, > < squint
  var CLAWD = [
    "........................",
    "........................",
    "......OOOOOOOOOOOO......",
    "......OOOOOOOOOOOO......",
    "......OBBBBBBBBBBO......",
    "..OOOOOOKKOOOOKKOOOOOO..",
    "..OOOOOOOKKOOKKOOOOOOO..",
    "..OOOOOOKKOOOOKKOOOOOO..",
    "..OOOOOOOOOOOOOOOOOOOO..",
    "..OOOOOOOOOOOOOOOOOOOO..",
    "......OOOOOOOOOOOO......",
    "......OOOOOOOOOOOO......",
    "......OOOOOOOOOOOO......",
    "......OO.OO..OO.OO......",
    "......OO.OO..OO.OO......",
    "......OO.OO..OO.OO......",
    "......DD.DD..DD.DD......",
    "........................"
  ];

  var SHAPES = { claude: null, clawd: CLAWD }; // claude filled in below

  var PALETTES = {
    orange: { O: "#e8825a", D: "#d06a45", H: "#f2a37e", K: "#12100e", B: "#e8825a" },
    gold:   { O: "#e8825a", D: "#d06a45", H: "#f2a37e", K: "#12100e", B: "#e6c67c" },
    teal:   { O: "#5ba3aa", D: "#3e7f86", H: "#8fc6cb", K: "#0d1413", B: "#e6c67c" },
    marble: { O: "#dfe4e0", D: "#b7c0ba", H: "#f4f6f3", K: "#141a17", B: "#e6c67c" },
    shadow: { O: "#3a423d", D: "#262e2a", H: "#525b55", K: "#080b09", B: "#c9a24b" },
    mint:    { O: "#6fd6a8", D: "#4aa87e", H: "#a5ecc9", K: "#0d1512", B: "#e6c67c" },
    crimson: { O: "#d95d5d", D: "#b03e3e", H: "#f08c8c", K: "#140b0b", B: "#e6c67c" },
    ice:     { O: "#a9c9e8", D: "#7fa6cc", H: "#d3e6f7", K: "#0e1319", B: "#e6c67c" },
    royal:   { O: "#9b7ce0", D: "#7357b8", H: "#c3adf2", K: "#100b1a", B: "#e6c67c" }
  };

  SHAPES.claude = MAP;

  function render(el) {
    var variant = el.getAttribute("data-variant") || "orange";
    var shape = el.getAttribute("data-shape") || "claude";
    var grid = SHAPES[shape] || MAP;
    var pal = PALETTES[variant] || PALETTES.orange;
    var rows = grid.length, cols = grid[0].length;
    var canvas = document.createElement("canvas");
    canvas.width = cols; canvas.height = rows;
    var ctx = canvas.getContext("2d");
    for (var y = 0; y < rows; y++) {
      for (var x = 0; x < cols; x++) {
        var c = grid[y][x];
        if (c === ".") continue;
        // plain orange variant wears no laurel band
        if (c === "B" && variant === "orange") c = "O";
        ctx.fillStyle = pal[c] || pal.O;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    canvas.className = "pixel-canvas";
    el.appendChild(canvas);
  }

  document.querySelectorAll(".pixel-claude").forEach(render);
})();
