import express from "express";

const port = process.env.PORT || 3000;
const app = express();

app.get("/", (req, res) => {
  let total = 0;
  for (let i = 0; i < 50_000_000; i++) {
    total += i;
  }
  console.log(`Total: ${total}`);
  res.send(`Total: ${total}`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`worker pid: ${process.pid}`);
});

//  autocannon -c 10000 -d 10 http://localhost:3000

// npx pm2 start index.js
