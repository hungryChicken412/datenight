"use client";
import Head from "next/head";

export default function Home() {
	return (
		<>
			<div className="Login_container">
				<div className="Header">The Date Night!</div>
				<div className="login_form">
					<form>
						<input type="text" placeholder="Room ID" />
						<input type="text" placeholder="Username" />

						<input type="submit" value="Login" />
					</form>
				</div>
			</div>
		</>
	);
}
