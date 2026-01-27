import startBookingSafetyNet from "./bookingSafetyNet.js";
import startGuideCleanup from "./cleanupTask.js";

const initCronTasks = () => {
    console.log("Starting cron tasks...");
    startBookingSafetyNet();
    startGuideCleanup();
};

export default initCronTasks;