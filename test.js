const CronJob = require("cron").CronJob;

async function abc(index) {
  index++;
  console.log("index: ", index);
}

const job = new CronJob("* * * * * *", async () => {
  const d = new Date();
  await abc(10);
  console.log("Every Tenth Minute:", d);
});

for (index = 0; index < 10; index++) {
  job.start();

  
}
setTimeout(function() {
    job.stop();
  }, 1000);