import express from "express";
import cluster from "cluster";
import os from "os";

const cpus = os.cpus().length;

const port = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
  let total = 0;
  for (let i = 0; i < 50_000_000; i++) {
    total += i;
  }
  console.log(`Total: ${total} pid: ${process.pid}`);
  res.send(`Total: ${total} pid: ${process.pid}`);
  cluster.worker.kill();
});

if (cluster.isMaster) {
  console.log(`Master pid: ${process.pid}`);
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.listen(port, () => {
    console.log(
      ` 🚀 Server running on port ${port} 👉 worker pid: ${process.pid}`
    );
  });
}

//  autocannon -c 10000 -d 10 http://localhost:3000
// npx pm2 start index.js
