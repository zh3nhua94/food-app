import Featured from "@/components/Featured";
import Offer from "@/components/Offer";
import Slider from "@/components/Slider";

const getData = async () => {
	const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/products", {
		cache: "no-store",
	});

	// if (!res.ok) {
	// 	throw new Error("Failed to retrieve items");
	// }
	if (res.headers.get("Content-Type") !== "application/json") {
		return null;
	}
	console.log(res.headers.get("Content-type"));
	const result = await res.json();
	return result;
};

export default async function Home() {
	const featuredProducts = await getData();

	return (
		<main className="">
			<Slider />
			<Featured featuredProducts={featuredProducts} />
			<Offer />
		</main>
	);
}
