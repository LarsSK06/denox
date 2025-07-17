import { ComponentProps, ElementType, JSX, JSXElementConstructor, useState } from "react";

type SidebarProps = {
    initialWidth: number;
    minWidth: number;
    maxWidth: number;
} & ComponentProps<"aside">;

const Sidebar = ({
    initialWidth,
    minWidth,
    maxWidth,
    ...restProps
}: SidebarProps) => {
    const [width, setWidth] = useState<number>(150);
    const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

    return (
        <aside style={{ width }} className="relative" {...restProps}>
            <div className="">

            </div>
        </aside>
    );
};

export default Sidebar;