import Image from "next/image";
import React from "react";
import CountDown from "./CountDown";

const Offer = () => {
	return (
		<div className="bg-black h-screen flex flex-col lg:flex-row lg:justify-between bg-[url('/offerBg.png')] bg-right bg-cover lg:h-[75vh]">
			{/* TEXT CONTAINER */}
			<div className="flex-1 flex flex-col justify-center items-center text-center gap-8 p-6">
				<h1 className="text-white text-3xl font-bold md:text-5xl xl:text-6xl">
					Introducing
					<br />
					The Burger Supreme
				</h1>
				<p className="text-white xl:text-xl 2xl:text-2xl">
					It&#39;s not just a burger, it&#39;s an experience. Get ready to embark on a flavor-packed journey with every
					juicy bite. Our beef patty is perfectly seasoned and flame-grilled to perfection, ensuring a taste sensation
					that&#39;ll leave you craving more.
				</p>
				<CountDown />
				<button className="bg-red-700 text-white rounded-md py-3 px-6">Order Now</button>
			</div>
			{/* IMAGE CONTAINER */}
			<div className="relative flex-1 relative lg:h-full">
				<Image
					src="/offerProduct.png"
					alt=""
					fill
					className="object-contain"
					sizes="100%"
				/>
			</div>
		</div>
	);
};

export default Offer;
