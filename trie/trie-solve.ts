import { Trie } from "./trie";
import { TrieSearch } from "./trie-search";
import { TrieUtils } from "./trie-utils";

type WordWithIndex = { word: string; index: number };

export class TrieSolve {
  static solveForRow(trie: Trie, row: string[], hand: string[]): WordWithIndex[] {
    if (row.length !== 15) throw `Row must include strictly 15 letters!`;

    const result: WordWithIndex[] = [];

    const startingIndexes = TrieSolve.getStartingPoints(row);

    for (const index of startingIndexes) {
      if (TrieUtils.isLetter(row[index])) {
        let coreWord = row[index];

        for (let i = index - 1; i >= 0; i--) {
          if (TrieUtils.isLetter(row[i])) {
            coreWord = row[i] + coreWord;
          } else break;
        }
        const trieSearch = new TrieSearch(trie);
        const onlyLetters = ["+", ...hand, ...row.filter((letter) => TrieUtils.isLetter(letter))];
        const containsWords = trieSearch.contains(coreWord, coreWord.length + hand.length, onlyLetters);
        const validWords = TrieSolve.findValidWords(containsWords, coreWord, row, hand);
        result.push(...validWords);
      } else {
        for (const possibleLetter of TrieUtils.getPossibleLetters(row[index])) {
          const trieSearch = new TrieSearch(trie);
          const onlyLetters = ["+", ...hand, ...row.filter((letter) => TrieUtils.isLetter(letter))];
          const containsWords = trieSearch.contains(possibleLetter, hand.length + 1, onlyLetters);
          const validWords = TrieSolve.findValidWords(containsWords, possibleLetter, row, hand);
          result.push(...validWords);
        }
      }

      // const trieSearch = new TrieSearch(trie);
      // const onlyLetters = ["+", ...hand, ...row.filter((letter) => TrieUtils.isLetter(letter))];
      // const containsWords = trieSearch.contains(coreWord, coreWord.length + hand.length, onlyLetters);
      // const validWords = TrieSolve.findValidWords(containsWords, coreWord, row, hand);

      // result.push(...validWords);
    }

    return result;
  }

  private static getStartingPoints(row: string[]): number[] {
    return row.reduce((acc, curr, index) => {
      if (TrieUtils.isLetter(curr) && !TrieUtils.isLetter(row[index + 1])) {
        acc.push(index);
      }
      if (TrieUtils.isAnchor(curr) && TrieUtils.isPlayable(row[index + 1]) && TrieUtils.isPlayable(row[index - 1])) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);
  }

  private static findValidWords(words: string[], coreWord: string, row: string[], hand: string[]): WordWithIndex[] {
    const validWords = words.reduce((validWords, currentWord) => {
      const { fit, startIndex } = TrieSolve.fitsRow(currentWord, coreWord, row, hand);
      if (fit && currentWord !== coreWord) {
        validWords.push({ word: currentWord, index: startIndex! });
      }

      return validWords;
      //TODO: Extract to interface
    }, [] as WordWithIndex[]);

    return validWords;
  }

  private static fitsRow(
    word: string,
    coreWord: string,
    row: string[],
    hand: string[]
  ): { fit: boolean; startIndex?: number } {
    const rowAsString = row.map((letter) => letter.charAt(0)).join("");
    const coreWordIndexAtRow = rowAsString.includes(coreWord)
      ? rowAsString.indexOf(coreWord)
      : row.findIndex((letter) => TrieUtils.isAnchor(letter) && letter.includes(coreWord));
    const coreWordIndexAtWord = word.indexOf(coreWord);
    const startingIndexAtRow = coreWordIndexAtRow - coreWordIndexAtWord;
    let handCopy = [...hand];

    if (
      startingIndexAtRow < 0 ||
      !TrieUtils.isValid(row[startingIndexAtRow - 1]) ||
      !TrieUtils.isValid(row[startingIndexAtRow + word.length]) ||
      TrieUtils.isLetter(row[startingIndexAtRow - 1]) ||
      TrieUtils.isLetter(row[startingIndexAtRow + word.length])
    ) {
      return { fit: false };
    }

    for (let i = startingIndexAtRow; i < startingIndexAtRow + word.length; i++) {
      const currentLetterOfWord = word.charAt(i - startingIndexAtRow);
      const currentLetterOnRow = row[i];

      if (TrieUtils.isLetter(currentLetterOnRow)) {
        if (currentLetterOfWord !== currentLetterOnRow) {
          return { fit: false };
        }
      } else {
        let indexOfHandLetter = -1;

        if (TrieUtils.isAnchor(currentLetterOnRow)) {
          const possibleLetters = TrieUtils.getPossibleLetters(currentLetterOnRow);
          if (!possibleLetters.includes(currentLetterOfWord)) return { fit: false };
        }

        indexOfHandLetter = TrieSolve.getIndexInHand(currentLetterOfWord, handCopy);
        if (indexOfHandLetter >= 0) {
          handCopy.splice(indexOfHandLetter, 1);
        } else {
          return { fit: false };
        }
      }
    }

    return { fit: true, startIndex: startingIndexAtRow };
  }

  /**
   * Determines if the hand contains a letter which can go in a certain spot.
   * If it does it returns the index of the letter in the hand array, otherwise returns -1
   */
  private static getIndexInHand(currentLetter: string, hand: string[]): number {
    return hand.findIndex((letter) => currentLetter === letter);
  }
}
