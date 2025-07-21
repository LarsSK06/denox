"use client";

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
    switch (mode) {
        case "true": return (
            <>
                <IconCircleCheck color="green" aria-hidden {...restProps} />

                <span className="sr-only">
                    {trueLabel}
                </span>
            </>
        );
        case "false": return (
            <>
                <IconCircleX color="red" aria-hidden {...restProps} />

                <span className="sr-only">
                    {falseLabel}
                </span>
            </>
        );
        case "indeterminate": return (
            <>
                <IconCircleMinus color="gray" aria-hidden {...restProps} />

                <span className="sr-only">
                    {indeterminateLabel}
                </span>
            </>
        );
    }
};

export default Check;