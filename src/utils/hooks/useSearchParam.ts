import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type TypeMap = {
    string: string;
    number: number;
};

type UseSearchParamOptions<T extends keyof TypeMap> = {
    key: string;
    type: T;
};

const useSearchParam = <T extends keyof TypeMap>({ key, type }: UseSearchParamOptions<T>) => {
    const [value, setValue] = useState<TypeMap[T] | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const raw = searchParams.get(key);

        if (!raw) return setValue(null);

        switch (type) {
            case "string": return setValue(raw as TypeMap[T]);

            case "number":
                const parsed = Number(raw);

                if (Number.isNaN(parsed)) return setValue(null);

                return setValue(parsed as TypeMap[T]);
        }
    }, [searchParams]);

    return value;
};

export default useSearchParam;