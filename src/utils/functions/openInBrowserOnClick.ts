import { openUrl } from "@tauri-apps/plugin-opener";

const openInBrowserOnClick = (url?: string) => (event: React.MouseEvent) => {
    event.preventDefault();

    const targetUrl = url ?? event.currentTarget.getAttribute("href");

    if (targetUrl) openUrl(targetUrl);
};

export default openInBrowserOnClick;