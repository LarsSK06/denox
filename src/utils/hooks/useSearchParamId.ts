import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type TypeMap = {
    string: string;
    number: number;
}

type UseSearchParamIdOptions<T extends keyof TypeMap> = {
    key: string;
    type: T;
};

const useSearchParamId = <T extends keyof TypeMap>({ key, type }: UseSearchParamIdOptions<T>) => {
    const [id, setId] = useState<string | number | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const searchParam = searchParams.get(key);

        switch (type) {
            case "string": setId(searchParam);
            case "number":
                if (!searchParam) return setId(null);

                const searchParamParsed = Number(searchParam);

                if (Number.isNaN(searchParamParsed)) return setId(null);

                setId(searchParamParsed);
        }
    }, [searchParams]);

    return id as TypeMap[T] | null;
};

export default useSearchParamId;