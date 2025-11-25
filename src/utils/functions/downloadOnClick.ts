import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { fetch } from "@tauri-apps/plugin-http";

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

    const response = await fetch(targetUrl);
    const blob = await response.blob();
    const stream = blob.stream()

    await writeFile(path, stream);
};

export default downloadOnClick;