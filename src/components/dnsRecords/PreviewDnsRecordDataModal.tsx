import { useEffect, useState } from "react";
import { Code, Modal } from "@mantine/core";

type CreateEditDnsRecordModalProps = {
    data: string | null;
    onClose: () => unknown;
};

const CreateEditDnsRecordModal = ({ data: _data, onClose }: CreateEditDnsRecordModalProps) => {
    const [data, setData] = useState<string | null>(null);

    useEffect(() => {
        if (_data) setData(_data);
        else setTimeout(() => setData(_data), 300);
    }, [_data]);

    return (
        <Modal opened={!!_data} onClose={onClose} size="lg">
            <Code className="break-all">
                {data}
            </Code>
        </Modal>
    );
};

export default CreateEditDnsRecordModal;