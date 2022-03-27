import { GaddagGenerator } from "./gaddag";
export class Node {
  public letter: string;
  public children: Map<string, Node> = new Map();
  public EOW = false;

  constructor(letter: string) {
    this.letter = letter;
  }
}

export class Trie {
  public readonly ROOT: Node = new Node("");

  add(word: string, shouldAddGaddagInterpretation: boolean = false) {
    /**
     * If we are adding gaddag word, call recursively the same method
     * for each representation of this word
     */
    if (shouldAddGaddagInterpretation) {
      GaddagGenerator.fromWord(word).forEach((gaddagWord) =>
        this.add(gaddagWord, false)
      );
      return;
    }

    // Get the last available node for this word
    let { node, index } = this.climbToLastNode(this.ROOT, word, 0);

    // continue adding nodes until EOW
    if (index < word.length) {
      for (index; index < word.length; index++) {
        const newNode = new Node(word.charAt(index));
        node.children.set(word.charAt(index), newNode);
        node = newNode;
      }
    }

    node.EOW = true;
  }

  /**
   * Climbs to the last available node for this word
   */
  private climbToLastNode(
    node: Node,
    word: string,
    index: number
  ): { node: Node; index: number } {
    // if we have reached a dead end, either EOW or no more children
    if (index === word.length - 1 || !node.children.has(word.charAt(index))) {
      return { index, node };
    }
    // otherwise climb to next node
    return this.climbToLastNode(
      node.children.get(word.charAt(index))!,
      word,
      index + 1
    );
  }
}
