import Image from "next/image";
import { Button } from "@shared/ui";

interface MenuButtonProps {
    icon: string;
    alt: string;
    children: React.ReactNode;
}

export function MenuButton({ icon, alt, children }: MenuButtonProps) {
    return (
        <Button variant="secondary" className="flex items-center gap-2 py-5">
            <Image
                src={icon}
                alt={alt}
                width={24}
                height={24}
            />
            {children}
        </Button>
    );
}
