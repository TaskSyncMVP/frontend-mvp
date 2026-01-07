export interface CookieOptions {
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

const isSecureContext = (): boolean => {
    if (typeof window === 'undefined') return true;
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};

export const cookies = {
    set: (name: string, value: string, options: CookieOptions = {}) => {
        if (typeof document === 'undefined') {
            return; // SSR safety
        }

        const {
            maxAge,
            expires,
            path = '/',
            domain,
            secure = isSecureContext(),
            sameSite = 'lax'
        } = options;

        let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}; sameSite=${sameSite}`;

        if (maxAge) {
            cookieString += `; max-age=${maxAge}`;
        }

        if (expires) {
            cookieString += `; expires=${expires.toUTCString()}`;
        }

        if (domain) {
            cookieString += `; domain=${domain}`;
        }

        if (secure) {
            cookieString += `; secure`;
        }

        // Note: httpOnly cannot be set from client-side JavaScript
        // It should be set by the server when setting auth tokens

        document.cookie = cookieString;
    },

    get: (name: string): string | null => {
        if (typeof document === 'undefined') {
            return null; // SSR safety
        }

        if (!name || typeof name !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(name)) {
            return null;
        }

        const nameEQ = name + '=';
        const ca = document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    },

    remove: (name: string, options: CookieOptions = {}) => {
        if (typeof document === 'undefined') {
            return; // SSR safety
        }

        const { path = '/', domain } = options;
        let cookieString = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

        if (domain) {
            cookieString += `; domain=${domain}`;
        }

        document.cookie = cookieString;
    },

    getAll: (): Record<string, string> => {
        if (typeof document === 'undefined') {
            return {}; // SSR safety
        }

        const cookies: Record<string, string> = {};
        const ca = document.cookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            const eqIndex = c.indexOf('=');
            if (eqIndex !== -1) {
                const name = c.substring(0, eqIndex);
                const value = decodeURIComponent(c.substring(eqIndex + 1));
                cookies[name] = value;
            }
        }

        return cookies;
    }
};