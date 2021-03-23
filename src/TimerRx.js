import React, { useState, useEffect } from "react";

import { Button } from "@material-ui/core";
import TimerIcon from "@material-ui/icons/Timer";
import { timer } from "rxjs";
import { map } from "rxjs/operators";

/*
TimerRx - there is used rxjs hook to manage subscription for stopwatch count;
  myTimer - actual stopwatch values in HH:MM:SS;
  started - boolean value to manage start/stop logic;
  @getTimeFormatted - return hours,minutes,seconds -> add or removes 0 in front of them inside JSX element;
  click = help value to manage doubleClick event;
  time - actul countdown;
  @useEffect(() => , [started]) - keeps an eye on whether timer is stoped or not;
   @useEffect(() => , [clicked]) - keeps an eye on time limits on doubleClick event triggered by 'Wait' Button component ;
*/

const getTimeFormatted = (time) => {
  let h = Math.floor(time / 3600);
  let m = Math.floor((time - h * 3600) / 60);
  let s = time - h * 3600 - m * 60;

  return {
    h,
    m,
    s,
  };
};

const TimerRx = () => {
  const [time, setTime] = useState(0);
  const [started, setStarted] = useState(false);
  const [myTimer, setMyTimer] = useState(getTimeFormatted(0));
  const [clicked, setClicked] = useState(0);

  useEffect(() => {
    setMyTimer(getTimeFormatted(time));
  }, [time]);

  /* Fires on subscription to setTime (actual countdowm logic) */
  useEffect(() => {
    if (started) {
      let subscription = timer(0, 1000)
        .pipe(map((s) => s + time))
        .subscribe(setTime);

      return () => subscription.unsubscribe();
    }
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
  const handleDoubleClick = () => {
    setClicked(clicked + 1);
    if (clicked % 2 === 0) {
      setStarted(false);
    }
  };

  /* Simply resets actual count value from time variable */
  const stopTimer = () => {
    setStarted(false);
    setTime(0);
  };

  /* Returns promise which  stops ->  resets -> starts counting */
  const resetTimer = () => {
    return new Promise((resolve, reject) => {
      setStarted(false);
      setTime(0);
      resolve();
    }).then(() => setStarted(true));
  };

  return (
    <div className="timer">
          <h1>Stopwatch with RxJS</h1>
      <TimerIcon className="timer__icon" />
      <div className="timer__stopwatch">
        <div className="timer__stopwatch--value">
          <span>{myTimer.h >= 10 ? myTimer.h : `0${myTimer.h}`}&#58;</span>
          <span>{myTimer.m >= 10 ? myTimer.m : `0${myTimer.m}`}&#58;</span>
          <span>{myTimer.s >= 10 ? myTimer.s : `0${myTimer.s}`}</span>
        </div>
      </div>
      <div className="timer__btns">
        {started ? (
          <>
            <Button
              className="stopwatch__btn"
              variant="outlined"
              onClick={stopTimer}>
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
              onClick={handleDoubleClick}>
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

export default TimerRx;
