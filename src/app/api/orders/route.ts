import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

//FETCH ALL ORDERS
export const GET = async (req: NextRequest) => {
	const session = await getAuthSession();
	//If there is a user logged in
	if (session) {
		try {
			//if it Admin
			if (session.user.isAdmin) {
				const orders = await prisma.order.findMany();
				return new NextResponse(JSON.stringify(orders), { status: 200 });
			}
			//else regular user
			const orders = await prisma.order.findMany({
				where: {
					userEmail: session.user.email!,
				},
			});
			return new NextResponse(JSON.stringify(orders), { status: 200 });
		} catch (error) {
			console.log(error);
			return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
		}
	} else {
		return new NextResponse(JSON.stringify({ message: "You are not authenticated." }), { status: 401 });
	}
};

//CREATE ORDER
export const POST = async (req: NextRequest) => {
	const session = await getAuthSession();
	//If there is a user logged in
	if (session) {
		try {
			const body = await req.json();
			const orders = await prisma.order.create({
				data: body,
			});
			return new NextResponse(JSON.stringify(orders), { status: 201 });
		} catch (error) {
			console.log(error);
			return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
		}
	} else {
		return new NextResponse(JSON.stringify({ message: "You are not authenticated." }), { status: 401 });
	}
};
