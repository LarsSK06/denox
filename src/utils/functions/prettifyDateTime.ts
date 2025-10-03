import getArrayFromNumber from "./getArrayFromNumber";
import prettifyDate from "./prettifyDate";

const prettifyDateTime = (date: Date) => {
    const _hours = date.getHours();
    const _minutes = date.getMinutes();

    const hours =
        getArrayFromNumber(2 - `${_hours}`.length)
            .map(() => "0")
            .join("")
        + `${_hours}`;

    const minutes =
        getArrayFromNumber(2 - `${_minutes}`.length)
            .map(() => "0")
            .join("")
        + `${_minutes}`;

    return `${prettifyDate(date)} ${hours}:${minutes}`;
};

export default prettifyDateTime;