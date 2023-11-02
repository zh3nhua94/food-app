"use client";
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React from "react";
import AddressForm from "./AddressForm";

const CheckoutForm = () => {
	const stripe = useStripe();
	const elements = useElements();

	const [email, setEmail] = React.useState("");
	const [message, setMessage] = React.useState<string | null>(null);
	const [isLoading, setIsLoading] = React.useState(false);

	React.useEffect(() => {
		if (!stripe) {
			return;
		}

		const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

		if (!clientSecret) {
			return;
		}

		stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
			switch (paymentIntent?.status) {
				case "succeeded":
					setMessage("Payment succeeded!");
					break;
				case "processing":
					setMessage("Your payment is processing.");
					break;
				case "requires_payment_method":
					setMessage("Your payment was not successful, please try again.");
					break;
				default:
					setMessage("Something went wrong.");
					break;
			}
		});
	}, [stripe]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!stripe || !elements) {
			// Stripe.js hasn't yet loaded.
			// Make sure to disable form submission until Stripe.js has loaded.
			return;
		}

		setIsLoading(true);

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				// Make sure to change this to your payment completion page
				return_url: process.env.NEXT_PUBLIC_API_URL + "/success",
			},
		});

		// This point will only be reached if there is an immediate error when
		// confirming the payment. Otherwise, your customer will be redirected to
		// your `return_url`. For some payment methods like iDEAL, your customer will
		// be redirected to an intermediate site first to authorize the payment, then
		// redirected to the `return_url`.
		if (error.type === "card_error" || error.type === "validation_error") {
			setMessage(error.message || "Something went wrong");
		} else {
			setMessage("An unexpected error occurred.");
		}

		setIsLoading(false);
	};

	return (
		<form
			id="payment-form"
			onSubmit={handleSubmit}
			className="p-4 min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] lg:px-20 xl:px-40 flex flex-col gap-8 max-w-[1000px] mx-auto"
		>
			<h2 className="font-bold">Payment</h2>
			<LinkAuthenticationElement id="link-authentication-element" />
			<PaymentElement
				id="payment-element"
				options={{ layout: "tabs" }}
			/>
			<h2 className="font-bold">Address</h2>
			<AddressForm />
			<button
				disabled={isLoading || !stripe || !elements}
				id="submit"
				className="bg-red-700 text-white p-4 rounded-md w-28"
			>
				<span id="button-text">
					{isLoading ? (
						<div
							className="spinner"
							id="spinner"
						></div>
					) : (
						"Pay now"
					)}
				</span>
			</button>
			{/* Show any error or success messages */}
			{message && <div id="payment-message">{message}</div>}
		</form>
	);
};

export default CheckoutForm;
