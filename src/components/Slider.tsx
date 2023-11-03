"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const data = [
	{
		id: 1,
		title: "Taste That Defines Happiness",
		image: "/slide4.jpg",
	},
	{
		id: 2,
		title: "Savor Every Bite, Every Time",
		image: "/slide5.jpg",
	},
	{
		id: 3,
		title: "Flavors as Bold as Your Dreams",
		image: "/slide6.jpg",
	},
	{
		id: 4,
		title: "always fresh & always crispy & always hot",
		image: "/slide1.png",
	},
	{
		id: 5,
		title: "Unleash Your Cravings Here",
		image: "/slide2.png",
	},
	{
		id: 6,
		title: "the best pizza to share with your family",
		image: "/slide3.jpg",
	},
];

const Slider = () => {
	const [currentSlide, setCurrentSlide] = useState(1);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prev) => (prev === data.length - 1 ? 0 : prev + 1));
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] lg:flex-row">
			{/* TEXT CONTAINER */}
			<div className="flex-1 flex items-center justify-center flex-col gap-8 text-red-700 font-bold bg-orange-50">
				<h1 className="text-2xl md:text-5xl text-center uppercase p-4 md:p-10 md:text-6xl xl:text-7xl">
					{data[currentSlide].title}
				</h1>
				<button className="bg-red-700 text-white py-4 px-8">Order Now</button>
			</div>
			{/* IMAGE CONTAINER */}
			<div className="flex-1 w-full relative">
				<img
					className="object-cover w-full h-full absolute"
					src={data[currentSlide].image}
					alt=""
				/>
				{/* <Image
					className="object-cover"
					src={data[currentSlide].image}
					alt=""
					fill
					sizes="100%"
					priority={true}
				/> */}
			</div>
		</div>
	);
};

export default Slider;
