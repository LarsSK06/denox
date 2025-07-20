"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
    const [domainId, setDomainId] = useState<number | null>(null);

    const searchParams = useSearchParams();

    useEffect(() => {
        const domainIdSearchParamRaw = searchParams.get("domainId");

        if (!domainIdSearchParamRaw) return;

        const domainIdSearchParam = parseInt(domainIdSearchParamRaw);

        if (Number.isNaN(domainIdSearchParam)) return;

        setDomainId(domainIdSearchParam);
    }, []);

    return (
        <>{domainId ?? "Not selected"}</>
    );
};

export default Page;