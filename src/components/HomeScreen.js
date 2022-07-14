import React, { useState, useEffect } from "react";
import ResetSection from "./ResetSection";
import InstructionSection from "./InstructionSection";

const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

//generating random index from the length of the alphabets
const randomIndex = () => {
  return Math.floor(Math.random() * (25 - 0 + 1) + 0);
};

//function to generate a random array
const displayArr = () => {
  const arr = [];
  for (let i = 0; i < 20; i++) {
    arr[i] = str.charAt(randomIndex());
  }
  return arr;
};

//the array that is going to be displayed
let toTypedArr = displayArr();
let questionCount = 0;

//function to avoid the tenth and ones place and adding additonal Zeros to it
const deciCheck = (num) => {
  if (num < 10) {
    return "00" + num;
  } else if (num < 100) {
    return "0" + num;
  } else {
    return num;
  }
};

//getting the data from the local storage
const localDataMilli = localStorage.getItem("milli");
const localDataSecond = localStorage.getItem("second");

//the main component that is rendering on the screen
const HomeScreen = () => {
  const [deci, setDeci] = useState();
  const [second, setsecond] = useState(0);
  const [index, setIndex] = useState(0);
  const [highScore, setHighScore] = useState(
    localDataSecond ? `${localDataSecond}.${localDataMilli}` : "0.000"
  );
  const [questionFlag, setQuestionFlag] = useState(false);
  const [initialDec, setIntialDec] = useState("000");
  const [successClass, setSuccessClass] = useState();
  const timerRef = React.createRef();

  //starting the timer as soon someone enter a keypress
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setDeci((prev) => prev + 1);
    }, 1);
  };

  //checking the keypress
  const checkKey = (e) => {
    const text = e.key;
    if (index === 0) {
      setDeci(0);
      startTimer();
    }
    if (text.toUpperCase() === toTypedArr[index]) {
      setIndex((prev) => prev + 1);
      questionCount++;
      if (questionCount === 20) {
        setQuestionFlag(true);
      }
    } else {
      setDeci((prev) => prev + 500);
    }
  };

  //function to increase the timer every second
  const incrementSecond = () => {
    setsecond((prev) => prev + 1);
    setDeci(0);
  };

  //clearing the timer as soon as all alphabet are completed
  const clearTimer = () => {
    clearInterval(timerRef.current);
    setSuccessClass("success");
    setIntialDec(deciCheck(deci));
    setDeci();
    highScoreCounter(deci, second);
  };

  //checking the high score every time game is cleared
  //i.if something exist then comparing the current to previos data
  //a.first checking if the seconds consumed this time is less that that of the earlier one
  //b.if seconds are equal then milli second to be compared
  //ii.else just setting the data
  let min = 0;
  const highScoreCounter = (newMilli, newSeconds) => {
    if (localDataSecond) {
      if (Number(JSON.parse(localDataSecond)) >= Number(newSeconds)) {
        console.log(
          "1st if" +
            Number(JSON.parse(localDataSecond)) +
            "" +
            Number(newSeconds)
        );

        localStorage.setItem("milli", JSON.stringify(newMilli));
        localStorage.setItem("second", JSON.stringify(newSeconds));
      } else if (Number(JSON.parse(localDataSecond)) === Number(newSeconds)) {
        console.log(
          "2nd if" +
            Number(JSON.parse(localDataSecond)) +
            "" +
            Number(newSeconds)
        );
        if (Number(JSON.parse(localDataMilli)) > Number(newMilli)) {
          localStorage.setItem("milli", JSON.stringify(newMilli));
          localStorage.setItem("second", JSON.stringify(newSeconds));
        }
      }
    } else {
      // console.log("else");
      console.log(
        "else" + Number(JSON.parse(localDataSecond)) + "" + Number(newSeconds)
      );
      localStorage.setItem("milli", JSON.stringify(newMilli));
      localStorage.setItem("second", JSON.stringify(newSeconds));
    }
    const sec = localStorage.getItem("second");
    const ms = localStorage.getItem("milli");
    setHighScore(sec + "." + deciCheck(ms));
  };

  //reseting everything to start fresh
  const resetHandler = () => {
    setDeci();
    setsecond(0);
    setIndex(0);
    setQuestionFlag(false);
    setIntialDec("000");
    setSuccessClass("");
    questionCount = 0;
    toTypedArr = displayArr();
  };

  //adding the keypress eventlistenter and also handling the memory leakage by removing the eventlistner
  useEffect(() => {
    window.addEventListener("keypress", checkKey);
    return () => window.removeEventListener("keypress", checkKey);
  }, [index]);

  return (
    <div className="container">
      <InstructionSection />
      <div className={`display__alpha ${successClass}`}>
        <span className={successClass && "hideTxt"}>
          {toTypedArr[index] ? toTypedArr[index] : toTypedArr[0]}
        </span>
      </div>
      <div className="timer__section">
        <h4>
          Time: {deci >= 999 ? incrementSecond() : second}.
          {deci
            ? questionFlag
              ? clearTimer()
              : deci < 100
              ? deciCheck(deci)
              : deci
            : initialDec}
          s
        </h4>
        <p>
          my best time:
          {highScore}s
        </p>
      </div>
      <ResetSection
        toTypedArr={toTypedArr}
        questionCount={questionCount}
        resetHandler={resetHandler}
      />
    </div>
  );
};

export default HomeScreen;
