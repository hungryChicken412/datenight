"use client";
import Head from "next/head";
import { HiMiniVideoCamera, HiShare } from "react-icons/hi2";
import { MdCallEnd, MdMenu } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
import { FcMenu, FcMusic } from "react-icons/fc";
import { GrDrag } from "react-icons/gr";
import { ImCross } from "react-icons/im";
import { initializeApp } from "firebase/app";

import { FcFilmReel } from "react-icons/fc";
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2";
import { IoIosMenu } from "react-icons/io";
import { IoMdArrowDown } from "react-icons/io";

import { FirebaseApp } from "firebase/app";

import db from "../../../../config";
import { useEffect, useRef, useState } from "react";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { off } from "firebase/database";
import { Router, useRouter } from "next/router";
import { usePathname } from "next/navigation";
export default function Home() {
	const [show, setShow] = useState(false);
	const pathname = usePathname();
	const [messageIndex, setMessageIndex] = useState(0);
	const [roomID, setRoomID] = useState("0");

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

		return () => {
			off(dbRef, "value", listener);
		};
	}, []);

	const [messages, setMessages] = useState([]);

	const messageBox = useRef(HTMLDivElement);
	useEffect(() => {
		if (window.innerWidth < 900) {
			setShow(false);
		} else {
			setShow(true);
		}
	}, []);

	const showMenu = () => {
		setShow(!show);
	};

	const sendMessage = () => {
		let msg = (document.getElementById("inputMessage") as HTMLInputElement)
			.value;

		if (msg !== "") {
			const message = {
				user: "Username",
				message: msg,
				sender: "self",
			};

			push(ref(db, roomID + "/"), message);
		}
	};

	const deleteChat = () => {
		set(ref(db, roomID + "/"), {
			1: {
				message: "Start Talking",
				sender: "recieving",
				user: "Admin",
			},
		});

		console.log("deleted");
	};
	const createNewDate = () => {
		let id = pathname.split("/")[2];
		console.log(id);
		push(ref(db), {
			1: {
				message: "Start Talking",
				sender: "recieving",
				user: "Admin",
			},
		});
	};

	const copyCode = () => {
		let id = pathname.split("/")[2];
		navigator.clipboard.writeText(window.location.href);
	};

	return (
		<>
			<div className="Chatroom">
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
								<button onClick={showMenu}>
									{" "}
									<MdMenu size={28} />
								</button>
								<button className="">
									{" "}
									<MdCallEnd size={17} />
								</button>
								<button>
									<HiMiniVideoCamera size={17} />
								</button>

								<button
									className=""
									style={{ color: "#ff7179" }}
								>
									{" "}
									<FaHeart size={17} />
								</button>
							</div>
							<div className="chat_controls__buttons">
								<button
									className=""
									style={{ color: " #rgb(205 17 28)" }}
									onClick={copyCode}
								>
									{" "}
									<div className="sharecode">
										{" "}
										<HiShare className="head" size={17} />
										<div className="code">{roomID}</div>
									</div>
								</button>
							</div>
							<div className="chat_controls__buttons">
								<button
									className=""
									onClick={deleteChat}
									style={{ color: " #rgb(205 17 28)" }}
								>
									{" "}
									<MdDelete size={17} />
								</button>
							</div>
						</div>
						<div className="chat_container">
							{messages.map((message) => (
								<div
									key={(message as { time: string })?.time}
									className={
										"chat_message" +
										((message as { sender: string })
											?.sender == "self"
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

									<div className="chat_message_content">
										<div className="chat_message_username">
											{
												(message as { user: string })
													?.user
											}
										</div>
										<div className="chat_message_text">
											{
												(message as { message: string })
													?.message
											}
										</div>
									</div>
								</div>
							))}
						</div>

						<div className="chat_input">
							<input
								type="text"
								placeholder=" Type Message ..."
								className="chat_input__input"
								id="inputMessage"
							/>

							<button onClick={sendMessage}>
								<HiMiniChatBubbleBottomCenterText />
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
