export const iconMap = {
    'profile-2user': '/icon/actions/profile-2user.svg',
    'home': '/icon/actions/home.svg',
    'document': '/icon/actions/document.svg',
    'calendar': '/icon/actions/calendar.svg',
};

export interface NavItemProps {
    iconType: keyof typeof iconMap;
    href: string;
    isActive?: boolean;
}



