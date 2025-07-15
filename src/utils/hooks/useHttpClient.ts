import HTTPMethod from "@/types/http/HTTPMethod";
import snakeToCamelCase from "../functions/snakeToCamelCase";

import { fetch } from "@tauri-apps/plugin-http";
import { useState } from "react";

type UseHttpClientOptions<RequestBody> = {
    endpoint: any;
    method?: HTTPMethod;
    baseUrl?: string;
    body?: RequestBody;
};

const useHttpClient = <ResponseBody extends {}, RequestBody = undefined>({
    endpoint,
    method = "GET",
    baseUrl = "https://api.domeneshop.no/v0",
    body
}: UseHttpClientOptions<RequestBody>) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<ResponseBody | null>(null);

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
                authentication: ""
            },
            body: body && JSON.stringify(body)
        }).then(async response => {
            if (!response.ok) return reject();

            response.json().then(json => {
                resolve(json);
                setData(json);
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