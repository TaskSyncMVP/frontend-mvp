interface PomodoroCircleProps {
    progress: number;
    timeDisplay: string;
    isWorkSession: boolean;
}

export function PomodoroCircle({ progress, timeDisplay, isWorkSession }: PomodoroCircleProps) {
    const radius = 95;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    const workColor = "rgba(244, 120, 184, 1)";
    const breakColor = "rgba(120, 244, 184, 1)";
    const backgroundWorkColor = "rgba(244, 120, 184, 0.15)";
    const backgroundBreakColor = "rgba(120, 244, 184, 0.15)";

    return (
        <div className="relative">
            <svg width="224" height="224" viewBox="0 0 224 224" className="transform -rotate-90">
                <circle
                    cx="112"
                    cy="112"
                    r={radius}
                    fill="none"
                    stroke={isWorkSession ? backgroundWorkColor : backgroundBreakColor}
                    strokeWidth="12"
                    style={{
                        transition: 'stroke 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                />
                <circle
                    cx="112"
                    cy="112"
                    r={radius}
                    fill="none"
                    stroke={isWorkSession ? workColor : breakColor}
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: 'stroke-dashoffset 0.2s cubic-bezier(0.25, 0.1, 0.25, 1), stroke 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'stroke-dashoffset'
                    }}
                />
            </svg>
            <div 
                className="absolute inset-0 flex items-center justify-center" 
                style={{width: '224px', height: '224px'}}
            >
                <span className="text-4xl font-black text-text-main nunito-font z-10 transition-all duration-500 ease-out">
                    {timeDisplay}
                </span>
            </div>
        </div>
    );
}