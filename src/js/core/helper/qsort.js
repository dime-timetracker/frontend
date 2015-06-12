 var qsort = function (compare, key, array, left, right) {
  left = left || 0;
  right = right || array.length - 1;
  var i = left;
  var j = right;
  var tmp;
  var pivotidx = (left + right) / 2;
  var pivot = key(array[pivotidx.toFixed()]);
  /* partition */
  while (i <= j) {
    while (compare(key(array[i]), pivot) === -1) {
      i++;
    }
    while (compare(key(array[j]), pivot) === 1) {
      j--;
    }
    if (i <= j) {
      tmp = array[i];
      array[i] = array[j];
      array[j] = tmp;
      i++;
      j--;
    }
  }

  /* recursion */
  if (left < j) {
    qsort(compare, key, array, left, j);
  }
  if (i < right) {
    qsort(compare, key, array, i, right);
  }
};

module.exports = qsort;