"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {

    const router = useRouter();

    useEffect(() => {
        console.log("RENDERED");

        router.push("/domains");
    }, []);

    return <></>;
};

export default Page;