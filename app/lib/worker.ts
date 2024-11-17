const { Worker, QueueEvents } = require("bullmq");
const Redis = require("ioredis");
const { PrismaClient } = require("@prisma/client");
const { loadData } = require("./jobs.ts");

const redisConnection = new Redis("redis://redis:6379", {
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

const prisma = new PrismaClient();

module.exports = redisConnection;

const worker = new Worker(
  "queries",
  async (job) => {
    console.log(job.name);
    // switch (job.name) {
    //   case "loadData": {
    //     console.log("run");
    //     loadData(job.data);
    //     break;
    //   }
    // }
  },
  {
    connection: redisConnection,
  }
);

const queueEvents = new QueueEvents("queries", {
  connection: redisConnection,
});

queueEvents.on("waiting", ({ jobId }) => {
  console.log(`A job with ID ${jobId} is waiting`);
});

queueEvents.on("active", ({ jobId, prev }) => {
  console.log(`Job ${jobId} is now active; previous status was ${prev}`);
});

queueEvents.on("completed", ({ jobId, returnvalue }) => {
  console.log(`${jobId} has completed and returned ${returnvalue}`);
});

queueEvents.on("failed", ({ jobId, failedReason }) => {
  console.log(`${jobId} has failed with reason ${failedReason}`);
});
