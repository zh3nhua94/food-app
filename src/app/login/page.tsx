"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const LoginPage = () => {
	const { status } = useSession();
	const router = useRouter(); //useRouter() must from "next/navigation"
	const redirect = useSearchParams().get("redirect");

	useEffect(() => {
		if (status === "authenticated") {
			router.push("/");
		}
	}, [status, router]);

	const handleLogin = () => {
		if (redirect === "checkout") {
			signIn("google", { callbackUrl: "/cart" });
		} else {
			signIn("google");
		}
	};

	return (
		<>
			{status === "unauthenticated" && (
				<div className="p-4 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] flex justify-center md:items-center">
					{/* BOX */}
					<div className=" shadow-2xl rounded-md flex flex-col md:flex-row md:h-[70vh] md:w-full lg:w-[70%] 2xl:w-1/2">
						{/* IMAGE CONTAINER */}
						<div className="relative h-1/3 w-full md:h-auto md:w-1/2 md:flex">
							<Image
								src="/login.jpg"
								alt=""
								fill
								className="object-cover"
							/>
						</div>
						{/* FORM CONTAINER */}
						<div className="p-10 flex flex-col gap-8 md:w-1/2">
							<h1 className="font-bold text-xl xl:text-3xl">Welcome</h1>
							<p>Log into your account or create a new one using social buttons</p>
							<button
								className="flex gap-4 p-4 ring-1 ring-orange-200 rounded-md hover:ring-2 hover:ring-orange-300 transition-all"
								onClick={handleLogin}
							>
								<Image
									src="/google.png"
									alt=""
									width={20}
									height={20}
									className="object-contain"
								/>
								<span>Sign in with Google</span>
							</button>
							<button className="flex gap-4 p-4 ring-1 ring-blue-200 rounded-md hover:ring-2 hover:ring-blue-300 transition-all">
								<Image
									src="/facebook.png"
									alt=""
									width={20}
									height={20}
									className="object-contain"
								/>
								<span>Sign in with Facebook</span>
							</button>
							<p className="text-sm">
								Have a problem?{" "}
								<Link
									className="underline"
									href="#"
								>
									Contact Us
								</Link>
							</p>
						</div>
					</div>
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

export default LoginPage;
