export const safeStorage = {
    getItem: (key: string): string | null => {
        if (typeof window === 'undefined') {
            return null;
        }
        try {
            return sessionStorage.getItem(key);
        } catch {
            return null;
        }
    },

    setItem: (key: string, value: string): void => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            sessionStorage.setItem(key, value);
        } catch {
        }
    },

    removeItem: (key: string): void => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            sessionStorage.removeItem(key);
        } catch {
        }
    }
};