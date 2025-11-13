export function generateUniqueLuckyNumber(
  digitsCount = 4,
  startRange: number = 1000,
  endRange: number = 9999,
  maxAttempts = 1000,
): number {
  if (digitsCount < 2 || digitsCount > 10) {
    throw new Error("digitsCount must be between 2 and 10");
  }
  if (startRange > endRange) {
    throw new Error("startRange must be less than or equal to endRange");
  }
  if (
    startRange < Math.pow(10, digitsCount - 1) ||
    endRange >= Math.pow(10, digitsCount)
  ) {
    throw new Error(
      `startRange and endRange must fit within the digitCount length of ${digitsCount}`,
    );
  }

  const digits = [...Array(10).keys()].map(String); // ["0","1",...,"9"]

  function pickRandom(arr: string[]): string {
    const index = Math.floor(Math.random() * arr.length);
    return arr.splice(index, 1)[0];
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Reset digits array each attempt
    const availableDigits = [...digits];

    // First digit cannot be zero
    const firstDigitPool = availableDigits.slice(1);
    const resultDigits = [pickRandom(firstDigitPool)];
    availableDigits.splice(availableDigits.indexOf(resultDigits[0]), 1);

    // Pick remaining unique digits
    for (let i = 1; i < digitsCount; i++) {
      resultDigits.push(pickRandom(availableDigits));
    }

    const resultNumber = Number(resultDigits.join(""));

    if (resultNumber >= startRange && resultNumber <= endRange) {
      return resultNumber;
    }
  }

  throw new Error(
    `Unable to generate a unique lucky number within range ${startRange} - ${endRange} after ${maxAttempts} attempts`,
  );
}
