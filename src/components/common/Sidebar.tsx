"use client";

import ParentProps from "@/types/common/ParentProps";
import usePrimaryColorShade from "@/utils/hooks/usePrimaryColorShade";

import { Paper } from "@mantine/core";
import { t } from "i18next";
import { ComponentProps, useEffect, useRef, useState } from "react";

type SidebarProps = {
    initialWidth?: number;
    minWidth?: number;
    maxWidth?: number;
} & ComponentProps<"aside"> & ParentProps;

const Sidebar = ({
    initialWidth = 250,
    minWidth = 150,
    maxWidth = 500,
    children,
    ...restProps
}: SidebarProps) => {
    const [width, setWidth] = useState<number>(initialWidth);
    const [isGrabbing, setIsGrabbing] = useState<boolean>(false);

    const paperRef = useRef<HTMLElement | null>(null);
    const primaryColorShade = usePrimaryColorShade();

    const onMouseDown = () => setIsGrabbing(true);

    const onKeyDown = (event: React.KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    setWidth(prev => prev - 5);

                    break;

                case "ArrowRight":
                    setWidth(prev => prev + 5);

                    break;
            }
        };

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            if (!isGrabbing) return;
            if (!paperRef.current) return;

            const asideBoundingClientRect = paperRef.current?.getBoundingClientRect();

            setWidth(Math.max(Math.min(event.clientX - asideBoundingClientRect?.left, maxWidth), minWidth));
        };

        const onMouseUp = () => setIsGrabbing(false);

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [paperRef, isGrabbing]);

    return (
        <Paper withBorder component="aside" ref={paperRef} style={{ width }} className="h-full border-t-0 border-b-0 border-l-0 rounded-none relative" {...restProps}>
            <button onMouseDown={onMouseDown} onKeyDown={onKeyDown} className="w-[8px] h-full absolute top-0 right-[-4px] z-1 group outline-none" style={{ cursor: isGrabbing ? "grabbing" : "grab" }} aria-label={t("common.ResizeSidebar")}>
                <div className="w-0 h-full mx-auto group-hover:w-full group-focus-visible:w-full transition-all" style={{ width: isGrabbing ? "100%" : undefined, backgroundColor: primaryColorShade }} />
            </button>

            <div className="w-full h-full">
                {children}
            </div>
        </Paper>
    );
};

export default Sidebar;