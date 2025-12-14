"use client";

import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { useEffect, useState } from "react";
import { Button, Checkbox, Container, Divider, Select, Text, useMantineColorScheme } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { settingsFileName } from "@/utils/globals";
import { t } from "i18next";

import * as fs from "@tauri-apps/plugin-fs";
import * as process from "@tauri-apps/plugin-process";
import * as path from "@tauri-apps/api/path";

import AppColorScheme from "@/types/common/AppColorScheme";
import AppLang from "@/types/common/AppLang";
import Settings_GET from "@/types/settings/Settings_GET";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";

const Page = () => {

    const settings = useSettingsContext();

    const { colorScheme: _colorScheme } = useMantineColorScheme();
    const { i18n } = useTranslation();

    const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

    const [allowAnimations, setAllowAnimations] = useState<boolean>(true);
    const [capitalizeDomainNames, setCapitalizeDomainNames] = useState<boolean>(false);
    const [colorScheme, setColorScheme] = useState<AppColorScheme>(AppColorScheme.Auto);
    const [language, setLanguage] = useState<AppLang>(AppLang.English);

    useEffect(() => {
        setAllowAnimations(settings.allowAnimations);
        setCapitalizeDomainNames(settings.capitalizeDomainNames);
        setColorScheme(_colorScheme as AppColorScheme);
        setLanguage(i18n.language as AppLang);
    }, [settings]);

    const saveToFile = async (relaunch?: boolean) => {
        setIsSaveLoading(true);

        try {
            await fs.writeTextFile(
                settingsFileName,
                JSON.stringify({
                    allowAnimations,
                    capitalizeDomainNames,
                    colorScheme,
                    language
                } satisfies Settings_GET),
                { baseDir: path.BaseDirectory.AppConfig }
            );

            if (relaunch) process.relaunch();
            else setIsSaveLoading(false);
        }
        catch (error) {
            notifications.show({
                color: "red",
                icon: <IconAlertCircle />,
                message: t("settings.errors.save_error")
            });

            console.log(error)

            setIsSaveLoading(false);
        }
    };

    return (
        <Container size="xs" component="form" className="w-full p-2 flex flex-col gap-2">
            <Text size="xl" component="h1">
                {t("settings.common.settings")}
            </Text>

            <div className="flex justify-between items-center">
                <Text component="label" htmlFor="allow-animations" className="my-1">
                    {t("settings.literals.allow_animations")}
                </Text>

                <Checkbox
                    id="allow-animations"
                    checked={allowAnimations}
                    onChange={event => setAllowAnimations(event.target.checked)}
                />
            </div>

            <div className="flex justify-between items-center">
                <Text component="label" htmlFor="capitalize-domain-names" className="my-1">
                    {t("settings.literals.capitalize_domain_names")}
                </Text>

                <Checkbox
                    id="capitalize-domain-names"
                    checked={capitalizeDomainNames}
                    onChange={event => setCapitalizeDomainNames(event.target.checked)}
                />
            </div>

            <div className="flex justify-between items-center">
                <Text component="label" htmlFor="color-scheme" className="my-1">
                    {t("settings.literals.color_scheme")}
                </Text>

                <Select
                    id="color-scheme"
                    value={colorScheme}
                    onChange={value => setColorScheme((value ?? AppColorScheme.Auto) as AppColorScheme)}
                    data={
                        Object.values(AppColorScheme).map(apc => ({
                            value: apc,
                            label: t(`color_schemes.${apc}`)
                        }))
                    }
                    size="xs"
                />
            </div>

            <div className="flex justify-between items-center">
                <Text component="label" htmlFor="language" className="my-1">
                    {t("settings.literals.language")}
                </Text>

                <Select
                    id="language"
                    value={language}
                    onChange={value => setLanguage((value ?? AppLang.English) as AppLang)}
                    data={
                        Object.values(AppLang).map(al => ({
                            value: al,
                            label: t(`languages.${al}`)
                        }))
                    }
                    size="xs"
                />
            </div>

            <Divider />

            <div className="flex justify-end gap-2">
                <Button loading={isSaveLoading} onClick={() => saveToFile()}>
                    {t("settings.buttons.save")}
                </Button>

                <Button loading={isSaveLoading} variant="light" onClick={() => saveToFile(true)}>
                    {t("settings.buttons.save_and_restart")}
                </Button>
            </div>
        </Container>
    );
};

export default Page;