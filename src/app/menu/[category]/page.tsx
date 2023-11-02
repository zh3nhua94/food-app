// import { pizzas } from "@/data";
import { ProductType } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React from "react";
type Props = {
	params: { category: string };
};
const CategoryPage = async ({ params }: Props) => {
	const getData = async (category: string) => {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/products?cat=${category}`, {
			cache: "no-store",
		});

		if (!res.ok) {
			throw new Error("Failed to retrieve item");
		}
		return res.json();
	};

	const products: ProductType[] = await getData(params.category);

	return (
		<div className="flex flex-wrap text-red-700">
			{products.map((item) => (
				<Link
					className="w-full h-[60vh] border border-red-700 sm:w-1/2 lg:w-1/3 p-4 flex flex-col justify-between group odd:bg-orange-50"
					href={`/product/${item.id}`}
					key={item.id}
				>
					{/* IMAGE CONTAINER */}
					{item.img && (
						<div className="relative h-[80%]">
							<Image
								className="object-contain"
								src={item.img}
								alt=""
								fill
							/>
						</div>
					)}
					{/* TEXT CONTAINER */}
					<div className="flex items-center justify-between font-bold">
						<h1 className="text-lg xl:text-xl 2xl:text-2xl uppercase p-2 w-[calc(100%-130px)]">{item.title}</h1>
						<div className="">
							<h2 className="group-hover:hidden text-xl">${Number(item.price).toFixed(2)}</h2>
							<button className="hidden group-hover:block uppercase bg-red-700 text-white p-2 rounded-md">
								Add to Cart
							</button>
						</div>
					</div>
				</Link>
			))}
		</div>
	);
};

export default CategoryPage;
