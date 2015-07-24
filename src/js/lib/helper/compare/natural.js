module.exports = function (left, right) {
  for (var x = 0, aa, bb; (aa = left[x]) && (bb = right[x]); x++) {
      aa = aa.toLowerCase();
      bb = bb.toLowerCase();
      if (aa !== bb) {
        var c = Number(aa), d = Number(bb);
        if (c == aa && d == bb) {
          return c - d;
        } else {
          return (aa > bb) ? 1 : -1;
        }
    }
  }
  return left.length - right.length;
};