const _ = require("lodash");
function solution(n) {
  // tinh so uoc so
  const count_divisors = (n) => {
    var count = 0;
    for (let i = 0; i <= n / 2; i++) {
      if (n % i == 0) {
        count++;
      }
    }
  };
}
solution(10, 12);
