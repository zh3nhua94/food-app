import { NextRequest, NextResponse } from "next/server";

//UPLOAD to CLOUDINARY
export const POST = async (req: NextRequest) => {
	const data = await req.formData();

	const res = await fetch(`https://api.cloudinary.com/v1_1/zenwongdev/image/upload`, {
		method: "POST",
		body: data,
	}).then((r) => r.json());

	const imgUrl = res.secure_url;

	return NextResponse.json(JSON.stringify(imgUrl));
};
