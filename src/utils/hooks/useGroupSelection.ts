import { useEffect, useState } from "react";

const useGroupSelection = <T>(allIds: T[], initialSelectedIds?: T[]) => {
    const [selectedIds, setSelectedIds] = useState<T[]>(initialSelectedIds ?? []);

    const isSelected = (id: T) => selectedIds.includes(id);

    const isHeadChecked = allIds.length === selectedIds.length;

    const isHeadIndeterminate =
        selectedIds.length !== 0 &&
        selectedIds.length !== allIds.length;

    const toggle = (id: T) => {
        if (selectedIds.includes(id))
            setSelectedIds(prev => prev.filter(i => i !== id));
        else setSelectedIds(prev => [...prev, id]);
    };

    const toggleHead = () => {
        if (selectedIds.length === 0) setSelectedIds(allIds);
        else setSelectedIds([]);
    };

    useEffect(() => {
        setSelectedIds(prev => prev.filter(id => allIds.includes(id)));
    }, [selectedIds]);

    return {
        selectedIds,
        setSelectedIds,

        isSelected,
        isHeadChecked,
        isHeadIndeterminate,
        toggle,
        toggleHead
    };
};

export default useGroupSelection;