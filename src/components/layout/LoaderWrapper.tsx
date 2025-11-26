"use client";

import ParentProps from "@/types/common/ParentProps";
import useSyntheticLoading from "@/utils/hooks/useSyntheticLoading";
import Logo from "../common/Logo";

import { useDbContext } from "@/utils/contexts/useDbContext";
import { useProfileContext } from "@/utils/contexts/useProfileContext";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { Text } from "@mantine/core";
import { t } from "i18next";
import { IconHeart } from "@tabler/icons-react";

const LoaderWrapper = ({ children }: ParentProps) => {
    const { isReady: isDatabaseReady } = useDbContext();
    const { isReady: isSettingsReady } = useSettingsContext();
    const { isReady: isProfilesReady } = useProfileContext();

    const { isDone: isSyntheticLoadingDone } = useSyntheticLoading({ delay: 5000, startOnMount: true });

    const isReady =
        isDatabaseReady &&
        isSettingsReady &&
        isProfilesReady &&
        isSyntheticLoadingDone;

    return isReady ? children : (
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-fit flex items-center flex-col">
                <div className="w-fit h-fit animate-pulse">
                    <Logo height="20rem" />
                </div>

                <Text size="xl">
                    <span aria-hidden>
                        {t("other.MadeWith")} <IconHeart style={{ display: "inline", height: "1em" }} /> {t("other.inNorway")}
                    </span>

                    <span className="sr-only">
                        {t("other.MadeWithLoveInNorway")}
                    </span>
                </Text>
            </div>
        </div>
    );
};

export default LoaderWrapper;