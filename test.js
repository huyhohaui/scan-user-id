const CronJob = require('cron').CronJob;

const job = new CronJob('* * * * * *', function() {
	const d = new Date();
	console.log('Every Tenth Minute:', d);
});
job.start();