export type MenuType = {
	id: number;
	slug: string;
	title: string;
	desc?: string;
	img?: string;
	color: string;
	order: number;
}[];

export type ProductType = {
	id: string;
	title: string;
	desc?: string;
	img?: string;
	price: number;
	options?: { title: string; additionalPrice: number }[];
};

export type OrderType = {
	id: string;
	userEmail: string;
	price: number;
	products: CartItemType[];
	status: string;
	intent_id: string;
	createdAt: Date;
};

export type CartItemType = {
	id: string;
	title: string;
	img?: string;
	price: number;
	optionTitle?: string;
	quantity: number;
};

export type CartType = {
	products: CartItemType[];
	totalItems: number;
	totalPrice: number;
};

export type ActionTypes = {
	//void since we dont expect return a value, just use to return a function
	addToCart: (item: CartItemType) => void;
	removeFromCart: (item: CartItemType) => void;
};
