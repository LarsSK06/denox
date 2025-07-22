import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";

import { t } from "i18next";
import { IconCircle, IconCircleCheck, IconCircleX, IconLoader } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Text } from "@mantine/core";

type CredentialsTesterProps = {
    token: string;
    secret: string;
    setIsDisabled: Dispatch<SetStateAction<boolean>>;
    setIsCredentialsValid: Dispatch<SetStateAction<boolean>>;
};

const CredentialsTester = ({ token, secret, setIsDisabled, setIsCredentialsValid }: CredentialsTesterProps) => {
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [status, setStatus] = useState<"not-tested" | "loading" | "invalid" | "valid">("not-tested");

    let timeout = useRef<NodeJS.Timeout | null>(null);

    const {
        call: testCredentials
    } = useHttpClient({
        endpoint: Endpoint.Domains,
        credentials: { token, secret }
    });

    useEffect(() => {
        if (!isMounted) return setIsMounted(true);

        if (timeout.current) clearTimeout(timeout.current);

        setStatus("loading");

        timeout.current = setTimeout(() => {
            setIsDisabled(true);

            testCredentials()
                .then(() => setStatus("valid"))
                .catch(() => setStatus("invalid"))
                .finally(() => setIsDisabled(false));
        }, 2000);
    }, [token, secret]);

    useEffect(() => {
        setIsCredentialsValid(status === "valid");
    }, [status]);

    return (
        <table>
            <tbody>
                <tr>
                    <Text component="th" style={{ paddingRight: ".5rem" }}>
                        {t("profiles.CredentialsTestStatus")}:
                    </Text>

                    <td aria-live="assertive">
                        {status === "not-tested" ? (
                            <>
                                <IconCircle color="gray" aria-hidden />
                            
                                <span className="sr-only">
                                    {t("other.NotTested")}
                                </span>
                            </>
                        ) : null}

                        {status === "loading" ? (
                            <>
                                <div className="w-fit h-fit animate-ping">
                                    <IconLoader color="gray" aria-hidden />
                                </div>
                            
                                <span className="sr-only">
                                    {t("common.Loading")}
                                </span>
                            </>
                        ) : null}

                        {status === "invalid" ? (
                            <>
                                <IconCircleX color="red" aria-hidden />
                            
                                <span className="sr-only">
                                    {t("common.Invalid")}
                                </span>
                            </>
                        ) : null}

                        {status === "valid" ? (
                            <>
                                <IconCircleCheck color="green" aria-hidden />
                            
                                <span className="sr-only">
                                    {t("common.Valid")}
                                </span>
                            </>
                        ) : null}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default CredentialsTester;