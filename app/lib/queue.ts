import { Queue, QueueEvents } from "bullmq";
import Redis from "ioredis";

const redisConnection = new Redis("redis://redis:6379", {
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

const queueSingleton = () => {
  const queue = new Queue("queries", {
    connection: redisConnection,
  });

  queue.upsertJobScheduler('repeat-every-10s', {
    every: 10000
  }, {
    name: 'process-queries'
  })
    .then(() => console.log('Sheduler job started.'));

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
