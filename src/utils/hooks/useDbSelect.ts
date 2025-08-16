import { useState } from "react";
import { useDbContext } from "../contexts/useDbContext";

type UseDbSelectOptions = {
    query: string;
    bindValues?: any[];
};

const useDbSelect = <T>({ query, bindValues }: UseDbSelectOptions) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<T | null>(null);

    const { database } = useDbContext();

    const call = () => new Promise<T>((resolve, reject) => {
        setIsLoading(true);

        database.select<T>(query, bindValues)
            .then(response => {
                resolve(response);
                setData(response);
            })
            .catch(reject)
            .finally(() => setIsLoading(false));
    });

    return { isLoading, data, setData, call };
};

export default useDbSelect;