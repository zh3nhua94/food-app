import { ActionTypes, CartType } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_STATE = {
	products: [],
	totalItems: 0,
	totalPrice: 0,
};

//order of (set, get) is important
export const useCartStore = create(
	persist<CartType & ActionTypes>(
		(set, get) => ({
			products: INITIAL_STATE.products,
			totalItems: INITIAL_STATE.totalItems,
			totalPrice: INITIAL_STATE.totalPrice,
			addToCart(item) {
				const products = get().products;
				//check if already item already exist in cart before, match product ID
				const productInState = item.optionTitle
					? products.find((product) => product.id === item.id && product.optionTitle === item.optionTitle)
					: products.find((product) => product.id === item.id);
				//if product really exist before
				if (productInState) {
					const updateProducts = products.map((product) => {
						if (item.optionTitle) {
							return product.id === productInState.id && product.optionTitle === item.optionTitle
								? {
										...product,
										quantity: item.quantity + product.quantity,
										price: item.price + product.price,
								  }
								: product;
						} else {
							return product.id === productInState.id
								? {
										...product,
										quantity: item.quantity + product.quantity,
										price: item.price + product.price,
								  }
								: product;
						}
					});
					set((state) => ({
						products: updateProducts,
						totalItems: state.totalItems + item.quantity,
						totalPrice: state.totalPrice + item.price,
					}));
				} else {
					set((state) => ({
						products: [...state.products, item], //push new item inside
						totalItems: state.totalItems + item.quantity, //add new quantity onto previous quantity
						totalPrice: state.totalPrice + item.price, //add new price onto total price
					}));
				}
			},
			removeFromCart(item) {
				console.log(item.optionTitle);
				set((state) => ({
					//keep all products except selected item by filtering off its Id
					products: item.optionTitle
						? state.products.filter((product) => {
								//return only item that is not item id, or item id same but with different options
								return product.id !== item.id || (product.id === item.id && product.optionTitle !== item.optionTitle);
						  })
						: state.products.filter((product) => {
								return product.id !== item.id;
						  }),
					totalItems: state.totalItems - item.quantity,
					totalPrice: state.totalPrice - item.price,
				}));
			},
		}),
		{ name: "cart", skipHydration: true }
	)
);
