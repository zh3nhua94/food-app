// import { menu } from "@/data"; //dummy data
import { MenuType } from "@/types/types";
import Link from "next/link";
import React from "react";

const MenuPage = async () => {
	const getData = async () => {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/categories");

		if (!res.ok) {
			throw new Error("Failed to retrieve categories");
		}
		if (res.headers.get("Content-Type") === "text/html") {
			console.log(res.headers.get("Content-Type"));
			return;
		}
		const result = await res.json();
		return result;
	};
	const menu: MenuType = await getData();

	return (
		<div className="p-4 lg:px-10 xl:px-40 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] flex flex-col lg:flex-row items-center">
			{menu
				.sort((a, b) => a.order - b.order)
				.map((category) => (
					<Link
						href={`/menu/${category.slug}`}
						key={category.id}
						style={{ backgroundImage: `url(${category.img})` }}
						className="w-full h-1/3 flex-1 bg-cover p-4 sm:p-8 lg:h-1/2"
					>
						<div className={`text-${category.color} w-1/2`}>
							<h1 className="uppercase font-bold text-xl sm:text-3xl">{category.title}</h1>
							<p className="text-sm my-4 sm:my-8 ">{category.desc}</p>
							<button
								className={`hidden 2xl:block bg-${category.color} text-${
									category.color === "black" ? "white" : "black"
								} py-2 px-4 rounded-md`}
							>
								Explore
							</button>
						</div>
					</Link>
				))}
		</div>
	);
};

export default MenuPage;
