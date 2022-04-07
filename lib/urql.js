import { createClient } from "urql";

const client = createClient({
  url: process.env.THE_GRAPH_API_URL,
});

export default client;
