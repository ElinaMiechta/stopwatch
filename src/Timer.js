import React, { useState, useEffect } from "react";

import { Button } from "@material-ui/core";
import TimerIcon from "@material-ui/icons/Timer";

/*
Timer - there state of the stopwatch is handled by useState && useEffect;
  timer - actual stopwatch values in HH:MM:SS;
  started - boolean value to manage start/stop logic;
  state - help value to manage start/stop/pause logic;
  click = help value to manage doubleClick event;
  myInterval - works to fire on count;
  @useEffect(() => , [started]) - keeps an eye on whether timer is stoped or not;
  @useEffect(() => , [state]) - manages 3 states of Stopwatch:
   state:1 - run timer
   state:2  - stop timer
   state:3 - set started to true;
   @useEffect(() => , [clicked]) - keeps an eye on time limits on doubleClick event triggered by 'Wait' Button component ;
*/

const Timer = () => {
  const [started, setStarted] = useState(false);
  const [myInterval, setMyInterval] = useState();
  const [state, setState] = useState(0);
  const [clicked, setClicked] = useState(0);
  const [timer, setTimer] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  /* Fires on runTimer() function every second if the Start btn has been clicked */
  useEffect(() => {
    if (started) {
      setMyInterval(setInterval(runTimer, 1000));
    } else {
      clearInterval(myInterval);
    }
    return () => clearInterval(myInterval);
  }, [started]);

  /* This resets the clicked value if there wasn`t x2 clicks on btn within 300ms */
  useEffect(() => {
    let timeout = setTimeout(() => {
      setClicked(1);
    }, 299);
    return () => {
      clearTimeout(timeout);
    };
  }, [clicked]);

  /* This hook handles doubleClick event. If click`count is 2 (in other words is even) -> pause the stopwatch */
  const handleClick = () => { 
    setClicked(clicked + 1);
    if (clicked % 2 === 0) {
      setState(2);
    }
  };

  /* Monitores state changes and manages started values */
  useEffect(() => {
    if (state === 3) {
      setStarted(true);
    } else if (state === 2) {
      setStarted(false);
    }
  }, [state]);

  /* Stops timer and make it count again by setting state to 3 => setStarted(true) */
  const resetTimer = () => {
    stopTimer();
    setState(3);
  };

  /* Stops timer and resets its values to 00:00:00 */
  const stopTimer = () => {
    setState(2);
    setStarted(false);
    clearInterval(myInterval);
    setTimer({
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  };

  let h = timer.hours,
    m = timer.minutes,
    s = timer.seconds;

  /* Handles changes of timer values => HH:MM:SS */
  const runTimer = () => {
    setState(1);
    if (m === 60) {
      h++;
      m = 0;
    }
    if (s === 60) {
      m++;
      s = 0;
    }
    s++;
    return setTimer({
      hours: h,
      minutes: m,
      seconds: s,
    });
  };

  return (
    <div className="timer">
      <h1>Stopwatch with hooks</h1>
      <TimerIcon className="timer__icon" />
      <div className="timer__stopwatch">
        <div className="timer__stopwatch--value">
          <span>
            {timer.hours >= 10 ? timer.hours : `0 ${timer.hours}`}&#58;
          </span>
          <span>
            {timer.minutes >= 10 ? timer.minutes : `0 ${timer.minutes}`}&#58;
          </span>
          <span>
            {timer.seconds >= 10 ? timer.seconds : `0 ${timer.seconds}`}
          </span>
        </div>
      </div>
      <div className="timer__btns">
        {started ? (
          <>
            <Button
              className="stopwatch__btn"
              variant="outlined"
              onClick={() => stopTimer()}>
              Stop
            </Button>
            <Button
              className="stopwatch__btn"
              variant="outlined"
              onClick={resetTimer}>
              Reset
            </Button>
            <Button
              className="stopwatch__btn"
              variant="outlined"
              onClick={handleClick}>
              Wait
            </Button>
          </>
        ) : (
          <Button
            variant="outlined"
            onClick={() => setStarted(true)}
            className="stopwatch__btn">
            Start
          </Button>
        )}
      </div>
    </div>
  );
};

export default Timer;
