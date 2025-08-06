import { useEffect, useState } from "react";

type UseQuickEditKeybindsOptions = {
    markAll?: () => any;
    refresh?: () => any;
};

const useQuickEditKeybinds = ({ markAll, refresh }: UseQuickEditKeybindsOptions) => {
    const [ctrl, setCtrl] = useState<boolean>(false);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === "a"){
                event.preventDefault();

                markAll?.();
            }
            
            if (event.ctrlKey && event.key === "r"){
                event.preventDefault();
                
                refresh?.();
            }

            if (event.ctrlKey) setCtrl(true);
        };

        const onKeyUp = (event: KeyboardEvent) => {
            if (event.key === "Control") setCtrl(false);
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, [markAll, refresh]);

    return { ctrl };
};

export default useQuickEditKeybinds;