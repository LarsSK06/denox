import { getThemeColor, useMantineTheme } from "@mantine/core";
import { Mirage } from "ldrs/react";

type LoaderProps = {
    size?: number;
};

const Loader = ({ size = 200 }: LoaderProps) => {

    const mantineTheme = useMantineTheme();

    return (
        <Mirage
            size={size}
            color={getThemeColor(mantineTheme.primaryColor, mantineTheme)}
        />
    );
};

export default Loader;