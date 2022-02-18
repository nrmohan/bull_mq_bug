import { Worker, Job } from 'bullmq';
const taskQueueName = `task-queue`;

const connection = {
    host: 'localhost',
    port: 6379
}

export const requestTaskWorker = new Worker(taskQueueName, async (job: Job) => {

    switch (job.name) {

        case 'task3': {
            console.log(`processing ${job.name}-${job.id} at ${Date.now()}`)

            if (job.attemptsMade != job.opts.attempts) {
                throw {};
            }
        }
        case 'task2': {
            console.log(`processing ${job.name}-${job.id} at ${Date.now()}`)
            if (job.attemptsMade != job.opts.attempts) {
                throw {};
            }
        }
    }
}, {
    connection: connection
});

requestTaskWorker.on('error', function (error) {
    console.log(`requestTaskWorker error  ${error}`)
})