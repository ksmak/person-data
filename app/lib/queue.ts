import { Queue, QueueEvents } from "bullmq";
const Redis = require("ioredis");

const redisConnection = new Redis("redis://redis:6379", {
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

export const queueEvents = new QueueEvents("queries", {
  connection: redisConnection,
});

const queueSingleton = () => {
  return new Queue("queries", {
    connection: redisConnection,
  });
};

declare const globalThis: {
  queueGlobal: ReturnType<typeof queueSingleton>;
} & typeof global;

const queue = globalThis.queueGlobal ?? queueSingleton();

export default queue;

if (process.env.NODE_ENV !== "production") globalThis.queueGlobal = queue;
