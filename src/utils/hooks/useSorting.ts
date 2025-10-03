import SortDirection from "@/types/common/SortDirection";
import isEnum from "../functions/isEnum";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type SortByRoot = Parameters<typeof Object.values>[0];

type UseSortingOptions<SortBy extends SortByRoot> = {
    sortByEnum: SortBy;
};

const useSorting = <SortBy extends SortByRoot>({ sortByEnum }: UseSortingOptions<SortBy>) => {
    const [isInitialSetDone, setIsInitialSetDone] = useState<boolean>(false);

    const [sortBy, setSortBy] = useState<SortBy | null>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const _sortBy = searchParams.get("sortBy");

        if (_sortBy && isEnum(_sortBy, sortByEnum) && _sortBy != sortBy)
            setSortBy(_sortBy);
        else setSortBy(null);

        const _sortDirection = searchParams.get("sortDirection");

        if (_sortDirection && isEnum(_sortDirection, SortDirection) && _sortDirection != sortDirection)
            setSortDirection(_sortDirection as SortDirection);
        else setSortDirection(null);
    }, [searchParams]);

    useEffect(() => {
        if (!isInitialSetDone) return;

        //
    }, [sortBy]);
};

export default useSorting;