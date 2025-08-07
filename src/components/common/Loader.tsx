import usePrimaryColorShade from "@/utils/hooks/usePrimaryColorShade";

import { Mirage } from "ldrs/react";

import "ldrs/react/Mirage.css";

type LoaderProps = {
    size?: number;
};

const Loader = ({ size = 200 }: LoaderProps) => {

    const primaryColorShade = usePrimaryColorShade();

    return (
        <Mirage
            size={size}
            color={primaryColorShade}
        />
    );
};

export default Loader;