import * as fs from "fs";
import { join } from "path";
import { Trie } from "../trie/trie";

export const isProd = () => process.env.NODE_ENV === "production";

export const readDictionary = (trie: Trie) => {
  console.log("reading words...");
  const filePath = isProd()
    ? join(__dirname, "..", "..", "english_dictionary.txt")
    : join(__dirname, "..", "english_dictionary.txt");
  const maxLength = isProd() ? 15 : 16;

  const words = fs.readFileSync(filePath).toString().split("\r\n");
  console.log("🚩 ~ words", words.length);
  console.log("adding words...");
  for (const word of words) {
    if (word.length > 1 && word.length < maxLength) {
      trie.add(word, true);
    }
  }
  console.log("✅ dictionary imported");
};
