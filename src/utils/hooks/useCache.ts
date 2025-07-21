import { useEffect, useState } from "react";

type TypeMap = {
    number: {
        options: {};
        type: number;
    };
    enum: {
        options: {
            enum: Parameters<typeof Object.values>[0];
        };
        type: any;
    };
};

const useCache = <
    Type extends keyof TypeMap,
    T = TypeMap[Type]["type"]
>(
    type: Type,
    key: string,
    options: TypeMap[Type]["options"]
) => {
    const [value, setValue] = useState<T | null>(null);

    useEffect(() => {
        const raw = window.localStorage.getItem(key);

        if (!raw && value !== null) setValue(null);

        switch (type) {
            case "number": {
                const _options = options as TypeMap["number"]["options"];

                if (!raw) return setValue(null);

                const parsed = Number(raw);

                if (Number.isNaN(parsed)) return setValue(null);

                setValue(parsed as T);

                break;
            }

            case "enum": {
                const _options = options as TypeMap["enum"]["options"];

                if (raw && Object.keys(_options.enum).includes(raw))
                    setValue(raw as T);
                else setValue(null);

                break;
            }
        }
    }, []);

    return value;
};

export default useCache;