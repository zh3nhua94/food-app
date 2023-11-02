"use client";
import CheckoutForm from "@/components/CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useRef, useState } from "react";

// Make sure to call loadStripe outside of a component’s render to avoid recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const PayPage = ({ params }: { params: { id: string } }) => {
	const [clientSecret, setClientSecret] = useState("");
	const { id } = params;
	const initialized = useRef(false);

	useEffect(() => {
		const makeRequest = async () => {
			try {
				//to update intent id of the current order id
				const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/api/create-intent/${id}`, {
					method: "POST",
				});
				const data = await res.json();
				setClientSecret(data.clientSecret);
				console.log(data);
			} catch (error) {
				console.log(error);
			}
		};
		//only allow useEffect run once, prevent Stripe generating duplicate orders
		if (!initialized.current) {
			initialized.current = true;
			makeRequest();
		}
	}, [id]);

	const options: StripeElementsOptions = {
		clientSecret,
		appearance: {
			theme: "stripe",
		},
	};

	return (
		<div>
			{clientSecret && (
				<Elements
					options={options}
					stripe={stripePromise}
				>
					<CheckoutForm />
				</Elements>
			)}
		</div>
	);
};

export default PayPage;
