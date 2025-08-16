"use client";

import DomainPage from "@/components/domains/DomainPage";
import IllustrationIcons from "@/components/illustrations/IllustrationIcons";
import useSearchParam from "@/utils/hooks/useSearchParam";

const Page = () => {

    const domainId = useSearchParam({ key: "domainId", type: "number" });

    return domainId ? (
        <DomainPage key={domainId} />
    ) : (
        <div className="w-full h-full flex justify-center items-center">
            <IllustrationIcons scale={.75} />
        </div>
    );
};

export default Page;