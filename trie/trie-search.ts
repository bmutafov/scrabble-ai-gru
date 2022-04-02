import { GaddagGenerator } from "./gaddag";
import { reverse } from "../utils/reverse";
import { Node, Trie } from "./trie";
import { BreakPredicate, BreakPredicates } from "./break-predicates";

export class TrieSearch {
  constructor(private readonly trie: Trie) {}

  /**
   * Search for a word in the trie
   * @param word The word to be searched
   * @returns Boolean result if the word is found in the tree
   */
  lookup(word: string): boolean {
    const node = this.directPathTo(this.trie.ROOT, word);
    if (!node) return false;

    return node.EOW;
  }

  startsWith(prefix: string, depth?: number): string[] {
    if (prefix.length === 0)
      throw new Error(
        "Prefix must be at least one character long. If you meant to fetch all words, use all() method instead"
      );
    if (depth && prefix.length > depth) {
      throw new Error("Prefix must be shorter than search depth");
    }
    // we add plus (+) because in gaddag, all words in the tree
    // starting with a certain prefix are save in the following
    // format {reverse(prefix)}+
    const node = this.directPathTo(this.trie.ROOT, "+" + prefix);
    if (!node) return [];

    const predicates = this.getPredicates({ depth });

    const foundWords = this.iterateRest(node, reverse(prefix), predicates);
    return Array.from(foundWords);
  }

  endsWith(suffix: string, depth?: number): string[] {
    const node = this.directPathTo(this.trie.ROOT, suffix);
    if (!node) return [];

    const predicates = this.getPredicates({ depth, additionalPredicates: [BreakPredicates.plusBreak] });

    const foundWords = this.iterateRest(node, reverse(suffix.substring(1)), predicates);
    return Array.from(foundWords);
  }

  contains(keyword: string, depth?: number, checkOnly?: string[]): string[] {
    const node = this.directPathTo(this.trie.ROOT, keyword);
    if (!node) return [];
    const predicates = this.getPredicates({ depth, checkOnly });

    const foundWords = this.iterateRest(node, reverse(keyword.substring(1)), predicates);
    return Array.from(foundWords);
  }

  public directPathTo(node: Node, word: string): Node | null {
    let _node = node;

    // we iterate backwards, because we save the words in GADDAG manner.
    for (let i = word.length - 1; i >= 0; i--) {
      const letterNode = _node.get(word.charAt(i));
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
    if (breakPredicates.some((predicate) => predicate(node, backtrack))) return matched;

    const nextBacktrack = backtrack + node.letter;

    if (node.EOW) {
      matched.add(GaddagGenerator.normalize(nextBacktrack));
    }

    node.forEachChild((childNode) => this.iterateRest(childNode, nextBacktrack, breakPredicates, matched));

    return matched;
  }

  private getPredicates({
    depth,
    checkOnly,
    additionalPredicates,
  }: {
    depth?: number;
    checkOnly?: string[];
    additionalPredicates?: BreakPredicate[];
  }): BreakPredicate[] {
    const predicates: BreakPredicate[] = [];
    if (depth) {
      predicates.push(BreakPredicates.depthPredicate(depth));
    }

    if (checkOnly) {
      predicates.push(BreakPredicates.checkOnlyPredicate(checkOnly));
    }

    if (additionalPredicates) {
      predicates.push(...additionalPredicates);
    }

    return predicates;
  }
}
