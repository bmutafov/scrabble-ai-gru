import { GaddagGenerator } from "./gaddag";
export class Node {
  public letter: string;
  public children: Record<string, Node>;
  private _EOW = false;
  private _isLocked = false;

  get EOW() {
    return this._EOW;
  }

  set EOW(value) {
    if (!this._isLocked) {
      this._EOW = value;
    }
  }

  constructor(letter: string) {
    this.letter = letter;
  }

  addChild(node: Node): void {
    if (!this.children) {
      this.children = {};
    }

    if (this.children[node.letter]) {
      throw new Error(
        `You are trying to add a node as a child, for which a key already exists!. Node: ${JSON.stringify(
          this,
          null,
          2
        )}; Adding child: ${JSON.stringify(node, null, 2)}`
      );
    }

    this.children[node.letter] = node;
  }

  size(): number {
    return Object.keys(this.children).length;
  }

  has(letter: string): boolean {
    return this.children && Boolean(this.children[letter]);
  }

  get(letter: string): Node | null {
    if (!this.children) {
      return null;
    }
    return this.children[letter];
  }

  forEachChild(cb: (node: Node) => void) {
    if (this.children) {
      Object.values(this.children).forEach(cb);
    }
  }

  lock() {
    this._isLocked = true;
  }
}

export class Trie {
  public readonly ROOT: Node = new Node("");

  constructor() {
    this.ROOT.lock();
  }

  add(word: string, shouldAddGaddagInterpretation: boolean = false) {
    /**
     * If we are adding gaddag word, call recursively the same method
     * for each representation of this word
     */
    if (shouldAddGaddagInterpretation) {
      GaddagGenerator.fromWord(word).forEach((gaddagWord) => {
        this.add(gaddagWord, false);
      });
      return;
    }

    // Get the last available node for this word
    let { node, index } = this.climbToLastNode(this.ROOT, word, 0);

    // continue adding nodes until EOW
    if (index < word.length) {
      for (index; index < word.length; index++) {
        const newNode = new Node(word.charAt(index));
        node.addChild(newNode);
        node = newNode;
      }
    }

    node.EOW = true;
  }

  /**
   * Climbs to the last available node for this word
   */
  private climbToLastNode(node: Node, word: string, index: number): { node: Node; index: number } {
    // if we have reached a dead end, either EOW or no more children
    if (index === word.length || !node.has(word.charAt(index))) {
      return { index, node };
    }
    // otherwise climb to next node
    return this.climbToLastNode(node.get(word.charAt(index))!, word, index + 1);
  }
}
