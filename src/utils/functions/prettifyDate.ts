import { t } from "i18next";

const prettifyDate = (date: Date) => {
    const weekday = [
        t("common.Monday"),
        t("common.Tuesday"),
        t("common.Wednesday"),
        t("common.Thursday"),
        t("common.Friday"),
        t("common.Saturday"),
        t("common.Sunday")
    ][date.getDay() - 1];

    const month = [
        t("common.January"),
        t("common.February"),
        t("common.March"),
        t("common.April"),
        t("common.May"),
        t("common.June"),
        t("common.July"),
        t("common.August"),
        t("common.September"),
        t("common.October"),
        t("common.November"),
        t("common.December")
    ][date.getMonth()];

    return `${weekday} ${date.getDate()}. ${month}, ${date.getFullYear()}`;
};

export default prettifyDate;