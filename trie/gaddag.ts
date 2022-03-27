import { reverse } from "../utils/reverse";

export class GaddagGenerator {
  static fromWord(word: string): string[] {
    const letters = word.split("");

    const gaddagWords: string[] = [reverse(word)];
    for (let i = 1; i <= letters.length; i++) {
      const prefix = reverse(word.substring(0, i));
      const suffix = word.substring(i, word.length);
      if (i < letters.length) {
        gaddagWords.push(`${prefix}+${suffix}`);
      }
    }

    return gaddagWords;
  }

  static normalize(word: string): string {
    const [prefix, suffix] = word.split("+");
    return `${reverse(prefix)}${suffix || ""}`;
  }
}
