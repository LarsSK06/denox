import getArrayFromNumber from "@/utils/functions/getArrayFromNumber";

import { Skeleton, Table } from "@mantine/core";

type TableBodySkeletonProps = {
    rows: number;
    columns: number;
    cellHeight?: number;
};

const TableBodySkeleton = ({ rows, columns, cellHeight }: TableBodySkeletonProps) =>
    getArrayFromNumber(rows).map(x => (
        <Table.Tr key={`row-${x}`}>
            {getArrayFromNumber(columns).map(y => (
                <Table.Td className="p-0" key={`column-${x}/${y}`}>
                    <Skeleton className="w-full h-full" height={cellHeight} />
                </Table.Td>
            ))}
        </Table.Tr>
    ));

export default TableBodySkeleton;