"use client";

import ParentProps from "@/types/common/ParentProps";

import { useDbContext } from "@/utils/contexts/useDbContext";
import { useProfileContext } from "@/utils/contexts/useProfileContext";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";

const LoaderWrapper = ({ children }: ParentProps) => {
    const { isReady: isDatabaseReady } = useDbContext();
    const { isReady: isSettingsReady } = useSettingsContext();
    const { isReady: isProfilesReady } = useProfileContext();

    if (!isDatabaseReady) return <>Connecting to database...</>;
    if (!isSettingsReady) return <>Fetching settings...</>;
    if (!isProfilesReady) return <>Prepping profiles...</>;

    return children;
};

export default LoaderWrapper;