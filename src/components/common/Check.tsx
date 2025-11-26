"use client";

import { IconCheck, IconCircleCheck, IconCircleMinus, IconCircleX } from "@tabler/icons-react";
import { getThemeColor, Tooltip, useMantineTheme } from "@mantine/core";
import { ComponentProps } from "react";
import { t } from "i18next";

type CheckProps = {
    value: boolean | "true" | "false" | "indeterminate" | null;
    labels?: {
        true?: string;
        false?: string;
        indeterminate?: string;
    };
} & ComponentProps<typeof IconCheck>;

const Check = ({
    value,
    labels: _labels = {
        true: t("common.Yes"),
        false: t("common.No"),
        indeterminate: t("common.Indeterminate")
    },
    ...restProps
}: CheckProps) => {

    const mantineTheme = useMantineTheme();

    const labels = {
        true: t("common.Yes"),
        false: t("common.No"),
        indeterminate: t("common.Indeterminate"),
        ..._labels
    };

    switch (value) {
        case true:
        case "true": return (
            <>
                <Tooltip label={labels.true}>
                    <IconCircleCheck color={getThemeColor("green", mantineTheme)} aria-hidden {...restProps} />
                </Tooltip>

                <span className="sr-only">
                    {labels.true}
                </span>
            </>
        );

        case false:
        case "false": return (
            <>
                <Tooltip label={labels.false}>
                    <IconCircleX color={getThemeColor("red", mantineTheme)} aria-hidden {...restProps} />
                </Tooltip>

                <span className="sr-only">
                    {labels.false}
                </span>
            </>
        );

        case null:
        case "indeterminate": return (
            <>
                <Tooltip label={labels.indeterminate}>
                    <IconCircleMinus color={getThemeColor("gray", mantineTheme)} aria-hidden {...restProps} />
                </Tooltip>

                <span className="sr-only">
                    {labels.indeterminate}
                </span>
            </>
        );
    }
};

export default Check;