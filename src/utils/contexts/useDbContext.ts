import ParentProps from "@/types/common/ParentProps";
import Database from "@tauri-apps/plugin-sql";

import { createContext, createElement, useContext, useEffect, useMemo, useState } from "react";
import { dbConnectionString, invalidContextUsageError } from "../globals";

type DbContextState = {
    database: Database;
};

const DbContext = createContext<DbContextState | undefined>(undefined);

export const DbContextProvider = ({ children }: ParentProps) => {
    const [database, setDatabase] = useState<Database>(null!);

    useEffect(() => {
        Database.load(dbConnectionString).then(setDatabase);
    }, []);

    const value = useMemo<DbContextState>(() => ({ database }), [database]);

    return createElement(DbContext.Provider, { value }, database && children);
};

export const useDbContext = () => {
    const context = useContext(DbContext);
    
    if (!context) throw new Error(invalidContextUsageError);

    return context;
};