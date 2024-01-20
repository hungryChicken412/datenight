import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(request) {
	// Do whatever you want
	return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

// To handle a POST request to /api
export async function POST(request) {
	// Do whatever you want

	const options = {
		method: "POST",
		headers: {
			Authorization:
				"key=AAAA6Dkm2fo:APA91bHB8YLZNGGRCl9N8nJhbkhGp4TzQ8r6GNOc3SdtiUXdhW1smx-JQ7JxDox3F2Qmmf1DDB4ZwkvBpcX5gDlZmRsnd3ZBp7M8OBjD_xQ7jwl2pO6cyitKq07_20_VdtpkfYgSqbY-",
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
		},
		body: JSON.stringify({
			notification: {
				title: "Notification title",
				body: "Notification body",
			},
			to: "cdJSXI5M6lDmkIqGy_oBJD:APA91bGiWvsRaqRUfX23nLYmLm2gL3tQv1fLe9qI-1Gk8IUoDie2pKwewjIIG64AjEXZrYMIPEpj0xibuvt5Yl2xAu2PtDP2uwzJnE0gGDJ3py5YNtByQXOiMMzZU0MhifsZucZjuOXl",
		}),
	};

	try {
		let response = await fetch(
			"https://fcm.googleapis.com/fcm/send",
			options
		);

		console.log(response);
		let data = await response.json();
	} catch (error) {
		console.log(error);
	}

	return NextResponse.json({ message: "Hello World" }, { status: 200 });
}
