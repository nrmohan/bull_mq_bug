import { requestTaskWorker } from "./worker";

(async () => {
    console.log('running')

})();

requestTaskWorker.on("failed", (job, err) => {
    //console.log(`Failed job ${job.id} with ${err}`)
});