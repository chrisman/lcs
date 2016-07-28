var fs  = require("fs");

// < HELPERS > //
var compose = (funs) => (init) => 
  funs.reduceRight((val, f) => f(val), init);
var log = (x) => {
  console.log(x);
  return x;
};
var wog = (msg) => (what) => { // "wordy" log
  console.log(msg, what);
  return what;
}
var split = (what) => (str) => str.split(what);
var head = (arr) => arr[0];
var last = (arr) => arr[arr.length - 1];
var torso = (arr) => arr.slice(0, arr.length - 1); // not tail?
var len = (arr) => arr.length;
var map = (f) => (arr) => arr.map(x => f(x));
var each = (f) => (arr) => {
  arr.forEach(x => f(x));
  return arr;
};
var filter = (f) => (arr) => arr.filter(x => f(x));
var string = (x) => x.toString();
var trim = (str) => str.trim();
var append = (what) => (str) => str.concat(what);
var same = (x) => (y) => x === y;
var max = (x) => (y) => x > y ? x : y;
var greater = (greater) => (than) => greater > than;
var longer = (x) => (y) => x > y ? x : y;
var grid = (x) => (y) => Array.from({length: x}).map(x => 
  Array.from({length: y})
    .map(x => 0));
var both = (x) => (y) => x && y;
var either = (x) => (y) => x || y;
// </ HELPERS > //

// widh recursion and memoization
var another_lcs = (arr) => {
  var left = head(arr);
  var right = last(arr);
  var memo = {};

  var recur = (l) => (r) => {
    // return cache if possible
    if ((memo[l]||{})[r]) return memo[l][r];
    if ((memo[r]||{})[l]) return memo[r][l];

    else {
      if (!memo[l]) memo[l] = {};

      if (len(l) == 0 || len(r) == 0) {
        return '';
      } else if (last(l) == last(r)) {
        memo[l][r] = append
          (last(l))
          (recur
            (torso(l)) 
            (torso(r)) 
          )
        return memo[l][r];
      } else {
        memo[l][r] = longer
          (recur
            (torso(l))
            (r)
          )
          (recur
            (l)
            (torso(r))
          );
        return memo[l][r];
      } 
    }
  }

  return recur(left)(right);
}

// lcs :: (string array) => string
var lcs = (arr)  => {
  var left = head(arr);
  var right = last(arr);
  var x = len(left);
  var y = len(right);
  var g = grid(x + 1)(y + 1);
  
  // Fill array with lengths of common subesquences of prefixes
  // thanks https://youtu.be/NnD96abizww
  for (var i = 1; i < x; i++) {
    for (var j = 1; j < y; j++) {
      g[i][j] = (same
        (left [i - 1])
        (right[j - 1])
      )
      ? g[i - 1][j - 1] + 1
      : max
        (g[i - 1][j])
        (g[i][j - 1]);
    }
  }

  // Backtrace array
  var answer = "";
  var i = x, j = y;
  while (i && j) {
    if (same
      (left [i - 1])
      (right[j - 1])
    ) {
      answer = append
        (answer)
        (left[i - 1]);
      i--; j--;
    } else if (greater
      (g[i - 1][j])
      (g[i][j - 1]) 
    ) {
      i--;
    } else {
      j--;
    }
  }

  return answer;
}

if (process.argv[2]) {
  compose.call(null, [
    // process each line
    each(compose.call(null, [
      log, 
      trim,
      //lcs, 
      another_lcs,
      split(';')
    ])), 
    // process input
    filter(line => line !== ''), 
    split('\n'), 
    string
  ]) (fs.readFileSync(process.argv[2]));
}
