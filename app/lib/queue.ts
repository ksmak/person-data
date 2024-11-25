import { Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis({
  // host: "redis",
  host: process.env.REDIS_URL,
  port: 6379,
  maxRetriesPerRequest: null,
});

const queueSingleton = () => {
  const queue = new Queue("queries", {
    connection: connection,
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
  connection: connection,
});
