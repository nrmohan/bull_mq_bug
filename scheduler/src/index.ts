import { Worker, Job, FlowProducer, QueueScheduler, Queue, QueueEvents } from 'bullmq';

const TASK_QUEUE = `task-queue`;
const connection = {
    host: 'localhost',
    port: 6379
}
const cwTaskqueue = new Queue(TASK_QUEUE, {
    connection: connection
});

const myQueueScheduler = new QueueScheduler(TASK_QUEUE, {
    connection: connection
});

const flowProducer = new FlowProducer({
    connection: connection
});
var retry = 20;
var delay = 25000;

async function addJob() {
    await flowProducer.add({
        name: 'task3',
        data: { status: "plan" },
        opts: { attempts: retry, backoff: { type: 'fixed', delay: delay } },
        queueName: TASK_QUEUE,
        children: [
            {
                name: 'task2',
                data: {},
                queueName: TASK_QUEUE,
                opts: { attempts: retry, backoff: { type: 'fixed', delay: delay } },
                children: [{
                    name: 'task3',
                    data: { status: "proposal" },
                    opts: { attempts: retry, backoff: { type: 'fixed', delay: delay } },
                    queueName: TASK_QUEUE,
                }]
            }]
    });
}

async function addJobs(count: number) {
    for (let i = 0; i < count; i++) {
        await addJob();
    }
}

(async () => {
    console.log('adding jobs')
    await addJobs(5);
})();

const queueEvents = new QueueEvents(TASK_QUEUE);
queueEvents.on("completed", (job) =>
    console.log(
        `Completed job  successfully`
    )
);
queueEvents.on("failed", (job, err) => { }
    //console.log(`Failed job ${job.jobId} with ${err}`)
);