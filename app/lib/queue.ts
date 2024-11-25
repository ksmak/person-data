import { Queue, QueueEvents } from "bullmq";
import Redis from "ioredis";

const redisConnection = new Redis({
  host: process.env.REDIS_URL,
  port: 6379,
  username: "default",
  password: "e6423dba74e4493a88a5a0f090cf8453",
  family: 6,
});

const queueSingleton = () => {
  const queue = new Queue("queries", {
    connection: redisConnection,
  });

  queue
    .upsertJobScheduler(
      "repeat-every-10s",
      {
        every: 10000,
      },
      {
        name: "process-queries",
      }
    )
    .then(() => console.log("Sheduler job started."));

  return queue;
};

declare const globalThis: {
  queueGlobal: ReturnType<typeof queueSingleton>;
} & typeof global;

const queue = globalThis.queueGlobal ?? queueSingleton();

export default queue;

if (process.env.NODE_ENV !== "production") globalThis.queueGlobal = queue;

export const queueEvents = new QueueEvents("queries", {
  connection: redisConnection,
});
