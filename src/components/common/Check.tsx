"use client";

import { getThemeColor, Tooltip, useMantineTheme } from "@mantine/core";
import { IconCheck, IconCircleCheck, IconCircleMinus, IconCircleX } from "@tabler/icons-react";
import { t } from "i18next";
import { ComponentProps } from "react";

type CheckProps = {
    mode: "true" | "false" | "indeterminate";
    trueLabel?: string;
    falseLabel?: string;
    indeterminateLabel?: string;
} & ComponentProps<typeof IconCheck>;

const Check = ({
    mode,
    trueLabel = t("common.Yes"),
    falseLabel = t("common.No"),
    indeterminateLabel = t("common.Indeterminate"),
    ...restProps
}: CheckProps) => {

    const mantineTheme = useMantineTheme();

    switch (mode) {
        case "true": return (
            <>
                <Tooltip label={trueLabel}>
                    <IconCircleCheck color={getThemeColor("green", mantineTheme)} aria-hidden {...restProps} />
                </Tooltip>

                <span className="sr-only">
                    {trueLabel}
                </span>
            </>
        );
        case "false": return (
            <>
                <Tooltip label={falseLabel}>
                    <IconCircleX color={getThemeColor("red", mantineTheme)} aria-hidden {...restProps} />
                </Tooltip>

                <span className="sr-only">
                    {falseLabel}
                </span>
            </>
        );
        case "indeterminate": return (
            <>
                <Tooltip label={indeterminateLabel}>
                    <IconCircleMinus color={getThemeColor("gray", mantineTheme)} aria-hidden {...restProps} />
                </Tooltip>

                <span className="sr-only">
                    {indeterminateLabel}
                </span>
            </>
        );
    }
};

export default Check;