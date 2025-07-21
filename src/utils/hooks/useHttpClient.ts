import HTTPMethod from "@/types/http/HTTPMethod";

import { fetch } from "@tauri-apps/plugin-http";
import { useState } from "react";
import { useProfileContext } from "../contexts/useProfileContext";
import snakeToCamelCase from "../functions/snakeToCamelCase";

type UseHttpClientOptions<ResponseBody, RequestBody> = {
    endpoint: any;
    method?: HTTPMethod;
    baseUrl?: string;
    body?: RequestBody;
    process?: (body?: any) => ResponseBody;
};

const useHttpClient = <ResponseBody extends {}, RequestBody = undefined>({
    endpoint,
    method = "GET",
    baseUrl = "https://api.domeneshop.no/v0",
    body,
    process
}: UseHttpClientOptions<ResponseBody, RequestBody>) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<ResponseBody | null>(null);

    const { profile: { token, secret } } = useProfileContext();

    const call = async () => new Promise<ResponseBody>((resolve, reject) => {
        setIsLoading(true);

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
            if (!response.ok) return reject();

            response.json().then(json => {
                const formattedJson =
                    process?.(snakeToCamelCase<ResponseBody>(json)) ??
                    snakeToCamelCase<ResponseBody>(json);

                resolve(formattedJson);
                setData(formattedJson);
            }).catch(_ => {
                reject();
            })
        }).catch(_ => {
            reject();
        }).finally(() => setIsLoading(false));
    });

    return { isLoading, data, call };
};

export default useHttpClient;