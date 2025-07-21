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
};

const useHttpClient = <ResponseBody extends {} | [], RequestBody = undefined>(options: UseHttpClientOptions<ResponseBody, RequestBody> | ((params?: any) => UseHttpClientOptions<ResponseBody, RequestBody>)) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<ResponseBody | null>(null);

    const { profile: { token, secret } } = useProfileContext();

    const call = async (params?: any) => new Promise<ResponseBody>((resolve, reject) => {
        setIsLoading(true);

        const {
            endpoint,
            method = "GET",
            baseUrl = "https://api.domeneshop.no/v0",
            body,
            process
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
                authorization: "Basic " + btoa(`${token}:${secret}`)
            },
            body: body && JSON.stringify(body)
        }).then(async response => {
            if (!response.ok) return reject(await response.json());

            response.json().then(json => {
                const formattedJson = (
                    process?.(snakeToCamelCase<ResponseBody>(json)) ??
                    snakeToCamelCase<ResponseBody>(json)
                ) as ResponseBody;

                resolve(formattedJson);
                setData(formattedJson);
            }).catch(error => {
                console.log(`JSON parse error:\n${error}`);

                resolve(null!);
            });
        }).catch(_ => {
            reject("Fetch error");
        }).finally(() => setIsLoading(false));
    });

    return { isLoading, data, setData, call };
};

export default useHttpClient;