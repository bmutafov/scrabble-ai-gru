import { TrieSearch } from "./trie/trie-search";
import { readDictionary } from "./utils/read-dictionary";
import fastify from "fastify";
import { Trie } from "./trie/trie";

const server = fastify({ logger: true });

const trie = new Trie();
const trieSearch = new TrieSearch(trie);

server.get("/startsWith", async (request, reply) => {
  const { prefix } = request.query as { prefix: string };

  return trieSearch.startsWith(prefix);
});

server.get("/endsWith", async (request, reply) => {
  const { suffix } = request.query as { suffix: string };

  return trieSearch.endsWith(suffix);
});

server.get("/contains", async (request, reply) => {
  const { keyword } = request.query as { keyword: string };

  return trieSearch.contains(keyword);
});

const start = async () => {
  try {
    readDictionary(trie);
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
