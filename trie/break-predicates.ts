import { Node } from "./trie";

export type BreakPredicate = (node: Node, backtrack: string) => boolean;
type DepthPredicateGenerator = (depth: number) => BreakPredicate;
type CheckOnlyPredicateGenerator = (checkOnly: string[]) => BreakPredicate;

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
}
