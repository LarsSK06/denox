import { notifications } from "@mantine/notifications";
import { IconCircleCheck, IconCircleX, IconLoader } from "@tabler/icons-react";
import { createElement } from "react";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";
import { t } from "i18next";

const downloadOnClick = (url?: string) => async (event: React.MouseEvent) => {
    event.preventDefault();

    const targetUrl = url ?? event.currentTarget.getAttribute("href");

    if (!targetUrl) return;

    const path = await save({
        filters: [{
            name: "PDF",
            extensions: ["pdf"]
        }]
    });

    if (!path) return;

    const notificationId = notifications.show({
        icon: createElement(IconLoader, { className: "animate-spin" }),
        message: `${t("other.Downloading")}...`,
        color: "transparent",
        autoClose: false
    });

    try {
        const response = await fetch(targetUrl, { headers: { "Accept": "application/pdf" } });
        const bytes = await response.bytes();
    
        await writeFile(path, bytes);

        notifications.update({
            id: notificationId,
            icon: createElement(IconCircleCheck),
            message: t("other.DownloadComplete"),
            color: "green"
        });
    }
    catch (error: any) {
        notifications.update({
            id: notificationId,
            icon: createElement(IconCircleX),
            title: t("other.DownloadFailed"),
            message: `${error.message || error}`,
            color: "red"
        });
    }

};

export default downloadOnClick;