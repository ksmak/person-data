const { Queue, Worker, QueueEvents } = require("bullmq");
const Redis = require("ioredis");

const redisConnection = new Redis("redis://redis:6379", {
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

module.exports = redisConnection;

const worker = new Worker(
  "foo",
  async (job) => {
    // Will print { foo: 'bar'} for the first job
    // and { qux: 'baz' } for the second.
    console.log(job.data);
  },
  {
    connection: redisConnection,
  }
);

const queueEvents = new QueueEvents("foo", {
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

// await myQueue.add("myJobName", { foo: "bar" });
// await myQueue.add("myJobName", { qux: "baz" });
