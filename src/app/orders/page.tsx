"use client";
import { OrderType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const OrdersPage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [status, router]);

	const { isPending, error, data, refetch } = useQuery({
		queryKey: ["repoData"],
		queryFn: () =>
			fetch(process.env.NEXT_PUBLIC_API_URL + "/api/orders", {
				cache: "no-store",
			}).then((res) => res.json()),
	});

	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: string }) => {
			return fetch(process.env.NEXT_PUBLIC_API_URL + `/api/orders/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(status),
				cache: "no-store",
			});
		},
		onSuccess: () => {
			refetch();
			// return queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
	});

	const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
		e.preventDefault();
		const form = e.target as HTMLFormElement;
		const input = form.elements[0] as HTMLInputElement;
		const status = input.value;
		mutation.mutate({ id, status });
		toast.success("The order status has been updated.");
		form.reset();
	};

	const sortByDate = (a: OrderType, b: OrderType) => {
		const aTime = new Date(a.createdAt).getTime();
		const bTime = new Date(b.createdAt).getTime();
		return aTime - bTime;
	};

	// if (isPending || status === "loading") return "Loading...";
	console.log(data);

	return (
		<div className="p-4 min-h-[calc(100vh-9rem)] md:min-h-[calc(100vh-15rem)] lg:px-20 xl:px-40">
			{!isPending && status === "authenticated" && (
				<table className="w-full border-separate border-spacing-3">
					<thead>
						<tr className="text-left">
							<th className="hidden md:table-cell">Order ID</th>
							<th>Date</th>
							<th>Price</th>
							<th className="hidden md:table-cell">Items</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{!data.length && (
							<tr className={`text-sm md:text-base bg-orange-50`}>
								<td
									className="py-6 px-1"
									colSpan={5}
								>
									No Orders made yet.
								</td>
							</tr>
						)}
						{data.sort(sortByDate).map((item: OrderType) => (
							<tr
								className={`text-sm md:text-base ${item.status == "delivered" ? "bg-green-50" : "bg-orange-50"}`}
								key={item.id}
							>
								<td className="hidden md:table-cell py-6 px-1">{item.id}</td>
								<td className="py-6 px-1">{item.createdAt.toString().slice(0, 10)}</td>
								<td className="py-6 px-1">{Number(item.price).toFixed(2)}</td>
								<td className="hidden md:table-cell">
									{item.products.map((name) => (
										<p key={name.title}>
											{name.title}
											{name.optionTitle ? " - " + name.optionTitle : ""}
										</p>
									))}
								</td>
								{session?.user.isAdmin ? (
									<td>
										<form
											className="flex justify-center gap-4 items-center"
											onSubmit={(e) => handleUpdate(e, item.id)}
										>
											<input
												type="text"
												placeholder={item.status}
												required
												className="p-2 ring-1 ring-red-300 rounded-md"
											/>
											<button className="bg-red-600 p-2 rounded-full">
												<Image
													src="/edit.png"
													alt=""
													width={20}
													height={20}
												/>
											</button>
										</form>
									</td>
								) : (
									<td className="py-6 px-1">{item.status}</td>
								)}
							</tr>
						))}
					</tbody>
				</table>
			)}
			{/* {!data.length && <p className="p-3">No Orders made yet.</p>} */}
			{/* Loading Spinner */}
			{isPending && status === "loading" && (
				<div
					role="status"
					className="p-4 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] flex justify-center items-center"
				>
					<svg
						aria-hidden="true"
						className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-300 fill-red-700"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
					<span className="sr-only">Loading...</span>
				</div>
			)}
		</div>
	);
};

export default OrdersPage;
