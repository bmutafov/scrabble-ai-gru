import { memoryUsage } from "./utils/memory-usage";
import { TrieSearch } from "./trie/trie-search";
import { Trie } from "./trie/trie";
import * as fs from "fs";
import { TrieSolve } from "./trie/trie-solve";

const trie = new Trie();

console.log("reading words...");
const words = fs.readFileSync("./dictionary.txt").toString().split("\r\n");
console.log("adding words...");
for (const word of words) {
  trie.add(word, true);
}

console.log("searching words...");
const trieSearch = new TrieSearch(trie);

console.time("search");

// const res = TrieSolve.solveForRow(
//   trie,
//   ["*", "б", "а", "н", "а", "н", "$ие", "*", "*", "к", "о", "н", "$ея", "*", "*"],
//   ["н", "е", "а", "я", "т", "к", "и"]
// );
const res = TrieSolve.solveForRow(
  trie,
  ["*", "*", "*", "*", "*", "*", "$тк", "*", "м", "*", "*", "*", "*", "*", "*"],
  ["о", "е", "а", "я", "т", "к", "и"]
);
console.log(res);

console.timeEnd("search");
memoryUsage();
