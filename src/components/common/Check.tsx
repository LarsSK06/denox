"use client";

import useColorScheme from "@/utils/hooks/useColorScheme";
import usePrimaryShade from "@/utils/hooks/usePrimaryShade";

import { Tooltip, useMantineTheme } from "@mantine/core";
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
    const shadeIndexer = usePrimaryShade();

    switch (mode) {
        case "true": return (
            <>
                <Tooltip label={trueLabel}>
                    <IconCircleCheck color={mantineTheme.colors.green[shadeIndexer]} aria-hidden {...restProps} />
                </Tooltip>

                <span className="sr-only">
                    {trueLabel}
                </span>
            </>
        );
        case "false": return (
            <>
                <Tooltip label={falseLabel}>
                    <IconCircleX color={mantineTheme.colors.red[shadeIndexer]} aria-hidden {...restProps} />
                </Tooltip>

                <span className="sr-only">
                    {falseLabel}
                </span>
            </>
        );
        case "indeterminate": return (
            <>
                <Tooltip label={indeterminateLabel}>
                    <IconCircleMinus color={mantineTheme.colors.gray[shadeIndexer]} aria-hidden {...restProps} />
                </Tooltip>

                <span className="sr-only">
                    {indeterminateLabel}
                </span>
            </>
        );
    }
};

export default Check;