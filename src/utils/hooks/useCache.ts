import { useEffect, useState } from "react";

type TypeMap = {
    string: string;
    number: number;
};

type UseCacheOptions<T extends keyof TypeMap> = {
    key: string;
    type: T;
};

const useCache = <T extends keyof TypeMap>({ key, type }: UseCacheOptions<T>) => {
    const [value, setValue] = useState<TypeMap[T] | null>(null);

    useEffect(() => {
        const raw = window.localStorage.getItem(key);

        if (!raw) return setValue(null);

        switch (type) {
            case "string": return setValue(raw as TypeMap[T]);

            case "number":
                const parsed = Number(raw);

                if (Number.isNaN(parsed)) return setValue(null);

                return setValue(parsed as TypeMap[T]);
        }
    }, []);

    return value;
};

export default useCache;