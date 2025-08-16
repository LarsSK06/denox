import { useEffect, useState } from "react";

type UseSyntheticLoadingOptions = {
    delay: number;
    startOnMount?: boolean;
};

const useSyntheticLoading = ({ delay, startOnMount }: UseSyntheticLoadingOptions) => {
    const [isDone, setIsDone] = useState<boolean>(!startOnMount);

    const start = () => {
        setIsDone(false);

        setTimeout(() => setIsDone(true), delay);
    };

    useEffect(() => {
        if (startOnMount) start();
    }, []);

    return { isDone, start };
};

export default useSyntheticLoading;