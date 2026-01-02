'use client';

import {DailyPage, TasksPage} from "@/screens";

export default function Page() {
    return (
        <>
            <div className="lg:hidden">
                <DailyPage />
            </div>

            <div className="hidden lg:block">
                <TasksPage />
            </div>
        </>
    );
}