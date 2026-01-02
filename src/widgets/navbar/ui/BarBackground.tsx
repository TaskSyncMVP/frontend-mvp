export function BarBackground() {
    return (
        <svg
            viewBox="0 0 375 56"
            className="absolute inset-x-0 bottom-0 w-full h-full"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                filter: 'drop-shadow(0px -2px 10px rgba(0, 0, 0, 0.1))'
            }}
        >
            <path
                d="M0 22C0 9.84974 9.84974 0 22 0H93.5H141C141 0 145.5 0 154 0C164.148 0 162 27 187.5 27C214.5 27
                210.735 -5.64924e-06 220.5 0C229 4.91738e-06 233.5 0 233.5 0H282.5H353C365.15 0 375 9.84974 375
                22V56H0V22Z"
                fill="var(--primary-30)"
            />
        </svg>
    );
}