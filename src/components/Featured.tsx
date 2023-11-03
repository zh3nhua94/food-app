"use client";
import Image from "next/image";
import React from "react";
// import { featuredProducts } from "@/data";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { ProductType } from "@/types/types";
import Link from "next/link";

const Featured = ({ featuredProducts }: { featuredProducts: ProductType[] }) => {
	// SLICK SLIDER SETTINGS
	const settings = {
		// arrows: false,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		swipeToSlide: true,
		// centerMode: true,
		autoplay: true,
		autoplaySpeed: 3000,
		responsive: [
			{
				breakpoint: 1279,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: true,
					autoplaySpeed: 4000,
				},
			},
		],
	};
	return (
		<div className=" text-red-700">
			{/* WRAPPER */}
			<Slider {...settings}>
				{/* SINGLE ITEM */}
				{featuredProducts?.map((item) => (
					<div
						key={item.id}
						className="w-screen !h-[60vh] min-h-[500px] !flex flex-col items-center justify-around p-4 hover:bg-orange-50 transition-all duration-300 md:w-[50vw] xl:w-[33vw] xl:!h-[90vh]"
					>
						{/* IMAGE CONTAINER */}
						{item.img && (
							<Link
								className="relative flex-1 w-full hover:rotate-[60deg] transition-all duration-500 mb-3"
								href={`/product/${item.id}`}
							>
								<Image
									className="object-contain pointer-events-none"
									src={item.img}
									alt=""
									fill={true}
									sizes="100%"
									draggable="false"
									priority={true}
								/>
							</Link>
						)}
						{/* TEXT CONTAINER */}
						<div className="flex-1 flex flex-col gap-4 items-center text-center justify-center ">
							<h1 className="text-xl font-bold uppercase xl:text-2xl 2xl:text-3xl">{item.title}</h1>
							<p className="p-4 2xl:p-8">{item.desc}</p>
							<span className="text-xl font-bold">${item.price}</span>
							<Link
								href={`/product/${item.id}`}
								className="bg-red-700 text-white p-2 rounded-md"
							>
								Add to Cart
							</Link>
						</div>
					</div>
				))}
			</Slider>
		</div>
	);
};

export default Featured;
