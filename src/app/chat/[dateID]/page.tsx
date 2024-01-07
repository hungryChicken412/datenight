"use client";
import Head from "next/head";
import { HiMiniVideoCamera, HiShare } from "react-icons/hi2";
import { MdCallEnd, MdMenu } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { FcMusic } from "react-icons/fc";
import { HiMiniGif } from "react-icons/hi2";

import GifPicker from "gif-picker-react";

import { GrSettingsOption } from "react-icons/gr";
import { ImCross } from "react-icons/im";

import { FcFilmReel } from "react-icons/fc";
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2";

import db from "../../../../config";
import { useEffect, useRef, useState } from "react";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { ref, onValue, set, push } from "firebase/database";
import { off } from "firebase/database";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "react-notifications/lib/notifications.css";
import { ReactNotifications } from "react-notifications-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Draggable from "react-draggable";

import { usePathname } from "next/navigation";
export default function Home() {
	const [show, setShow] = useState(false);
	const [settings, setSettings] = useState(false);
	const [tenor, showtenor] = useState(false);

	const [messageIndex, setMessageIndex] = useState(0);
	const [username, setUsername] = useState("user");
	const [roomID, setRoomID] = useState("0");
	const [messages, setMessages] = useState([]);

	const messageBox = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	useEffect(() => {
		let id = pathname.split("/")[2];
		setRoomID(id);
		const dbRef = ref(db, id);

		const listener = onValue(
			dbRef,
			(snapshot) => {
				const data = snapshot.val();

				try {
					setMessages(Object.values(data));
					setMessageIndex(data.length - 1);
				} catch (error) {
					console.log(error);
				}
			},
			{
				onlyOnce: false,
			}
		);

		if (window.innerWidth < 900) {
			setShow(false);
		} else {
			setShow(true);
		}

		return () => {
			off(dbRef, "value", listener);
		};
	}, []);

	const sendMessage = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		let msg = (document.getElementById("inputMessage") as HTMLInputElement)
			.value;

		if (msg !== "") {
			const message = {
				user: username,
				message: msg,
				gif: false,
				gifURL: "",
			};

			push(ref(db, roomID + "/"), message);

			(
				document.getElementById("inputMessage") as HTMLInputElement
			).value = "";

			// scroll to bottom

			const messageBox = document.getElementById("messageBox");
			if (messageBox) {
				messageBox.scrollBy(0, 60000);
			}
		}
	};

	const deleteChat = () => {
		set(ref(db, roomID + "/"), {
			1: {
				message: "Start Talking",

				user: "Admin",
			},
		});
		toast.success("Chat Deleted");

		console.log("deleted");
	};
	const createNewDate = () => {
		let id = pathname.split("/")[2];
		console.log(id);
		push(ref(db), {
			1: {
				message: "Start Talking",

				user: "Admin",
			},
		});
	};

	const copyCode = () => {
		let id = pathname.split("/")[2];
		navigator.clipboard.writeText(window.location.href);
		toast.success("Room ID Copied");
	};

	const saveUsername = () => {
		let username = (document.getElementById("username") as HTMLInputElement)
			.value;

		setUsername(username);
		if (username !== "") {
			toast.success("Username Saved! Changed to " + username);
		}

		setSettings(false);
	};

	const showSettings = () => {
		setSettings(!settings);
	};
	const showMenu = () => {
		setShow(!show);
	};
	const showTenorBoard = () => {
		showtenor(!tenor);
	};

	const sendGif = (tenorImage: { url: any }) => {
		push(ref(db, roomID + "/"), {
			user: username,
			message: "",
			gif: true,
			gifURL: tenorImage.url,
		});
		showtenor(false);
	};

	return (
		<>
			<div className="Chatroom">
				<ToastContainer />
				<div className="dashboard">
					<div
						className="props dashboard__left"
						style={{
							display: show ? "flex" : "none",
						}}
					>
						<div
							className="props_container"
							style={{ justifyContent: "start" }}
						>
							<img
								src="https://assets-global.website-files.com/647798cf71ec2048ea89ab07/647817558bc1d570b250c81e_RPM-logo.svg"
								height={"40px"}
							/>
						</div>
						<div
							className="props_container"
							style={{ overflowY: "auto", overflowX: "hidden" }}
						>
							<div className="prop_header">Activity</div>
							<button className="prop">
								<div className="prop_logo">
									<FcMusic size={30} />
								</div>
								<div className="props_title">Music</div>
							</button>
							<button className="prop">
								<div className="prop_logo">
									<FcFilmReel size={30} />
								</div>
								<div className="props_title"> Movie</div>
							</button>
							<button className="prop">
								<div className="prop_logo">
									<FcMusic size={30} />
								</div>
								<div className="props_title">Music</div>
							</button>
							<button className="prop">
								<div className="prop_logo">
									<FcFilmReel size={30} />
								</div>
								<div className="props_title"> Movie</div>
							</button>{" "}
							<button className="prop">
								<div className="prop_logo">
									<FcMusic size={30} />
								</div>
								<div className="props_title">Music</div>
							</button>
							<button className="prop">
								<div className="prop_logo">
									<FcFilmReel size={30} />
								</div>
								<div className="props_title"> Movie</div>
							</button>{" "}
							<button className="prop">
								<div className="prop_logo">
									<FcMusic size={30} />
								</div>
								<div className="props_title">Music</div>
							</button>
							<button className="prop">
								<div className="prop_logo">
									<FcFilmReel size={30} />
								</div>
								<div className="props_title"> Movie</div>
							</button>{" "}
							<button className="prop">
								<div className="prop_logo">
									<FcFilmReel size={30} />
								</div>
								<div className="props_title"> Movie</div>
							</button>{" "}
							<button className="prop">
								<div className="prop_logo">
									<FcMusic size={30} />
								</div>
								<div className="props_title">Music</div>
							</button>
							<button className="prop">
								<div className="prop_logo">
									<FcFilmReel size={30} />
								</div>
								<div className="props_title"> Movie</div>
							</button>{" "}
							<button className="prop">
								<div className="prop_logo">
									<FcMusic size={30} />
								</div>
								<div className="props_title">Music</div>
							</button>
							<button className="prop">
								<div className="prop_logo">
									<FcFilmReel size={30} />
								</div>
								<div className="props_title"> Movie</div>
							</button>
						</div>
						<div
							style={{
								color: "white",

								justifyContent: "center",
								padding: 20,
							}}
							onClick={showMenu}
							className="mobileOnly"
						>
							<ImCross />
						</div>
					</div>

					<div className="chat dashboard__right">
						<div className="chat_controls">
							<div className="chat_controls__buttons">
								{/* <button onClick={showMenu}>
									{" "}
									<MdMenu size={28} />
								</button> */}
								<button style={{ color: "gray" }}>
									{" "}
									<Menu
										menuButton={
											<MenuButton>
												<span
													style={{
														color: "rgb(50 50 50)",
														fontWeight: "bolder",
													}}
												>
													<GrSettingsOption
														size={17}
													/>
												</span>
											</MenuButton>
										}
									>
										<MenuItem>Export Chat</MenuItem>
										<SubMenu label="Edit">
											<MenuItem onClick={showSettings}>
												Change Username
											</MenuItem>
											<MenuItem onClick={deleteChat}>
												Delete Chat
											</MenuItem>
										</SubMenu>
									</Menu>
								</button>

								<button>
									<Menu
										menuButton={
											<MenuButton>
												<span
													style={{
														color: "rgb(50 50 50)",
														fontWeight: "bolder",
													}}
												>
													<HiMiniVideoCamera
														size={17}
													/>{" "}
												</span>
											</MenuButton>
										}
									>
										<MenuItem>Voice Call</MenuItem>
										<MenuItem>Video Call</MenuItem>
									</Menu>
								</button>
							</div>
							<div className="chat_controls__buttons">
								<button className="" onClick={copyCode}>
									{" "}
									<div className="sharecode">
										{" "}
										<HiShare className="head" size={17} />
										<div className="code">{roomID}</div>
									</div>
								</button>
							</div>
						</div>
						<div className="chat_container" id="messageBox">
							{messages.map((message) => (
								<div
									key={(message as { time: string })?.time}
									className={
										"chat_message" +
										((message as { user: string })?.user ==
										username
											? " sending"
											: " recieving")
									}
								>
									<div className="chat_message__avatar">
										<img
											src="https://cdn.dribbble.com/userupload/10420633/file/original-d497671412342c0362ec38301b527257.png?resize=1905x1317"
											alt="logo"
											width={100}
											height={100}
										/>
									</div>

									<div
										className={
											"chat_message_content" +
											((message as { gif: string })?.gif
												? " gif"
												: "")
										}
									>
										<div className="chat_message_username">
											{
												(message as { user: string })
													?.user
											}
										</div>
										<div className="chat_message_text">
											{(message as { gif: boolean })
												.gif ? (
												<img
													src={
														(
															message as {
																gifURL: string;
															}
														).gifURL
													}
													style={{
														borderRadius: 20,
													}}
													alt="gif"
													width={200}
												/>
											) : (
												(message as { message: string })
													?.message
											)}
										</div>
									</div>
								</div>
							))}
						</div>

						<div
							className="giphy_picker"
							style={{
								display: tenor ? "flex" : "none",
							}}
						>
							<GifPicker
								height={"100%"}
								onGifClick={sendGif}
								tenorApiKey={
									"AIzaSyC5A-SqiaWxo58TTu-wYNqEbPBvKzqc6uM"
								}
							/>
							<div
								className="closingPanel"
								onClick={showTenorBoard}
							></div>
						</div>
						<form className="chat_input" onSubmit={sendMessage}>
							<input
								type="text"
								placeholder=" Type Message ..."
								className="chat_input__input"
								id="inputMessage"
							/>

							<button type="button" onClick={showTenorBoard}>
								<HiMiniGif size={28} />
							</button>

							<button type="submit">
								<HiMiniChatBubbleBottomCenterText size={28} />
							</button>
						</form>
					</div>
				</div>

				<div
					className="editor"
					style={{
						display: settings ? "flex" : "none",
					}}
				>
					<div className="editor__container">
						<input
							type="text"
							placeholder="Username"
							id="username"
						/>

						<button onClick={saveUsername}> Save </button>
					</div>
				</div>
			</div>
		</>
	);
}
