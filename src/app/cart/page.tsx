"use client";
import { useCartStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const CartPage = () => {
	const { products, totalItems, totalPrice, removeFromCart } = useCartStore();
	const { data: session } = useSession();
	const router = useRouter();

	useEffect(() => {
		// hydrate persisted store after on mount
		useCartStore.persist.rehydrate();
	}, []);

	const handleCheckout = async () => {
		if (!session) {
			toast("Please Login to Checkout.");
			router.push("/login");
		} else {
			console.log(process.env.NEXT_PUBLIC_API_URL);
			console.log(process.env.NEXT_PUBLIC_API_URL + `/api/orders`);
			try {
				const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/orders`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						price: totalPrice,
						products,
						status: "Not Paid",
						userEmail: session.user.email,
					}),
				});
				const data = await res.json();
				router.push(`/pay/${data.id}`);
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<div className="min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] flex flex-col text-red-700 relative justify-between lg:flex-row ">
			{/* PRODUCTS CONTAINER */}
			<div className="p-4 flex flex-col justify-center lg:w-2/3 2xl:w-1/2 lg:px-20 2xl:pl-40 2xl:pr-20">
				{/* SINGLE ITEM */}
				{products.map((item) => (
					<div
						className="flex justify-between mb-4"
						key={item.id}
					>
						{item.img && (
							<Image
								src={item.img}
								alt=""
								width={100}
								height={100}
								className=" pr-3 w-[25%] object-contain max-h-[100px]"
							/>
						)}
						<div className="px-3 w-[50%] xl:w-[60%]">
							<h1 className="uppercase text-sm md:text-xl font-bold">
								{item.title} <span className="lowercase">x</span>
								{item.quantity}
							</h1>
							<span className="">{item.optionTitle}</span>
						</div>
						<h2 className="font-bold w-[20%] xl:w-[10%]">${item.price.toFixed(2)}</h2>
						<span
							className="cursor-pointer ml-3 w-[5%]"
							onClick={() => removeFromCart(item)}
						>
							X
						</span>
					</div>
				))}
			</div>
			{/* PAYMENT CONTAINER */}
			<div className="p-4 bg-orange-50 sticky bottom-0 lg:w-1/3 2xl:w-1/2 lg:px-10 2xl:px-40">
				<div className="flex flex-col gap-4 justify-center lg:sticky lg:top-5 lg:min-h-[calc(100vh-17rem)] 2xl:text-xl 2xl:gap-6">
					<div className="flex justify-between">
						<span className="">Subtotal ({totalItems} items)</span>
						<span className="">${totalPrice.toFixed(2)}</span>
					</div>
					<div className="flex justify-between">
						<span className="">Service Cost</span>
						<span className="">$0.00</span>
					</div>
					<div className="flex justify-between">
						<span className="">Delivery Cost</span>
						<span className="text-green-600">FREE!</span>
					</div>
					<hr className="my-2" />

					<div className="flex justify-between">
						<span className="">TOTAL</span>
						<span className="">${totalPrice.toFixed(2)}</span>
					</div>
					<button
						className="bg-red-700 text-white p-3 rounded-md w-1/2 self-end"
						onClick={handleCheckout}
					>
						CHECKOUT
					</button>
				</div>
			</div>
		</div>
	);
};

export default CartPage;
