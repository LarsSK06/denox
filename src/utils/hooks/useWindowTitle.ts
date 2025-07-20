import { windowTitleRoot, windowTitleTemplate } from "../globals";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect } from "react";

type UseWindowTitleOptions = {
    title: string;
};

const useWindowTitle = ({ title }: UseWindowTitleOptions) => {
    useEffect(() => {
        const currentWindow = getCurrentWindow();

        currentWindow.setTitle(windowTitleTemplate.replaceAll("%t%", title));

        return () => {
            currentWindow.setTitle(windowTitleRoot);
        };
    }, [title]);
};

export default useWindowTitle;