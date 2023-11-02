import Link from "next/link";
import React from "react";
import Menu from "./Menu";
import Image from "next/image";
import CartIcon from "./CartIcon";
import UserLinks from "./UserLinks";

const Navbar = () => {
	const user = false;
	return (
		<div className="h-12 text-red-700 p-4 flex justify-between items-center border-b-2 border-b-red-700 uppercase md:h-24 xl:px-20">
			{/* LEFT LINKS */}
			<div className="hidden md:flex gap-4 flex-1 md:w-[40%] md:flex-none">
				<Link href="/">Home</Link>
				<Link href="/menu">Menu</Link>
				<Link href="/">Contact</Link>
			</div>
			{/* LOGO */}
			<div className="text-xl md:font-bold flex-1  md:w-[20%] md:flex-none md:text-center">
				<Link href="/">Gustoso</Link>
			</div>
			{/* MOBILE MENU */}
			<div className="md:hidden">
				<Menu />
			</div>
			{/* RIGHT LINKS */}
			<div className="hidden md:flex gap-4 items-center flex-1 justify-end md:w-[40%] md:flex-none">
				<div className="md:absolute top-3 r-2 xl:static flex items-center gap-2 cursor-pointer bg-orange-300 px-1 rounded-md">
					<Image
						src="/phone.png"
						alt=""
						width={20}
						height={20}
					/>
					<span>1300 882 525</span>
				</div>
				<UserLinks />
				<CartIcon />
			</div>
		</div>
	);
};

export default Navbar;
