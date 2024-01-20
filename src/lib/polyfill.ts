// Array.at polyfill
if (!Array.prototype.at) {
  Array.prototype.at = function (index: number) {
    // Get the length of the array
    const length = this.length;

    // Convert negative index to a positive index
    if (index < 0) {
      index = length + index;
    }

    // Return undefined if the index is out of range
    if (index < 0 || index >= length) {
      return undefined;
    }

    // Use Array.prototype.slice method to get value at the specified index
    return Array.prototype.slice.call(this, index, index + 1)[0];
  };
}

// Array.findLastIndex polyfill
if (!Array.prototype.findLastIndex) {
  Array.prototype.findLastIndex = function (callback, thisArg) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (callback.call(thisArg, this[i], i, this)) return i;
    }
    return -1;
  };
}
