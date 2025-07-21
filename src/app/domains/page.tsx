"use client";

import Check from "@/components/common/Check";
import DomainStatusChip from "@/components/domains/DomainStatusChip";
import IllustrationIcons from "@/components/illustrations/IllustrationIcons";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";
import prettifyDate from "@/utils/functions/prettifyDate";
import useHttpClient from "@/utils/hooks/useHttpClient";
import useSearchParamId from "@/utils/hooks/useSearchParamId";
import useWindowTitle from "@/utils/hooks/useWindowTitle";

import { ActionIcon, Button, Paper, SemiCircleProgress, Skeleton, Text } from "@mantine/core";
import { IconExternalLink, IconX } from "@tabler/icons-react";
import { t } from "i18next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

const Page = () => {
    const domainId = useSearchParamId({ key: "domainId", type: "number" });
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const {
        isLoading: isDomainLoading,
        data: domain,
        call: getDomain
    } = useHttpClient<DomainGetModel>({
        endpoint: [Endpoint.Domains, domainId],
        process: body => ({
            ...body,
            registeredDate: new Date(body.registeredDate),
            expiryDate: new Date(body.expiryDate)
        })
    });

    useEffect(() => {
        if (!domainId) return;

        getDomain();
    }, [domainId]);

    useWindowTitle({ title: !domain || isDomainLoading ? "..." : domain.domain });

    const domainPeriodElapsedPercentage = useMemo(() => {
        if (!domain) return 0;

        const registeredDateMs = domain.registeredDate.getTime();
        const expiryDateMs = domain.expiryDate.getTime();
        const nowMs = new Date().getTime();
        
        const rdmsToEdms = expiryDateMs - registeredDateMs; // 500
        const rdmsToNms = nowMs - registeredDateMs; // 250

        return Math.round((rdmsToNms / rdmsToEdms) * 100);
    }, [domain]);

    return (
        <div className="w-full h-full relative overflow-auto">
            {domainId ? (
                <Paper withBorder className="p-1 flex absolute top-4 right-4">
                    <ActionIcon variant="transparent" onClick={() => {
                        const before = new URLSearchParams(searchParams);

                        before.delete("domainId");
                        router.push(`${pathname}?${before}`);
                    }}>
                        <IconX />
                    </ActionIcon>
                </Paper>
            ) : null}

            {domainId ? (
                <div className="p-4 flex flex-col gap-8">
                    {!isDomainLoading && domain ? (
                        <SemiCircleProgress
                            className="mx-auto"
                            size={512}
                            value={domainPeriodElapsedPercentage}
                            label={
                                <>
                                    <span>
                                        {t("domains.PercentageOfDomainPeriodElapsed", { percentage: domainPeriodElapsedPercentage })}
                                    </span>
    
                                    <br />
    
                                    <span>
                                        <time dateTime={domain.registeredDate.toDateString()}>
                                            {prettifyDate(domain.registeredDate)}
                                        </time>
                                        {' '}
                                        -
                                        {' '}
                                        <time dateTime={domain.expiryDate.toDateString()}>
                                            {prettifyDate(domain.expiryDate)}
                                        </time>
                                    </span>
                                </>
                            }
                        />
                    ) : (
                        <Skeleton width={500} height={249} className="mx-auto mt-[7px] rounded-none rounded-t-full" />
                    )}

                    <div className="mx-auto">
                        {!isDomainLoading && domain ? (
                            <DomainStatusChip status={domain.status} />
                        ) : (
                            <Skeleton width={80} height={34.8} className="rounded-full" />
                        )}
                    </div>

                    {!isDomainLoading && domain ? (
                        <Paper withBorder shadow="sm" className="p-2">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <Text component="th" className="font-bold text-start">
                                            {t("common.Registrant")}
                                        </Text>

                                        <Text component="td" className="text-end">
                                            {domain.registrant}
                                        </Text>
                                    </tr>

                                    <tr>
                                        <Text component="th" className="font-bold text-start">
                                            {t("common.Registrar")}
                                        </Text>

                                        <td>
                                            <Check mode={domain.services.registrar ? "true" : "false"} className="ml-auto" />
                                        </td>
                                    </tr>

                                    <tr>
                                        <Text component="th" className="font-bold text-start">
                                            {t("common.DNS")}
                                        </Text>

                                        <td>
                                            <Check mode={domain.services.dns ? "true" : "false"} className="ml-auto" />
                                        </td>
                                    </tr>

                                    <tr>
                                        <Text component="th" className="font-bold text-start">
                                            {t("common.Email")}
                                        </Text>

                                        <td>
                                            <Check mode={domain.services.email ? "true" : "false"} className="ml-auto" />
                                        </td>
                                    </tr>

                                    <tr>
                                        <Text component="th" className="font-bold text-start">
                                            {t("common.Webhotel")}
                                        </Text>

                                        <td>
                                            <Check mode={domain.services.webhotel ? "true" : "false"} className="ml-auto" />
                                        </td>
                                    </tr>

                                    <tr>
                                        <Text component="th" className="font-bold text-start align-text-top">
                                            {t("common.Nameservers")}

                                            <Text component="span" c="gray">
                                                {` (${domain.nameservers.length})`}
                                            </Text>
                                        </Text>

                                        <td>
                                            <ol className="w-fit ml-auto">
                                                {domain.nameservers.map(ns => (
                                                    <li key={ns}>
                                                        {ns}
                                                    </li>
                                                ))}
                                            </ol>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </Paper>
                    ) : (
                        <Skeleton height={216.38} />
                    )}

                    <figure>
                        <Text component="figcaption" size="xl">
                            {t("common.QuickActions")}
                        </Text>

                        <ul className="mt-2 flex gap-2">
                            <li>
                                <Button
                                    component="a"
                                    href={`https://domene.shop/admin?id=${domainId}&command=renew`}
                                    rightSection={<IconExternalLink />}
                                    onClick={openInBrowserOnClick()}>
                                    {t("common.Renew")}
                                </Button>
                            </li>
                        </ul>
                    </figure>
                </div>
            ) : (
                <div className="w-full h-full flex justify-center items-center">
                   <IllustrationIcons scale={.5} />
                </div>
            )}
        </div>
    );
};

export default Page;