class Clock
{
    #intervalId;
    constructor(time)
    {
        time = time.split(":").map(Number);
        this.hours = time[0];
        this.minutes = time[1];
        this.seconds = time[2];
        this.#intervalId = null;
    }

    static formatTime(hours, minutes, seconds)
    {
        if(`${hours}`.length != 2)
            hours = `0${hours}`;
        if(`${minutes}`.length != 2)
            minutes = `0${minutes}`;
        if(`${seconds}`.length != 2)
            seconds = `0${seconds}`;
        return `${hours}:${minutes}:${seconds}`;
    }

    #tick()
    {
        if(this.seconds == 59)
        {
            this.seconds = 0;
            if(this.minutes == 59)
            {
                this.minutes = 0;
                if(this.hours == 23)
                {
                    this.hours = 0;
                }
                else
                {
                    this.hours++;
                }
            }
            else
            {
                this.minutes++;
            }
        }
        else
        {
            this.seconds++;
        }
    }

    start()
    {
        if(this.#intervalId != null)
            return `Clock is already running`;

        this.#intervalId = setInterval(()=>this.#tick(), 1000);
        return `Clock Started`
    }

    stop()
    {
        if(this.#intervalId == null)
            return `Clock is not running`;

        clearInterval(this.#intervalId);
        this.#intervalId = null;
        return `Clock Stopped`;
    }

    getTime()
    {
        return Clock.formatTime(this.hours, this.minutes, this.seconds);
    }
}

class AlarmClock extends Clock
{

    #alarmTime;
    constructor(currentTime, alarmTime)
    {
        super(currentTime);
        this.#alarmTime = alarmTime;
    }

    #checkAlarm()
    {
        return this.getTime() == this.#alarmTime;
    }

    startAlarm()
    {
        this.start();
        let alarmIntervalId = setInterval(()=>{
            if(this.#checkAlarm())
            {
                this.stop();
                clearInterval(alarmIntervalId);
                console.log(`Alarm! Wake Up!`);
            }
        }, 500);
    }
}
let clock = new AlarmClock(`12:02:14`, `12:02:20`);
let paragraphClock = document.createElement("p");
paragraphClock.style.fontSize = `40px`;
document.querySelector("body").append(paragraphClock);
clock.startAlarm();
setInterval(function(){
    paragraphClock.innerText = clock.getTime();
}, 1000)
