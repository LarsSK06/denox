"use client";

import HTTPMethod from "@/types/http/HTTPMethod";
import snakeToCamelCase from "../functions/snakeToCamelCase";

import { fetch } from "@tauri-apps/plugin-http";
import { useState } from "react";
import { useProfileContext } from "../contexts/useProfileContext";

type UseHttpClientOptions<ResponseBody, RequestBody> = {
    endpoint: any;
    method?: HTTPMethod;
    baseUrl?: string;
    body?: RequestBody;
    process?: (body?: any) => ResponseBody;
    credentials?: {
        token: string;
        secret: string;
    }
};

const useHttpClient = <ResponseBody, RequestBody = undefined>(options: UseHttpClientOptions<ResponseBody, RequestBody> | ((...params: any[]) => UseHttpClientOptions<ResponseBody, RequestBody>)) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<ResponseBody | null>(null);

    const { profile } = useProfileContext();

    const token = profile?.token ?? null;
    const secret = profile?.secret ?? null;

    const call = async (...params: any[]) => new Promise<ResponseBody>((resolve, reject) => {
        setIsLoading(true);

        const {
            endpoint,
            method = "GET",
            baseUrl = "https://api.domeneshop.no/v0",
            body,
            process,
            credentials
        } =
            typeof options === "function"
                ? options(params)
                : options;

        const address = [
            baseUrl,
            ...(
                endpoint instanceof Array
                    ? endpoint
                    : [endpoint]
            )
        ].map(i => `${i}`).join("/");

        fetch(address, {
            method,
            headers: {
                authorization: "Basic " + btoa(`${credentials?.token ?? token}:${credentials?.secret ?? secret}`)
            },
            body: body && JSON.stringify(body)
        }).then(async response => {
            if (!response.ok) {
                const json = await response.json();

                console.log(`
                    URL:
                    ${address}

                    request body:
                    ${JSON.stringify(body, null, 4)}

                    response body:
                    ${JSON.stringify(json, null, 4)}    
                `);

                reject(json.code);
            }
            else {
                response.text().then(text => {
                    try {
                        const json = JSON.parse(text);

                        const formattedJson = (
                            process?.(snakeToCamelCase(json)) ??
                            snakeToCamelCase(json)
                        ) as ResponseBody;

                        resolve(formattedJson);
                        setData(formattedJson);
                    }
                    catch {
                        const processedText = (
                            process?.(text) ??
                            text
                        ) as ResponseBody;

                        resolve(processedText);
                        setData(processedText);
                    }
                }).catch(async error => {
                    console.log(`Response text error:\n${error}`);
    
                    const text = await response.text();
                    
                    resolve(text as ResponseBody);
                    setData(text as ResponseBody);
                });
            }
        }).catch(_ => {
            reject("Fetch error");
        }).finally(() => setIsLoading(false));
    });

    return { isLoading, data: isLoading ? null : data, setData, call };
};

export default useHttpClient;