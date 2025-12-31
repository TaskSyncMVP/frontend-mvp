import Image from "next/image";
import { Button } from "@shared/ui";

interface MenuButtonProps {
    icon: string;
    alt: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export function MenuButton({ icon, alt, children, onClick }: MenuButtonProps) {
    return (
        <Button
            variant="secondary"
            className="flex gap-2 lg:py-8 lg:text-base lg:px-12 lg:gap-3"
            onClick={onClick}
        >
            <Image
                src={icon}
                alt={alt}
                width={24}
                height={24}
                className="w-6 h-6 lg:w-9 lg:h-9"
            />
            {children}
        </Button>
    );
}
