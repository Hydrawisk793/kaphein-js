var TimerScheduler = require("../src/timer-scheduler").TimerScheduler;

var scheduler = new TimerScheduler();
var timer1 = scheduler.schedule("timer1", 1000, {
    counter : 0
});
timer1.addEventListener(
    "ticked",
    function (e)
    {
        console.log(e.source.getName(), e.context.counter++);

        if(e.context.counter === 3) {
            var timer2 = e.source.getTimerScheduler().schedule("timer2", 2000, {
                counter : 10
            });
            timer2.addEventListener(
                "ticked",
                function (e)
                {
                    console.log(e.source.getName(), e.context.counter++);

                    if(e.context.counter >= 15) {
                        e.source.stop("ended");
                    }
                }
            );
            timer2.addEventListener(
                "stopped",
                function (e)
                {
                    console.log(e.source.getName(), "stopped event", e.context, e.value, e.error);
                }
            );
        }

        if(e.context.counter >= 10) {
            e.source.getTimerScheduler().stopAll("stopAll");
        }

        if(e.context.counter >= 12) {
            e.source.stop("ended");
        }
    }
);
timer1.addEventListener(
    "stopped",
    function (e)
    {
        console.log(e.source.getName(), "stopped event", e.context, e.value, e.error);
    }
);
timer1.waitForStop()
    .then(
        function (res)
        {
            console.log("timer1", "waitForStop", res);
        }
    )
;
