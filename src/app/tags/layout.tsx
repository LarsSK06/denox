"use client";

import ParentProps from "@/types/common/ParentProps";

import { TagsContextProvider } from "@/utils/contexts/useTagsContext";

const Layout = ({ children }: ParentProps) => (
    <TagsContextProvider>
        {children}
    </TagsContextProvider>
);

export default Layout;