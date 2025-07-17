import { useState } from "react";
import { useDbContext } from "../contexts/useDbContext";

type UseDbSelectOptions = {
    query: string;
};

const useDbSelect = <T>({ query }: UseDbSelectOptions) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<T | null>(null);

    const { database } = useDbContext();

    const call = () => new Promise<T>((resolve, reject) => {
        setIsLoading(true);

        database.select<T>(query)
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