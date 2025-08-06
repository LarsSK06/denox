import { useEffect } from "react";

type UseQuickEditKeybindsOptions = {
    markAll?: () => any;
    refresh?: () => any;
};

const useQuickEditKeybinds = ({ markAll, refresh }: UseQuickEditKeybindsOptions) => {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "A"){
                event.preventDefault();

                refresh?.();
            }

            if (event.ctrlKey && event.key === "R"){
                event.preventDefault();

                refresh?.();
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);
};

export default useQuickEditKeybinds;