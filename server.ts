import { memoryUsage } from "./utils/memory-usage";
import { TrieSearch } from "./trie/trie-search";
import { isProd, readDictionary } from "./utils/read-dictionary";
import fastify from "fastify";
import { Trie } from "./trie/trie";
import { TrieSolve } from "./trie/trie-solve";
import path from "path";

type Prefix = { prefix: string };
type Suffix = { suffix: string };
type Keyword = { keyword: string };
type Depth = { depth?: string };
type Solve = { row: string[]; hand: string[] };

const server = fastify({ logger: true });

const frontendPath = isProd()
  ? path.join(__dirname, "..", "frontend", "build")
  : path.join(__dirname, "frontend", "build");
server.register(require("fastify-cors"));
server.register(require("fastify-static"), {
  root: frontendPath,
});

const trie = new Trie();
const trieSearch = new TrieSearch(trie);

server.get("/startsWith", async (request, reply) => {
  const { prefix, depth } = request.query as Prefix & Depth;

  return trieSearch.startsWith(prefix, depth ? +depth : undefined);
});

server.get("/endsWith", async (request, reply) => {
  const { suffix, depth } = request.query as Suffix & Depth;

  return trieSearch.endsWith(suffix, depth ? +depth : undefined);
});

server.get("/contains", async (request, reply) => {
  const { keyword } = request.query as Keyword;

  return trieSearch.contains(keyword);
});

server.get("/between", async (request, reply) => {
  const { prefix, suffix } = request.query as Prefix & Suffix;

  return trieSearch.between(prefix, suffix);
});

server.post("/solve", async (request, reply) => {
  const { row, hand } = request.body as Solve;
  const words = TrieSolve.solveForRow(trie, row, hand);

  return words;
});

const start = async () => {
  try {
    readDictionary(trie);
    memoryUsage();
    await server.listen(process.env.PORT || 5100);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
