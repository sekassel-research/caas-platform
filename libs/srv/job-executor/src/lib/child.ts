process.on('message', (job) => {
    console.log("JobStatus:" + job.state);

    // FIXME job.execute();
    process.disconnect();
});
