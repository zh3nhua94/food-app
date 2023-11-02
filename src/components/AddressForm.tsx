import { AddressElement } from "@stripe/react-stripe-js";
import React from "react";

const AddressForm = () => {
	return (
		<form>
			<AddressElement
				options={{ mode: "shipping" }}
				onChange={(event) => {
					if (event.complete) {
						// Extract potentially complete address
						const address = event.value.address;
					}
				}}
			/>
		</form>
	);
};

export default AddressForm;
