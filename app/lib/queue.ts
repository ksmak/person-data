import { Queue, QueueEvents } from "bullmq";

export const queueEvents = new QueueEvents("queries", {
  connection: {
    host: "redis",
    port: 6379
  }
});

const queueSingleton = () => {
  return new Queue("queries", {
    connection: {
      host: "redis",
      port: 6379
    }
  });
};

declare const globalThis: {
  queueGlobal: ReturnType<typeof queueSingleton>;
} & typeof global;

const queue = globalThis.queueGlobal ?? queueSingleton();

export default queue;

if (process.env.NODE_ENV !== "production") globalThis.queueGlobal = queue;
