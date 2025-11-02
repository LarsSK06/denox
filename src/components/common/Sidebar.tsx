"use client";

import ParentProps from "@/types/common/ParentProps";

import { useEffect, useRef, useState } from "react";
import { getThemeColor, Paper, useMantineTheme } from "@mantine/core";
import { t } from "i18next";

type SidebarProps = {
    initialWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    setCache?: (value: number) => unknown;
} & ParentProps;

const Sidebar = ({
    initialWidth = 250,
    minWidth = 150,
    maxWidth = 500,
    setCache,
    children
}: SidebarProps) => {
    const [width, setWidth] = useState<number>(initialWidth);
    const [isGrabbing, setIsGrabbing] = useState<boolean>(false);
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const paperRef = useRef<HTMLElement | null>(null);
    const mantineTheme = useMantineTheme();

    const onMouseDown = () => setIsGrabbing(true);

    const onKeyDown = (event: React.KeyboardEvent) => {
            switch (event.key) {
                case "ArrowLeft":
                    setWidth(prev => Math.max(Math.min(prev - 5, maxWidth), minWidth));

                    break;

                case "ArrowRight":
                    setWidth(prev => Math.max(Math.min(prev + 5, maxWidth), minWidth));

                    break;
            }
        };

    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            if (!isGrabbing) return;
            if (!paperRef.current) return;

            const asideBoundingClientRect = paperRef.current?.getBoundingClientRect();

            let targetWidth = event.clientX - asideBoundingClientRect.left;

            targetWidth = Math.min(targetWidth, maxWidth);
            targetWidth = Math.max(targetWidth, minWidth);

            setWidth(targetWidth);
            setCache?.(targetWidth);
        };

        const onMouseUp = () => {
            setIsGrabbing(false);

            setCache?.(width);
        }

        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [paperRef, isGrabbing, setCache]);

    return (
        <Paper
            withBorder
            component="aside"
            ref={paperRef}
            style={{
                width,
                borderRightColor:
                    isGrabbing || isHovering
                        ? getThemeColor(mantineTheme.primaryColor, mantineTheme)
                        : undefined
            }}
            className="h-full border-t-0 border-b-0 border-l-0 rounded-none relative transition-colors">
            <button
                onMouseDown={onMouseDown}
                onKeyDown={onKeyDown}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                className="w-[8px] h-full absolute top-0 right-[-4px] z-1 group outline-none cursor-e-resize"
                aria-label={t("common.ResizeSidebar")}
            />

            <div className="w-full h-full">
                {children}
            </div>
        </Paper>
    );
};

export default Sidebar;