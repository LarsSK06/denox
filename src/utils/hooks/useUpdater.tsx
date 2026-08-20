import { Button, ButtonGroup } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCircleCheck, IconInfoCircle, IconLoader } from "@tabler/icons-react";
import { relaunch } from "@tauri-apps/plugin-process";
import { check } from "@tauri-apps/plugin-updater";
import { t } from "i18next";
import { useRef } from "react";

const useUpdater = () => {

    const notificationIdRef = useRef<string | null>(null);

    const execute = async () => {
        if (notificationIdRef.current)
            notifications.hide(notificationIdRef.current);

        notificationIdRef.current = notifications.show({
            color: "transparent",
            icon: <IconLoader className="animate-spin" />,
            message: t("updater.CheckingForUpdates"),
            autoClose: false
        });

        const update = await check();

        if (!update) {
            notifications.update({
                id: notificationIdRef.current,
                color: "green",
                icon: <IconCircleCheck />,
                message: t("updater.NoUpdateFound"),
                autoClose: true
            })

            return;
        }

        const ignore = () => {
            if (!notificationIdRef.current) return;

            notifications.hide(notificationIdRef.current);

            notificationIdRef.current = null;
        };

        const installUpdate = () => {
            notifications.update({
                id: notificationIdRef.current ?? undefined,
                color: "transparent",
                icon: <IconLoader className="animate-spin" />,
                title: null,
                message: t("common.Installing")
            });

            update.downloadAndInstall(event => {
                if (event.event !== "Finished") return;

                notifications.update({
                    id: notificationIdRef.current ?? undefined,
                    color: "green",
                    icon: <IconCircleCheck />,
                    title: t("updater.UpdateInstalled"),
                    message: (
                        <ButtonGroup className="mt-2">
                            <Button size="compact-xs" onClick={() => relaunch()}>
                                {t("common.RelaunchNow")}
                            </Button>

                            <Button
                                size="compact-xs"
                                variant="light"
                                onClick={() => ignore()}>
                                {t("common.Ignore")}
                            </Button>
                        </ButtonGroup>
                    )
                });
            });
        };

        notifications.update({
            id: notificationIdRef.current,
            color: "blue",
            icon: <IconInfoCircle />,
            title: t("updater.UpdateFound"),
            message: (
                <div className="flex flex-col">
                    <span>
                        {t("updater.VersionIsReadyForInstallation", { version: update.version })}
                    </span>

                    <ButtonGroup className="mt-2">
                        <Button size="compact-xs" onClick={() => installUpdate()}>
                            {t("common.InstallNow")}
                        </Button>

                        <Button
                            size="compact-xs"
                            variant="light"
                            onClick={() => ignore()}>
                            {t("common.Ignore")}
                        </Button>
                    </ButtonGroup>
                </div>
            )
        });
    };

    return { execute };
};

export default useUpdater;