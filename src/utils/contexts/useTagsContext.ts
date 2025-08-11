import ParentProps from "@/types/common/ParentProps";
import TagGetModel from "@/types/tags/TagGetModel";
import useDbSelect from "../hooks/useDbSelect";

import { createContext, createElement, Dispatch, SetStateAction, useContext, useMemo } from "react";
import { invalidContextUsageError } from "../globals";

type TagsContextValue = {
    isTagsLoading: boolean;
    tags: (TagGetModel & { domainsCount: number; invoicesCount: number; })[] | null;
    setTags: Dispatch<SetStateAction<(TagGetModel & { domainsCount: number; invoicesCount: number; })[] | null>>;
    getTags: ReturnType<typeof useDbSelect<(TagGetModel & { domainsCount: number; invoicesCount: number; })[]>>["call"];
};

const TagsContext = createContext<TagsContextValue | undefined>(undefined);

export const TagsContextProvider = ({ children }: ParentProps) => {
    
    const {
        isLoading: isTagsLoading,
        data: tags,
        setData: setTags,
        call: getTags
    } = useDbSelect<(TagGetModel & { domainsCount: number; invoicesCount: number; })[]>({
        query: `
            SELECT
                t.*,
                (
                    SELECT COUNT(dtr.id)
                    FROM domainTagRelations dtr
                    WHERE dtr.tagId = t.id
                ) as domainsCount,
                (
                    SELECT COUNT(itr.id)
                    FROM invoiceTagRelations itr
                    WHERE itr.tagId = t.id
                ) as invoicesCount
            FROM tags t
        `
    });

    const value = useMemo<TagsContextValue>(() => ({
        isTagsLoading,
        tags,
        setTags,
        getTags
    }), [isTagsLoading, tags]);

    return createElement(TagsContext.Provider, { value }, children);
};

export const useTagsContext = () => {
    const context = useContext(TagsContext);
    
    if (!context) throw new Error(invalidContextUsageError);

    return context;
};