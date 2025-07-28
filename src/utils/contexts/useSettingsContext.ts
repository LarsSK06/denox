import ParentProps from "@/types/common/ParentProps";

import { createContext, createElement, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { invalidContextUsageError, settingsFileName } from "../globals";
import { useMantineColorScheme } from "@mantine/core";

import * as path from "@tauri-apps/api/path";
import * as fs from "@tauri-apps/plugin-fs";

type SettingsContextValue = {
    isReady: boolean;

    allowAnimations: boolean;
    setAllowAnimations: Dispatch<SetStateAction<boolean>>;

    capitalizeDomainNames: boolean;
    setCapitalizeDomainNames: Dispatch<SetStateAction<boolean>>;

    paginateDnsRecords: boolean;
    setPaginateDnsRecords: Dispatch<SetStateAction<boolean>>;

    saveToFile: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsContextProvider = ({ children }: ParentProps) => {
    const [isReady, setIsReady] = useState<boolean>(false);

    const [allowAnimations, setAllowAnimations] = useState<boolean>(true);
    const [capitalizeDomainNames, setCapitalizeDomainNames] = useState<boolean>(false);
    const [paginateDnsRecords, setPaginateDnsRecords] = useState<boolean>(false);

    const { colorScheme, setColorScheme } = useMantineColorScheme();

    useEffect(() => {
        fs.readTextFile(settingsFileName, { baseDir: path.BaseDirectory.AppConfig })
            .then(settingsFileContent => {
                const json = JSON.parse(settingsFileContent);

                setAllowAnimations(Boolean(json.allowAnimations));
                setCapitalizeDomainNames(Boolean(json.capitalizeDomainNames));
                setPaginateDnsRecords(Boolean(json.paginateDnsRecords));

                switch (json.colorScheme) {
                    case 0:
                    case "light":
                        setColorScheme("light");
                        break;

                    case 1:
                    case "dark":
                        setColorScheme("dark");
                        break;

                    default:
                        setColorScheme("auto");
                        break;
                }
            })
            .catch(() => {})
            .finally(() => setIsReady(true));
    }, []);

    const saveToFile = () => fs.writeTextFile(
        settingsFileName,
        JSON.stringify({
            allowAnimations,
            capitalizeDomainNames,
            paginateDnsRecords,
            colorScheme
        }),
        { baseDir: path.BaseDirectory.AppConfig }
    );

    const value = useMemo<SettingsContextValue>(() => ({
        isReady,

        allowAnimations,
        setAllowAnimations,

        capitalizeDomainNames,
        setCapitalizeDomainNames,

        paginateDnsRecords,
        setPaginateDnsRecords,

        saveToFile
    }), [isReady, allowAnimations, capitalizeDomainNames, paginateDnsRecords]);

    return createElement(SettingsContext.Provider, { value }, children);
};

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);

    if (!context) throw new Error(invalidContextUsageError);

    return context;
};