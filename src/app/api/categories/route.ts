import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

//FETCH ALL PRODUCTS
export const GET = async () => {
	try {
		const categories = await prisma.category.findMany();

		// const response = new NextResponse(JSON.stringify(categories), { status: 200 });
		// response.headers.set("content-type", "application/json");
		// return response;

		return NextResponse.json(categories, { status: 200 });
	} catch (error) {
		console.log(error);
		return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
	}
};
