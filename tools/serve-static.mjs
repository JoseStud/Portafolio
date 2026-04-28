import { createStaticServer } from "./static-server.mjs";

const host = process.env.HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.PORT ?? "4173", 10);

const server = createStaticServer();

server.listen(port, host, () => {
  console.log(`Serving FEIN static site at http://${host}:${port}/`);
});
