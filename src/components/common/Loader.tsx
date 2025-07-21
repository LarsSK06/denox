import { ComponentProps } from "react";

import Logo from "./Logo";

type LoaderProps = {} & ComponentProps<typeof Logo>;

const Loader = (props: LoaderProps) => (
    <div className="w-fit h-fit animate-pulse">
        <Logo {...props} />
    </div>
);

export default Loader;