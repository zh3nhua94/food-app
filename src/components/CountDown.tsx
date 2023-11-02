"use client";
import React from "react";
import Countdown from "react-countdown";

// Ending date
const endingDate = new Date("2023-10-25");
//or Using Now(), then add duration, only if this is a forever event
const inifiniteTime = Date.now() + 108000000; //add 30 hours = 108000s

const CountDown = () => {
	return (
		<Countdown
			className="font-bold text-5xl text-amber-400"
			date={inifiniteTime}
		/>
	);
};

export default CountDown;
