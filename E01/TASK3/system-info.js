import os from "os";

 function getSystemInfo(){
    return{
        "uptime": os.uptime(),
        "totalmemory": (os.totalmem() / (1024 * 1024)),
        "platform": os.platform(),
        "CPU": os.arch(),
        "CPU cores": os.cpus().length
    };
 }

 console.table (getSystemInfo());