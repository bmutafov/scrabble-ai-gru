import { reverse } from "../utils/reverse";
import { Node } from "./trie";

export type BreakPredicate = (node: Node, backtrack: string) => boolean;
type DepthPredicateGenerator = (depth: number) => BreakPredicate;
type CheckOnlyPredicateGenerator = (checkOnly: string[]) => BreakPredicate;
type BetweenPredicate = (prefix: string, suffix: string) => BreakPredicate;

export class BreakPredicates {
  static plusBreak: BreakPredicate = (node) => node.letter === "+";

  static depthPredicate: DepthPredicateGenerator = (depth) => {
    return (node, backtrack) => {
      return backtrack.length === depth;
    };
  };

  static checkOnlyPredicate: CheckOnlyPredicateGenerator = (checkOnly) => {
    return (node) => {
      return ![...checkOnly, ""].includes(node.letter);
    };
  };

  static betweenPredicate: BetweenPredicate = (prefix, suffix) => {
    return (node, backtrack) => {
      if (backtrack.length === prefix.length + suffix.length + 1) {
        return true;
      }
      if (backtrack.startsWith(reverse(prefix) + "+")) {
        const currentChar = backtrack.length - prefix.length - 1;
        if (node.letter !== suffix.charAt(currentChar)) {
          return true;
        }
      }
      return false;
    };
  };
}
