export interface CookieOptions {
    maxAge?: number;
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
}

export const cookies = {
    set: (name: string, value: string, options: CookieOptions = {}) => {
        const {
            maxAge,
            expires,
            path = '/',
            domain,
            secure,
            httpOnly,
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

        if (httpOnly) {
            cookieString += `; httpOnly`;
        }

        document.cookie = cookieString;
    },

    get: (name: string): string | null => {
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
        const { path = '/', domain } = options;
        let cookieString = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

        if (domain) {
            cookieString += `; domain=${domain}`;
        }

        document.cookie = cookieString;
    },

    getAll: () => {
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