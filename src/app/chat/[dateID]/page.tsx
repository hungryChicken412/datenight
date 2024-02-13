"use client";
import Head from "next/head";
import {
	HiEllipsisVertical,
	HiMiniVideoCamera,
	HiShare,
} from "react-icons/hi2";
import axios from "axios";
import {
	MdCallEnd,
	MdCameraAlt,
	MdEmojiEmotions,
	MdFileDownload,
	MdFullscreen,
	MdMenu,
} from "react-icons/md";
import { MdDelete } from "react-icons/md";
import {
	FaBell,
	FaHeart,
	FaPhone,
	FaTruckLoading,
	FaVolumeMute,
} from "react-icons/fa";
import NotificationAPIComponent from "@/component/NotificationApiComponent";
import { FcMusic } from "react-icons/fc";
import { HiMiniGif } from "react-icons/hi2";
import "react-native-image-keyboard";

import GifPicker from "gif-picker-react";

import { GrSettingsOption } from "react-icons/gr";
import { ImCross } from "react-icons/im";

import { FcFilmReel } from "react-icons/fc";
import { HiMiniChatBubbleBottomCenterText } from "react-icons/hi2";

import db from "../../../../config";

import { getTokenFromFireBase } from "../../../../config";
import { use, useEffect, useRef, useState } from "react";
import "@szhsin/react-menu/dist/index.css";
import "@szhsin/react-menu/dist/transitions/slide.css";
import { ref, onValue, set, push } from "firebase/database";
import { off } from "firebase/database";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import "react-notifications/lib/notifications.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import Draggable from "react-draggable";
import { IoVolumeMuteSharp } from "react-icons/io5";
import { BsDownload, BsMicMuteFill } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

import { usePathname } from "next/navigation";

import { io } from "socket.io-client";

const servers = {
	iceServers: [
		{
			urls: [
				"stun:stun1.l.google.com:19302",
				"stun:stun2.l.google.com:19302",
			], // free stun server
		},
	],
	iceCandidatePoolSize: 10,
};

