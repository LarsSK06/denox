import { ReactNode } from "react";

type ParentProps<T = ReactNode> = {
    children?: T;
};

export default ParentProps;