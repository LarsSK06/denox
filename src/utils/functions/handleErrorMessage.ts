import { notifications } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons-react";
import { createElement } from "react";

const handleErrorMessage = (title?: string) => {
    return (error: any) => {
        notifications.show({
            title: title,
            message: `${error}`,
            color: "red",
            icon: createElement(IconAlertCircle)
        });
    };
};

export default handleErrorMessage;