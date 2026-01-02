import Image from "next/image";
import {LinkButton} from "@shared/ui";

interface MenuButtonProps {
    icon: string;
    alt: string;
    children: React.ReactNode;
    href: string;
}

export function MenuButton({icon, alt, children, href}: MenuButtonProps) {
    return (
        <LinkButton
            href={href}
            className="flex gap-2 lg:py-4 lg:text-base lg:px-8 bg-secondary text-secondary-foreground items-center
             text-sm font-semibold shadow-md hover:shadow-lg rounded-md px-6 py-3"
        >
            <Image
                src={icon}
                alt={alt}
                width={24}
                height={24}
            />
            {children}
        </LinkButton>
    );
}
