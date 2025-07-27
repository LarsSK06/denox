import ParentProps from "@/types/common/ParentProps";
import Database from "@tauri-apps/plugin-sql";

import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { dbConnectionString, invalidContextUsageError } from "../globals";

type DbContextValue = {
    isReady: boolean;

    database: Database;
};

const DbContext = createContext<DbContextValue | undefined>(undefined);

export const DbContextProvider = ({ children }: ParentProps) => {
    const [isReady, setIsReady] = useState<boolean>(false);

    const [database, setDatabase] = useState<Database>(null!);

    useEffect(() => {
        Database.load(dbConnectionString)
            .then(db => {
                setDatabase(db);

                setIsReady(true);
            })
            .catch(console.error);
    }, []);

    const value = useMemo<DbContextValue>(() => ({ isReady, database }), [isReady, database]);

    return createElement(DbContext.Provider, { value }, database && children);
};

export const useDbContext = () => {
    const context = useContext(DbContext);
    
    if (!context) throw new Error(invalidContextUsageError);

    return context;
};