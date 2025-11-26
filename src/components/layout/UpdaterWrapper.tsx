"use client";

import ParentProps from "@/types/common/ParentProps";

import { Anchor, Button, Text, Transition } from "@mantine/core";
import { relaunch } from "@tauri-apps/plugin-process";
import { check, Update } from "@tauri-apps/plugin-updater";
import { t } from "i18next";
import { useEffect, useState } from "react";

const UpdaterWrapper = ({ children }: ParentProps) => {
    const [status, setStatus] = useState<
        "checking-for-updates" |
        "prompting-about-update" |
        "use-normally" |
        "installing-update"
    >("checking-for-updates");

    const [contentLength, setContentLength] = useState<number | null>(null);
    const [downloaded, setDownloaded] = useState<number | null>(null);
    const [update, setUpdate] = useState<Update | null>(null)

    useEffect(() => {
        (async () => {
            const newUpdate = await check();

            setUpdate(newUpdate);

            setStatus(newUpdate ? "prompting-about-update" : "use-normally");
        })();
    }, []);

    useEffect(() => {
        if (status !== "installing-update") return;

        if (!update) {
            setStatus("use-normally");

            return;
        }

        (async () => {
            await update.downloadAndInstall(event => {
                switch (event.event) {
                    case "Started":
                        setContentLength(event.data.contentLength ?? null);

                        break;

                    case "Progress":
                        setDownloaded(prev => (prev ?? 0) + event.data.chunkLength);

                        break;

                    case "Finished":
                        relaunch();

                        break;
                }
            });
        })();
    }, [status]);

    return status === "use-normally" ? children : (
        <div className="w-full h-full flex justify-center items-center relative">
            <Transition mounted={status === "checking-for-updates"} transition="fade-up">
                {style => (
                    <div className="w-fit flex items-center flex-col absolute" style={style}>
                        <Text>
                            {t("other.CheckingForUpdates")}...
                        </Text>
                    </div>
                )}
            </Transition>

            <Transition mounted={status === "prompting-about-update"} transition="fade-up">
                {style => (
                    <div className="w-fit flex items-center flex-col absolute gap-2" style={style}>
                        <Text>
                            {t("other.InstallUpdatePrompt")}?
                        </Text>

                        <div className="flex items-baseline gap-8">
                            <Anchor component="button" onClick={() => setStatus("use-normally")}>
                                {t("common.No")}
                            </Anchor>

                            <Button
                                onClick={() => {
                                    setStatus("installing-update");
                                }}>
                                {t("common.Yes")}
                            </Button>
                        </div>
                    </div>
                )}
            </Transition>

            <Transition mounted={status === "installing-update"} transition="fade-up">
                {style => (
                    <div className="w-fit flex items-center flex-col absolute gap-2" style={style}>
                        <Text>
                            {t("other.InstallingUpdate")}...
                        </Text>

                        {downloaded} / {contentLength}
                    </div>
                )}
            </Transition>
        </div>
    );
};

export default UpdaterWrapper;