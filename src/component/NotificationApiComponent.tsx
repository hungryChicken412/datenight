"use client";

import NotificationAPI from "notificationapi-js-client-sdk";
import "notificationapi-js-client-sdk/dist/styles.css";
import { PopupPosition } from "notificationapi-js-client-sdk/lib/interfaces";
import { memo, useEffect } from "react";

const NotificationAPIComponent = memo((props: any) => {
	useEffect(() => {
		const notificationapi = new NotificationAPI({
			clientId: "3vs1ibkflgr7ga0eqn4r023k3t",
			userId: "vatsalshukla2001@gmail.com",
		});
		notificationapi.showInApp({
			root: "CONTAINER_DIV_ID",
			popupPosition: PopupPosition.BottomLeft,
		});
	}, [props.userId]);

	return <div id="CONTAINER_DIV_ID"></div>;
});

export default NotificationAPIComponent;
