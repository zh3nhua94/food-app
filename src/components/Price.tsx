"use client";
import { ProductType } from "@/types/types";
import { useCartStore } from "@/utils/store";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Price = ({ product }: { product: ProductType }) => {
	const [total, setTotal] = useState(product.price);
	const [quantity, setQuantity] = useState(1);
	const [selected, setSelected] = useState(0);

	const { addToCart } = useCartStore();

	useEffect(() => {
		// hydrate persisted store after on mount
		useCartStore.persist.rehydrate();
	}, []);

	useEffect(() => {
		if (product.options?.length) {
			setTotal(quantity * (Number(product.price) + Number(product.options[selected].additionalPrice)));
		} else {
			setTotal(quantity * product.price);
		}
	}, [quantity, selected, product]);

	const handleCart = () => {
		addToCart({
			id: product.id,
			title: product.title,
			img: product.img,
			price: total,
			quantity: quantity,
			...(product.options?.length && {
				optionTitle: product.options[selected].title,
			}),
		});
		toast.success("The item is added to the cart!");
	};

	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-2xl font-bold">${Number(total).toFixed(2)}</h2>
			{/* OPTIONS CONTAINER */}
			<div className="flex gap-4">
				{product.options?.length &&
					product.options?.map((option, index) => (
						<button
							key={option.title}
							className="p-2 ring-1 ring-red-600 rounded-md min-w-[6rem]"
							style={{
								background: selected === index ? "rgb(220 38 38)" : "white",
								color: selected === index ? "white" : "rgb(220 38 38)",
							}}
							onClick={() => setSelected(index)}
						>
							{option.title}
						</button>
					))}
			</div>
			{/* QUANTITY & ADD BUTTON CONTAINER */}
			<div className="flex justify-between items-center">
				{/* QUANTITY */}
				<div className="flex justify-between w-full ring-1 ring-red-700 p-3">
					<span>Quantity</span>
					<div className="flex gap-4 items-center">
						<button onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}>{"<"}</button>
						<span>{quantity}</span>
						<button onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}>{">"}</button>
					</div>
				</div>
				{/* CART BUTTON */}
				<button
					className="w-56 uppercase bg-red-700 text-white p-3 ring-1 ring-red-700"
					onClick={handleCart}
				>
					Add to Cart
				</button>
			</div>
		</div>
	);
};

export default Price;
