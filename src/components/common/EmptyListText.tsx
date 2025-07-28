"use client";

import { t } from "i18next";
import { useMemo } from "react";

const EmptyListText = () => {
    const text = useMemo(() => {
        const availableTexts = [
            t("other.SeemsEmptyOverHere"),
            t("other.CouldNotFindAnythingHere"),
            t("other.NothingButDustHere")
        ] as string[];

        return availableTexts[Math.floor(Math.random() * availableTexts.length)]
    }, []);

    return text;
};

export default EmptyListText;