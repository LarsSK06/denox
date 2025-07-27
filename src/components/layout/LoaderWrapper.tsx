"use client";

import ParentProps from "@/types/common/ParentProps";

import { useDbContext } from "@/utils/contexts/useDbContext";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";

const LoaderWrapper = ({ children }: ParentProps) => {
    const { isReady: isDatabaseReady } = useDbContext();
    const { isReady: isSettingsReady } = useSettingsContext();

    if (!isDatabaseReady) return <>Connecting to database...</>;
    if (!isSettingsReady) return <>Fetching settings...</>;

    return children;
};

export default LoaderWrapper;