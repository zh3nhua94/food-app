import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const POST = async (req: NextRequest, { params }: { params: { orderId: string } }) => {
	const { orderId } = params;
	const order = await prisma.order.findUnique({
		where: {
			id: orderId,
		},
	});

	//if order exist
	if (order) {
		const price = (Number(order.price) * 100).toFixed(2);

		// Create a PaymentIntent with the order amount and currency
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Number(price), //amount by default in cents
			currency: "sgd",
			automatic_payment_methods: {
				enabled: true,
			},
		});

		await prisma.order.update({
			where: {
				id: orderId,
			},
			data: { intent_id: paymentIntent.id },
		});

		return new NextResponse(JSON.stringify({ clientSecret: paymentIntent.client_secret }), { status: 200 });
	} else {
		return new NextResponse(JSON.stringify({ message: "Order not found!" }), { status: 404 });
	}
};
