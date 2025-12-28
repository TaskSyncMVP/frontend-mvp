import Image from "next/image";
import Link from "next/link";
import { iconMap, NavItemProps } from "../props/navItem-props";

export function NavItem({ iconType, href }: NavItemProps) {
    return (
        <Link
            href={href}
            className="w-10 h-10 flex items-center justify-center text-primary bg-primary-30 rounded-lg"
        >
            <Image
                src={iconMap[iconType]}
                alt={iconType}
                width={24}
                height={24}
                style={{filter: 'var(--primary-filter'}}
                className="filter-primary"/>
        </Link>
    )
}