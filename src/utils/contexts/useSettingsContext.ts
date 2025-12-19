import ParentProps from "@/types/common/ParentProps";
import S_Settings from "@/zod-schemas/S_Settings";

import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { invalidContextUsageError, settingsFileName } from "../globals";
import { useMantineColorScheme } from "@mantine/core";
import { useTranslation } from "react-i18next";

import * as path from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/plugin-fs";

type SettingsContextValue = {
    isReady: boolean;

    allowAnimations: boolean;

    capitalizeDomainNames: boolean;

    showRecordIds: boolean;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsContextProvider = ({ children }: ParentProps) => {
    const [isReady, setIsReady] = useState<boolean>(false);

    const [allowAnimations, setAllowAnimations] = useState<boolean>(true);
    const [capitalizeDomainNames, setCapitalizeDomainNames] = useState<boolean>(false);
    const [showRecordIds, setShowRecordIds] = useState<boolean>(false);

    const { i18n } = useTranslation();
    const { colorScheme, setColorScheme } = useMantineColorScheme();

    useEffect(() => {
        fs.readTextFile(settingsFileName, { baseDir: path.BaseDirectory.AppConfig })
            .then(fileContent => {
                S_Settings.parseAsync(JSON.parse(fileContent))
                    .then(async settings => {
                        setAllowAnimations(prev => settings.allowAnimations ?? prev);
                        setCapitalizeDomainNames(prev => settings.capitalizeDomainNames ?? prev);
                        setColorScheme(settings.colorScheme ?? colorScheme);
                        await i18n.changeLanguage(settings.language ?? i18n.language);
                        setShowRecordIds(prev => settings.showRecordIds ?? prev);
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                    .finally(() => setIsReady(true));
            })
            .catch(() => setIsReady(true));
    }, []);

    const value = useMemo(() => ({
        isReady,
        allowAnimations,
        capitalizeDomainNames,
        showRecordIds
    }), [isReady, allowAnimations, capitalizeDomainNames, showRecordIds]);

    return createElement(SettingsContext.Provider, { value }, children);
};

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);

    if (!context) throw new Error(invalidContextUsageError);

    return context;
};