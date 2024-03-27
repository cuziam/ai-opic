function solution(babbling) {
  let answer = 0;

  function canBabble(targetWord) {
    //base case
    if (targetWord.length === 0) return true;
    //recursive case
    const wordSet = ["aya", "ye", "woo", "ma"];
    for (const word of wordSet) {
      if (
        targetWord.startsWith(word) &&
        canBabble(targetWord.slice(word.length))
      ) {
        return true;
      }
    }
  }

  return answer;
}
