import { useState } from "react";
import { useDbContext } from "../contexts/useDbContext";

type UseDbExecuteOptions = {
    query: string;
};

const useDbExecute = ({ query }: UseDbExecuteOptions) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [rowsAffected, setRowsAffected] = useState<number | null>(null);

    const { database } = useDbContext();

    const call = () => new Promise<Awaited<ReturnType<typeof database.execute>>>((resolve, reject) => {
        setIsLoading(true);

        database.execute(query)
            .then(response => {
                resolve(response);
                setRowsAffected(response.rowsAffected);
            })
            .catch(reject)
            .finally(() => setIsLoading(false));
    });

    return { isLoading, rowsAffected, call };
};

export default useDbExecute;