export default function Home() {
	//#region Chat Variables
	const [show, setShow] = useState(false);
	const [settings, setSettings] = useState(false);
	const [emoji, showEmoji] = useState(false);
	const [tenor, showtenor] = useState(false);
	const [messageIndex, setMessageIndex] = useState(0);
	const [username, setUsername] = useState("user");
	const [roomID, setRoomID] = useState("0");
	const [messages, setMessages] = useState([]);
	const [keyboardLoading, setKeyboardLoading] = useState(false);
	const [loadingPercent, setloadingPercent] = useState(0);

	const messageBox = useRef<HTMLDivElement>(null);
	const pathname = usePathname();

	//#endregion

	const sendNotifications = async () => {
		fetch(
			"https://api.notificationapi.com/3vs1ibkflgr7ga0eqn4r023k3t/sender",
			{
				method: "POST",
				headers: {
					authorization:
						"Basic M3ZzMWlia2ZsZ3I3Z2EwZXFuNHIwMjNrM3Q6MTNiajhyMGFhbnN0NzUzbjE0M201ZzhrZnBmdDdnbnFvZmt0b2QwZDYxM29rcmgwOGw5Zg==",
					"content-type": "application/json",
				},
				// body: '{\n    "notificationId": "order_tracking",\n    "user": {\n      "id": "vatsalshukla2001@gmail.com",\n      "email": "vatsalshukla2001@gmail.com",\n      "number": "+15005550006"\n    },\n    "mergeTags": {\n      "item": "Krabby Patty Burger",\n      "address": "124 Conch Street",\n      "orderId": "1234567890"\n    }\n  }',
				body: JSON.stringify({
					notificationId: "order_tracking",
					user: {
						id: "vatsalshukla2001@gmail.com",
						email: "vatsalshukla2001@gmail.com",
						number: "+15005550006",
					},
					mergeTags: {
						item: "Krabby Patty Burger",
						address: "124 Conch Street",
						orderId: "1234567890",
					},
				}),
			}
		);
	};

	//#region videochat
	const pc = new RTCPeerConnection(servers);
	const localStream = useRef<MediaStream | null>(null);
	const localVideo = useRef<HTMLVideoElement>(null);
	const remoteStream = useRef<MediaStream | null>(null);

	const [videoCalling, setVideoCalling] = useState(false);
	const [fullScreen, setFullScreen] = useState(false);

	const localPeerConnection = useRef<any>(null);
	const remotePeerConnection = useRef<any>(null);

	const videoCallNow = async () => {
		let socket = io("http://localhost:3000/api/socket");

		socket.on("connect", () => {
			console.log("connected");
		});

		setVideoCalling(true);
		sendCustomMessage("Started Video Call");
		// enable video and audio

		localStream.current = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		//#region calling setup
		/*		
		// Create local peer connection
		localPeerConnection.current = new RTCPeerConnection();
		// Add local stream to connection
		localStream.current?.getTracks().forEach((track) => {
			localPeerConnection.current.addTrack(track, localStream);
		});
		// Create offer
		localPeerConnection.current
			.createOffer()
			.then((offer: any) => {
				localPeerConnection.current.setLocalDescription(offer);

				// Send offer to signaling server
				signal("offer", offer);
			})
			.catch((error: any) => {
				console.error("Error creating offer:", error);
			});

		// Set up remote peer connection
		remotePeerConnection.current = new RTCPeerConnection();

		// Add remote stream to connection
		remotePeerConnection.current.ontrack = (event: any) => {
			remoteStream.current = event.streams[0];
			//remoteVideo.current.srcObject = remoteStream;
		};

		// Handle ice candidates for local peer connection
		localPeerConnection.current.onicecandidate = (event: any) => {
			if (event.candidate) {
				// Send ice candidate to signaling server
				signal("candidate", event.candidate);
			}
		};

		// Handle incoming ice candidates for remote peer connection
		fromSignal.on("ice-candidate", (candidate) => {
			remotePeerConnection.current.addIceCandidate(candidate);
		});
		// Handle incoming offer from remote peer
		fromSignal.on("offer", (offer) => {
			remotePeerConnection.current.setRemoteDescription(offer);

			// Create answer
			remotePeerConnection.current
				.createAnswer()
				.then((answer: any) => {
					remotePeerConnection.current.setLocalDescription(answer);

					// Send answer to signaling server
					signal("answer", answer);
				})
				.catch((error: any) => {
					console.error("Error creating answer:", error);
				});
		});
		// Handle incoming answer from remote peer
		fromSignal.on("answer", (answer: any) => {
			localPeerConnection.current.setRemoteDescription(answer);
		});
		
 */

		//#endregion

		// show my video to me
		localVideo.current!.srcObject = localStream.current;
		localVideo.current!.muted = true;
		localVideo.current!.play();

		console.log("video call");
		socket.emit("join", { roomID: roomID });
	};
	const endCall = () => {
		setVideoCalling(false);

		//turn off camera and mic
		localStream.current!.getTracks().forEach((track) => track.stop());
		localStream.current?.getAudioTracks()[0].stop();
		localStream.current = null;

		// remove video from screen
	};
	const toggleFullScreen = () => {
		setFullScreen(!fullScreen);
	};
	const signal = (type: string, data: any) => {};
	//#endregion

	//#region Chat Functions
	useEffect(() => {
		let id = pathname.split("/")[2];
		setRoomID(id);
		if (localStorage.getItem("username")) {
			const usernameFromLocalStorage = localStorage.getItem("username");
			setUsername(
				usernameFromLocalStorage !== null
					? usernameFromLocalStorage
					: "user"
			);
		} else {
			setUsername("user");
			localStorage.setItem("username", "user");
		}
		const dbRef = ref(db, id);

		const listener = onValue(
			dbRef,
			(snapshot) => {
				const data = snapshot.val();

				try {
					setMessages(Object.values(data));
					setMessageIndex(data.length - 1);
					const messageBox = document.getElementById("messageBox");

					if (messageBox) {
						messageBox.scrollBy(0, 60000);
					} else {
						console.log("no message box");
					}
					setTimeout(() => {
						messageBox?.scrollBy(0, 60000);
					}, 2);
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
			setShow(false);
		}

		return () => {
			off(dbRef, "value", listener);
		};
	}, []);

	const sendMessage = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		let msg = (document.getElementById("inputMessage") as HTMLInputElement)
			.value;
		showEmoji(false);
		showtenor(false);

		if (msg !== "") {
			let q = msg.split(".");

			if (["gif", "png", "jpeg", "webp"].includes(q[q.length - 1])) {
				const message = {
					user: username,
					message: "",
					gif: true,

					time: new Date().toLocaleTimeString(),
					infoMessage: false,
					gifURL: msg,
					file: false,
					emoji: false,
				};

				push(ref(db, roomID + "/"), message);
			} else {
				const message = {
					user: username,
					message: msg,
					gif: false,
					time: new Date().toLocaleTimeString(),
					gifURL: "",
					file: false,
					infoMessage: false,
					emoji: false,
				};

				push(ref(db, roomID + "/"), message);
			}

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
				gif: false,
				time: new Date().toLocaleTimeString(), // 11:18:48 AM,
				gifURL: "",
				infoMessage: false,
				file: false,
				emoji: false,
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

		if (username !== "") {
			toast.success("Username Saved! Changed to " + username);
			setUsername(username);
			localStorage.setItem("username", username);
			(document.getElementById("username") as HTMLInputElement).value =
				"";
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
	const showEmojiBoard = () => {
		showEmoji(!emoji);
	};
	const addToMessage = (emoji: { native: string }) => {
		showEmoji(false);
		push(ref(db, roomID + "/"), {
			user: username,
			message: emoji.native,
			gif: false,
			time: new Date().toLocaleTimeString(),
			gifURL: "",
			infoMessage: false,
			file: false,
			emoji: true,
		});
		const messageBox = document.getElementById("messageBox");
		if (messageBox) {
			messageBox.scrollBy(0, 60000);
		}
	};

	const sendGif = (tenorImage: { url: any }) => {
		push(ref(db, roomID + "/"), {
			user: username,
			message: "",
			gif: true,
			time: new Date().toLocaleTimeString(),
			gifURL: tenorImage.url,
			file: false,
			infoMessage: false,
			emoji: false,
		});
		showtenor(false);
		const messageBox = document.getElementById("messageBox");
		if (messageBox) {
			messageBox.scrollBy(0, 60000);
		}
	};
	const _onImageChange = (event: any) => {
		if (event.clipboardData.files.length == 0) return;

		if (
			event.clipboardData.files[0].type == "image/png" ||
			event.clipboardData.files[0].type == "image/jpeg" ||
			event.clipboardData.files[0].type == "image/webp" ||
			event.clipboardData.files[0].type == "image/gif"
		) {
			const location = "https://tmpfiles.org/api/v1/upload";

			const formData = new FormData();
			formData.append("file", event.clipboardData.files[0]);
			formData.append("filename", event.clipboardData.files[0].name);
			formData.append("expiration", "1h");
			formData.append("content_type", event.clipboardData.files[0].types);
			formData.append("privacy", "public");
			setKeyboardLoading(true);

			fetch(location, {
				method: "POST",
				body: formData,
			})
				.then((response) => response.json())
				.then((result) => {
					console.log("Success:", result);
					console.log(result.data.url);

					const imageURL =
						"https://tmpfiles.org/dl/" +
						result.data.url.split("https://tmpfiles.org/")[1];
					console.log(imageURL);
					sendGif({ url: imageURL });
					setKeyboardLoading(false);
				})
				.catch((error) => {
					console.error("Error:", error);
				});
		}
	};
	const onUploadProgress = (progressEvent: any) => {
		const percentCompleted = Math.round(
			(progressEvent.loaded * 100) / progressEvent.total
		);
		setloadingPercent(percentCompleted);
	};
	const sendFile = (event: any) => {
		if (event.target.files.length == 0) return;
		const location = "https://tmpfiles.org/api/v1/upload";

		const formData = new FormData();
		formData.append("file", event.target.files[0]);
		formData.append("filename", event.target.files[0].name);
		formData.append("expiration", "1h");
		formData.append("content_type", event.target.files[0].type);
		formData.append("privacy", "public");
		setKeyboardLoading(true);

		axios({
			method: "post",
			url: location,
			data: formData,
			onUploadProgress: onUploadProgress,
		})
			.then((response) => {
				console.log("Success:", response.data);
				console.log(response.data.data.url);

				const imageURL =
					"https://tmpfiles.org/dl/" +
					response.data.data.url.split("https://tmpfiles.org/")[1];
				console.log(imageURL);

				push(ref(db, roomID + "/"), {
					user: username,
					message: imageURL,
					gif: false,
					time: new Date().toLocaleTimeString(),
					gifURL: "",
					file: true,
					infoMessage: false,
					emoji: false,
				});

				setKeyboardLoading(false);
				toast.success("File Uploaded");
			})
			.catch((error) => {
				console.error("Error:", error);
				setKeyboardLoading(false);
				toast.error("Error Uploading File");
			});
	};
	const sendCustomMessage = (message: string) => {
		push(ref(db, roomID + "/"), {
			user: username,
			message: message,
			infoMessage: true,
			gif: false,
			time: new Date().toLocaleTimeString(),

			gifURL: "",
			file: false,
			emoji: false,
		});
		const messageBox = document.getElementById("messageBox");
		if (messageBox) {
			messageBox.scrollBy(0, 60000);
		}
	};

	//#endregion

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
								</button> */}{" "}
								<Menu
									menuButton={
										<MenuButton>
											<span
												style={{
													color: "rgb(50 50 50)",
													fontWeight: "bolder",
												}}
											>
												<GrSettingsOption size={17} />
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
								<Menu
									menuButton={
										<MenuButton>
											<span
												style={{
													color: "rgb(50 50 50)",
													fontWeight: "bolder",
												}}
											>
												<HiMiniVideoCamera size={17} />{" "}
											</span>
										</MenuButton>
									}
								>
									<MenuItem>Voice Call</MenuItem>
									<MenuItem onClick={videoCallNow}>
										Video Call
									</MenuItem>
								</Menu>
							</div>
							<div className="chat_controls__buttons">
								{/* {username != "user" && (
									<button>
										<div className="sharecode">
											<NotificationAPIComponent />
										</div>
									</button>
								)}
								<button className="">
									{" "}
									<div className="sharecode">
										{" "}
										<FaBell
											onClick={sendNotifications}
											className="head"
											size={17}
										/>
									</div>
								</button> */}
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
								<div key={(message as { time: string }).time}>
									{(message as { infoMessage: boolean })
										.infoMessage ? (
										<div className="infoMessage">
											<div className="mssg">
												{
													(
														message as {
															user: string;
														}
													).user
												}{" "}
												{
													(
														message as {
															message: string;
														}
													).message
												}
											</div>
										</div>
									) : (
										<div
											key={
												(message as { time: string })
													?.time
											}
											className={
												"chat_message" +
												((message as { user: string })
													?.user == username
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
													((
														message as {
															gif: string;
														}
													)?.gif ||
													(
														message as {
															emoji: string;
														}
													)?.emoji
														? " gif"
														: "")
												}
											>
												<div className="chat_message_username">
													{
														(
															message as {
																user: string;
															}
														)?.user
													}
												</div>
												<div className="chat_message_text">
													<>
														{(
															message as {
																emoji: boolean;
															}
														).emoji ? (
															<>
																<div className="emoji_pallet">
																	{
																		(
																			message as {
																				message: string;
																			}
																		)
																			?.message
																	}{" "}
																</div>
															</>
														) : (
															<>
																<>
																	{(
																		message as {
																			gif: boolean;
																		}
																	).gif ? (
																		<img
																			src={
																				(
																					message as {
																						gifURL: string;
																					}
																				)
																					.gifURL
																			}
																			style={{
																				borderRadius: 20,
																			}}
																			alt="gif"
																			width={
																				200
																			}
																		/>
																	) : (
																		<>
																			{(
																				message as {
																					file: boolean;
																				}
																			)
																				.file ? (
																				<>
																					<a
																						href={
																							(
																								message as {
																									message: string;
																								}
																							)
																								.message
																						}
																						className="linkfile"
																					>
																						<MdFileDownload />{" "}
																						{(
																							message as {
																								message: string;
																							}
																						).message
																							.split(
																								"/"
																							)
																							.pop()}
																					</a>
																				</>
																			) : (
																				(
																					message as {
																						message: string;
																					}
																				)
																					?.message
																			)}
																		</>
																	)}
																</>
															</>
														)}
													</>
												</div>
												<div className="chat_message_time">
													{
														(
															message as {
																time: string;
															}
														).time
													}
												</div>
											</div>
										</div>
									)}
								</div>
							))}
						</div>

						<div
							className="emoji_picker"
							style={{
								display: emoji ? "flex" : "none",
							}}
						>
							<Picker data={data} onEmojiSelect={addToMessage} />
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
							{keyboardLoading ? (
								<div className=" chat_input__input fileUploading">
									<AiOutlineLoading3Quarters />{" "}
									{loadingPercent}
								</div>
							) : (
								<div className="inputArea">
									<input
										type="text"
										placeholder=" Type Message ..."
										className="chat_input__input"
										autoComplete="off"
										id="inputMessage"
										onPaste={_onImageChange}
									/>
									<Menu
										menuButton={
											<MenuButton>
												<span>
													<HiEllipsisVertical
														size={17}
													/>
												</span>
											</MenuButton>
										}
									>
										<MenuItem>
											<label
												htmlFor="fileUploader"
												className="fileUploader"
											>
												Send File{" "}
											</label>
										</MenuItem>
									</Menu>
								</div>
							)}
							<input
								type="file"
								id="fileUploader"
								onChange={sendFile}
								hidden
							/>
							<button type="button" onClick={showEmojiBoard}>
								<MdEmojiEmotions size={28} />
							</button>

							<button type="button" onClick={showTenorBoard}>
								<HiMiniGif size={28} />
							</button>

							<button type="submit">
								<HiMiniChatBubbleBottomCenterText size={28} />
							</button>
						</form>
					</div>
				</div>

				{videoCalling && (
					<Draggable>
						<div
							className={
								"video_call_container" +
								(fullScreen ? " fullScreen" : " not ")
							}
						>
							<div className="video_call">
								<div className="video_call__header">
									<div className="video_call__header__left">
										<div className="video_call__header__left__avatar">
											<video
												className="video_call__header__left__avatar__video"
												loop
												ref={localVideo}
												autoPlay
											></video>
										</div>
									</div>
								</div>
								<div className="video_call__video">
									<video
										className="video_call__video__video"
										loop
									></video>
								</div>
								<div className="video_call__controls">
									<button
										style={{ color: "#f63030" }}
										onClick={endCall}
									>
										<MdCallEnd size={28} />
									</button>
									<button>
										<IoVolumeMuteSharp size={28} />
									</button>
									<button>
										<MdCameraAlt size={28} />
									</button>
									<button onClick={toggleFullScreen}>
										<MdFullscreen size={28} />
									</button>
									<button>
										<BsMicMuteFill size={28} />
									</button>
								</div>
							</div>
						</div>
					</Draggable>
				)}

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
