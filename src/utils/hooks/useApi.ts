"use client";

import HTTPMethod from "@/types/http/HTTPMethod";

import { useState } from "react";

import * as http from "@tauri-apps/plugin-http";

type UseApiOptions<RequestBody> = {
    endpoint: string | string[];
    method?: HTTPMethod;
    subdomain?: string;
    data?: RequestBody;
};

const useApi = <ResponseBody = unknown, RequestBody = undefined>({ endpoint, method = "GET", subdomain = "api", data: requestData }: UseApiOptions<RequestBody>) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<ResponseBody | null>(null);

    const call = () => new Promise<ResponseBody>(async (resolve, reject) => {
        setIsLoading(true);

        const _token = "";
        const _secret = "";

        try {
            const address =
                (`https://` + subdomain + ".domeneshop.no/v0/") + (
                    endpoint instanceof Array
                        ? endpoint.join("/")
                        : endpoint
                );
    
            const response = await http.fetch(address, {
                method,
                headers: {
                    "Authorization": "Basic " + btoa(`${_token}:${_secret}`)
                },
                body: requestData && (
                    typeof requestData === "object"
                        ? JSON.stringify(requestData)
                        : requestData
                ) as NonNullable<Parameters<typeof fetch>[1]>["body"]
            });
    
            if (!response.ok) {
                reject();
                setData(null);
    
                return;
            }
    
            const responseBody = response.json() as ResponseBody;
    
            resolve(responseBody);
            setData(responseBody);
        }
        finally {
            setIsLoading(false);
        }
    });

    return {
        isLoading,
        data,
        call
    };
};

export default useApi;