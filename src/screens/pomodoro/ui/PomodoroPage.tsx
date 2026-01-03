import {PageHeader} from "@/widgets";
import Image from "next/image";
import {Button} from "@shared/ui";

export function PomodoroPage() {
    return (
        <>
            <PageHeader title="Pomodoro"/>
            <div className="flex flex-col items-center gap-4 justify-center min-h-[calc(100vh-200px)]">
                <div className="relative">
                    <svg width="224" height="224" viewBox="0 0 224 224">
                        <circle
                            cx="112"
                            cy="112"
                            r="95"
                            fill="none"
                            stroke="rgba(255, 228, 242, 1)"
                            strokeWidth="12"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center" style={{width: '224px', height: '224px'}}>
                        <span className="text-4xl font-black text-text-main nunito-font z-10">17:28</span>
                    </div>
                </div>
                <div className="flex flex-row gap-2">
                    <div className='rounded-soft h-6 w-6 bg-pomodoro-timer'/>
                    <div className='rounded-soft h-6 w-6 bg-pomodoro-background'/>
                    <div className='rounded-soft h-6 w-6 bg-pomodoro-background'/>
                    <div className='rounded-soft h-6 w-6 bg-pomodoro-background'/>
                    <div className='rounded-soft h-6 w-6 bg-pomodoro-background'/>
                    <div className='rounded-soft h-6 w-6 bg-pomodoro-background'/>
                </div>
                <Button size="icon" variant="ghost">
                    <Image
                        src="/icon/actions/arrow-round.svg"
                        alt="arrow-round"
                        width={20}
                        height={22}
                    />
                </Button>
            </div>
        </>
    );
}
