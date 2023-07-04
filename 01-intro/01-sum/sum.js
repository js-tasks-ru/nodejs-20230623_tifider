function sum(a, b) {
  if (typeof a != 'number' || typeof b != 'number') {
    throw new TypeError('Got argument of incorrect type, expected number.');
  }

  return a + b;
}

module.exports = sum;
