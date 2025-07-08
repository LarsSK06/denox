import policy from "@/utils/csp-policy";

import { NextConfig } from "next";

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: policy
                    }
                ]
            }
        ];
    }
};

export default nextConfig;
