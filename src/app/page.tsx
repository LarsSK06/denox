"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {

    const router = useRouter();

    useEffect(() => {
        router.push("/domains");
    }, []);

    return <></>;
};

export default Page;