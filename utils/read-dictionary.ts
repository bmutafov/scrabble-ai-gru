import * as fs from "fs";
import { join } from "path";
import { Trie } from "../trie/trie";

export const readDictionary = (trie: Trie) => {
  console.log("reading words...");
  const words = fs.readFileSync(join(__dirname, "..", "dictionary.txt")).toString().split("\r\n");
  console.log("adding words...");
  for (const word of words) {
    trie.add(word, true);
  }
  console.log("✅ dictionary imported");
};
