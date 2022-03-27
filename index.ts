import { TrieSearch } from "./trie/trie-search";
import { Trie } from "./trie/trie";

const trie = new Trie();

trie.add("пенис", true);
trie.add("педантичен", true);
trie.add("пениса", true);
trie.add("пениси", true);
trie.add("тенис", true);
trie.add("степен", true);

const trieSearch = new TrieSearch(trie);

console.log(trieSearch.lookup("пенис"));
console.log(trieSearch.lookup("тенис"));
console.log(trieSearch.lookup("тениса"));
console.log(trieSearch.lookup("синеп"));
console.log(trieSearch.lookup("еп+нис"));
console.log(trieSearch.lookup("курче"));
console.log(trieSearch.endsWith("енис"));
console.log(trieSearch.endsWith("че"));
console.log(trieSearch.endsWith("хх"));
console.log(trieSearch.startsWith("пе"));
