"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const AddPage = () => {
	const { data: session, status } = useSession();
	const router = useRouter();

	const [file, setFile] = useState<File>();

	type Input = {
		title: string;
		desc: string;
		price: number;
		catSlug: string;
		isFeatured: boolean;
	};
	const [inputs, setInputs] = useState<Input>({
		title: "",
		desc: "",
		price: 0,
		catSlug: "",
		isFeatured: false,
	});

	type Option = {
		title: string;
		additionalPrice: number;
	};
	const [option, setOption] = useState<Option>({
		title: "",
		additionalPrice: 0,
	});
	const [options, setOptions] = useState<Option[]>([]);

	if (status !== "loading" && (status === "unauthenticated" || !session?.user.isAdmin)) {
		router.push("/");
	}
	const [featured, setFeatured] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setInputs((prev) => {
			return {
				...prev,
				[e.target.name]: e.target.value,
			};
		});
	};

	const handleChecked = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			setInputs((prev) => {
				return {
					...prev,
					[e.target.name]: true,
				};
			});
		} else {
			setInputs((prev) => {
				return {
					...prev,
					[e.target.name]: false,
				};
			});
		}
	};

	const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
		setOption((prev) => {
			return {
				...prev,
				[e.target.name]: e.target.value,
			};
		});
	};

	const changeOptions = () => {
		//check if option exist before
		const checkOptions = options.filter((opt) => {
			return option.title == opt.title;
		});
		// if option exist, dont set new option
		if (checkOptions.length) {
			toast("option already exist");
		} else {
			setOptions((prev) => [...prev, option]);
		}
	};

	const handleChangeImg = (e: React.ChangeEvent<HTMLInputElement>) => {
		const item = (e.target.files as FileList)[0];
		setFile(item);
	};

	const upload = async () => {
		if (file) {
			const dataImg = new FormData();
			dataImg.append("file", file!);
			dataImg.append("upload_preset", "gustoso");

			const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/upload`, {
				method: "POST",
				body: dataImg,
			});

			const resData = await res.json();
			const cloudURL = JSON.parse(resData);
			return cloudURL;
		} else {
			return null;
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const url = await upload();
			const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/products`, {
				method: "POST",
				body: JSON.stringify({
					...inputs,
					img: url,
					options,
				}),
			});
			const data = await res.json();
			router.push(`/product/${data.id}`);
			toast.success("The new product is added successfully!");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			{session?.user.isAdmin && (
				<div className="p-4 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] flex items-center justify-center text-red-700">
					<form
						className="flex flex-wrap gap-6 max-w-[800px] mx-auto"
						onSubmit={handleSubmit}
					>
						<h1 className="text-4xl mb-2 text-gray-300 font-bold">Add New Product</h1>
						<div className="w-full flex flex-col gap-2">
							<label className="text-sm">Image</label>
							<input
								type="file"
								className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
								onChange={handleChangeImg}
							/>
						</div>
						<div className="w-full flex flex-col gap-2">
							<label className="text-sm">Title</label>
							<input
								type="text"
								name="title"
								className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
								onChange={handleChange}
							/>
						</div>
						<div className="w-full flex flex-col gap-2">
							<label className="text-sm">Description</label>
							<textarea
								name="desc"
								className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
								onChange={handleChange}
							/>
						</div>
						<div className="w-full flex flex-col gap-2">
							<label className="text-sm">Price</label>
							<input
								type="number"
								name="price"
								className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
								onChange={handleChange}
							/>
						</div>
						<div className="w-full flex flex-col gap-2">
							<label className="text-sm">Category</label>
							<input
								type="text"
								name="catSlug"
								className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
								onChange={handleChange}
							/>
						</div>
						<div className="flex flex-col gap-2">
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									value="true"
									className="sr-only peer"
									name="isFeatured"
									onChange={handleChecked}
								/>
								<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
								<span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Featured in Homepage</span>
							</label>
						</div>
						<div className="w-full flex flex-col gap-2">
							<label className="text-sm">Options</label>
							<div>
								<input
									type="text"
									placeholder="Title"
									name="title"
									className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
									onChange={changeOption}
								/>
								<input
									type="number"
									placeholder="Addiotinal Price"
									name="additionalPrice"
									className="ring-1 ring-red-200 p-4 rounded-sm placeholder:text-red-200 outline-none"
									onChange={changeOption}
								/>
							</div>
							<div
								className="bg-red-500 p-4 text-white w-48 rounded-md relative h-14 flex items-center justify-center cursor-pointer"
								onClick={changeOptions}
							>
								Add Option
							</div>
						</div>
						<div className="flex flex-wrap gap-4 mt-2 w-full">
							{options.map((item) => (
								<div
									className="p-2  rounded-md cursor-pointer bg-gray-200 text-gray-400"
									key={item.title}
									onClick={() => setOptions(options.filter((opt) => opt.title !== item.title))}
								>
									<span>{item.title}</span>
									<span> ${item.additionalPrice}</span>
								</div>
							))}
						</div>
						<button
							type="submit"
							className="bg-red-500 p-4 text-white w-full rounded-md relative h-14 flex items-center justify-center"
						>
							Submit
						</button>
					</form>
				</div>
			)}

			{/* Loading Spinner */}
			{status === "loading" && (
				<div
					role="status"
					className="p-4 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] flex justify-center items-center"
				>
					<svg
						aria-hidden="true"
						className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-700"
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
		</>
	);
};

export default AddPage;
