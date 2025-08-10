"use client";

import Loader from "@/components/common/Loader";
import TagGetModel from "@/types/tags/TagGetModel";
import useDbSelect from "@/utils/hooks/useDbSelect";
import usePrimaryShade from "@/utils/hooks/usePrimaryShade";

import { Paper, Table, Transition, useMantineTheme } from "@mantine/core";
import { useEffect } from "react";
import { t } from "i18next";

const Page = () => {
    const {
        data: tags,
        call: getTags
    } = useDbSelect<(TagGetModel & { domainsCount: number; })[]>({
        query: `
            SELECT
                t.*,
                (
                    SELECT COUNT(dtr.id)
                    FROM domainTagRelations dtr
                    WHERE dtr.tagId = t.id
                ) as domainsCount
            FROM tags t;
        `
    });

    useEffect(() => {
        getTags();
    }, []);

    const mantineTheme = useMantineTheme();
    const shadeIndexer = usePrimaryShade();

    return (
        <main className="w-full h-full relative overflow-hidden">
            <h1 className="sr-only">
                {t("tags.Tags")}
            </h1>

            <Transition mounted={!!tags} transition="fade-up">
                {style => (
                    <div className="w-full h-full p-2 flex flex-col gap-2 overflow-auto" style={style}>
                        <div className="">
                            
                        </div>

                        <Paper withBorder shadow="sm">
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Td>
                                            {t("common.Name")}
                                        </Table.Td>

                                        <Table.Td aria-hidden>
                                            {t("common.Color")}
                                        </Table.Td>

                                        <Table.Td>
                                            {t("domains.Domains")}
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Thead>

                                <Table.Tbody>
                                    {tags?.map(tag => (
                                        <Table.Tr key={tag.id}>
                                            <Table.Td>
                                                {tag.name}
                                            </Table.Td>

                                            <Table.Td aria-hidden>
                                                <svg style={{ width: "1rem" }} viewBox="0 0 10 10">
                                                    <circle
                                                        cx={5}
                                                        cy={5}
                                                        r="5"
                                                        fill={mantineTheme.colors[tag.color][shadeIndexer]}
                                                    />
                                                </svg>
                                            </Table.Td>

                                            <Table.Td>
                                                {tag.domainsCount}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Paper>
                    </div>
                )}
            </Transition>

            <Transition mounted={!tags} transition="fade-up">
                {style => (
                    <div className="w-full h-full top-0 left-0 flex justify-center items-center absolute" style={style}>
                        <Loader />
                    </div>
                )}
            </Transition>
        </main>
    );
};

export default Page;