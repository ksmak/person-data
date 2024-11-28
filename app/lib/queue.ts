import { JobScheduler, JobSchedulerJson, Queue, QueueEvents, RepeatableJob } from "bullmq";
import IORedis from "ioredis";
import { scheduler } from "timers/promises";

let connection;

if (process.env.REDIS_PASSWORD) {
  connection = new IORedis({
    host: process.env.REDIS_URL,
    port: Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    family: 6,
    maxRetriesPerRequest: null,
  });
} else {
  connection = new IORedis({
    host: process.env.REDIS_URL,
    port: Number(process.env.REDIS_PORT),
    maxRetriesPerRequest: null,
  });
}

const queueSingleton = () => {
  const queue = new Queue("queries", {
    connection: connection,
  });

  queue
    .drain()
    .then(() => console.log("Queue drained."));

  queue.getJobSchedulers()
    .then((schedulers) => {
      schedulers.map((sheduler) => {
        if (sheduler.id) {
          queue.removeJobScheduler(sheduler.id);
        };
      });
    });


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
