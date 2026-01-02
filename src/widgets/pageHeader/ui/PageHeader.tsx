import { ResponsiveHeader } from "./ResponsiveHeader";
import { PageHeaderProps } from "../props/pageHeader-props";

export function PageHeader({ title, onGoBack, onNotification }: PageHeaderProps) {
    return (
        <ResponsiveHeader
            title={title}
            onGoBack={onGoBack}
            onNotification={onNotification}
        />
    );
}







