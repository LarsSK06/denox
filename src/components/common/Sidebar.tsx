import usePrimaryColorShade from "@/utils/hooks/usePrimaryColorShade";
import { ComponentProps, useState } from "react";

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

    const primaryColorShade = usePrimaryColorShade();

    return (
        <aside style={{ width }} className="relative" {...restProps}>
            <button>
                <div className="" style={{ backgroundColor: primaryColorShade }} />
            </button>

            <div className="w-full h-full">

            </div>
        </aside>
    );
};

export default Sidebar;