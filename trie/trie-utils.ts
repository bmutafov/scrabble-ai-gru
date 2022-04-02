export class TrieUtils {
  static isLetter(string?: string): boolean {
    return TrieUtils.isString(string) && !string.startsWith("$") && string !== "*";
  }

  static isAnchor(string?: string): boolean {
    return TrieUtils.isString(string) && string.startsWith("$");
  }

  static isAnyLetter(string?: string): boolean {
    return TrieUtils.isString(string) && string === "*";
  }

  static isPlayable(string?: string): boolean {
    return TrieUtils.isAnchor(string) || TrieUtils.isAnyLetter(string);
  }

  static isValid(string?: string): boolean {
    return TrieUtils.isString(string);
  }

  static getPossibleLetters(string?: string): string[] {
    return TrieUtils.isString(string) ? string.replace("$", "").split("") : [];
  }

  private static isString(string?: string): string is string {
    return typeof string === "string";
  }
}
