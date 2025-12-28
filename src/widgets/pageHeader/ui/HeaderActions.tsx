import Image from "next/image";
import { Button } from "@shared/ui/button";
import { HeaderActionsProps } from "../props/headerActions-props";

export function HeaderActions({ onGoBack, onNotification, variant = 'mobile' }: HeaderActionsProps) {
    const iconSize = variant === 'mobile' ? 24 : 24;

    const handleGoBack = () => {
        if (onGoBack) {
            onGoBack();
        } else {
            window.history.back();
        }
    };

    const handleNotification = () => {
        if (onNotification) {
            onNotification();
        }
    };

    return (
        <div className="flex items-center gap-4">
            {onGoBack !== undefined && (
                <Button size="icon" variant="icon" className="rotate-180" onClick={handleGoBack}>
                    <Image
                        src="/icon/actions/arrow.svg"
                        alt="Go back"
                        width={iconSize}
                        height={iconSize}
                        className="w-6 h-6"
                    />
                </Button>
            )}
            {onNotification !== undefined && (
                <Button size="icon" variant="icon" onClick={handleNotification}>
                    <Image
                        src="/icon/actions/notification.svg"
                        alt="Notifications"
                        width={iconSize}
                        height={iconSize}
                        className="w-6 h-6"
                    />
                </Button>
            )}
        </div>
    );
}



