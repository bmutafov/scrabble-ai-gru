import { GaddagGenerator } from "./gaddag";
import { reverse } from "../utils/reverse";
import { Node, Trie } from "./trie";

type BreakPredicate = (node: Node) => boolean;

class BreakPredicates {
  static plusBreak: BreakPredicate = (node) => node.letter === "+";
}

export class TrieSearch {
  constructor(private readonly trie: Trie) {}

  /**
   * Search for a word in the trie
   * @param word The word to be searched
   * @returns Boolean result if the word is found in the tree
   */
  lookup(word: string): boolean {
    const node = this.hasDirectPath(this.trie.ROOT, word);
    if (!node) return false;

    return node.EOW;
  }

  startsWith(prefix: string): string[] {
    // we add plus (+) because in gaddag, all words in the tree
    // starting with a certain prefix are save in the following
    // format {reverse(prefix)}+
    const node = this.hasDirectPath(this.trie.ROOT, "+" + prefix);
    if (!node) return [];

    const foundWords = this.iterateRest(node, reverse(prefix));
    return Array.from(foundWords);
  }

  endsWith(suffix: string): string[] {
    const node = this.hasDirectPath(this.trie.ROOT, suffix);
    if (!node) return [];

    const foundWords = this.iterateRest(node, reverse(suffix.substring(1)), [
      BreakPredicates.plusBreak,
    ]);
    return Array.from(foundWords);
  }

  private hasDirectPath(node: Node, word: string): Node | null {
    let _node = node;

    // we iterate backwards, because we save the words in GADDAG manner.
    for (let i = word.length - 1; i >= 0; i--) {
      const letterNode = _node.children.get(word.charAt(i));
      if (letterNode) _node = letterNode;
      else return null;
    }
    return _node;
  }

  private iterateRest(
    node: Node,
    backtrack: string = "",
    breakPredicates: BreakPredicate[] = [],
    matched: Set<string> = new Set()
  ): Set<string> {
    if (breakPredicates.some((predicate) => predicate(node))) return matched;

    const nextBacktrack = backtrack + node.letter;

    if (node.EOW) {
      matched.add(GaddagGenerator.normalize(nextBacktrack));
    }

    node.children.forEach((childNode) =>
      this.iterateRest(childNode, nextBacktrack, breakPredicates, matched)
    );

    return matched;
  }
}
