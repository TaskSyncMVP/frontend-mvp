import {LinkButton} from "@shared/ui";

export function MainPage() {
    return (
        <div>
            <h1 className="text-lg font-semibold text-center mb-1">Task Sync</h1>
            <h3 className="text-sm text-muted text-center font-regular max-w-md mx-auto mb-8">
                This productive tool is designed to help
                <br/> you better manage your task
                <br/> project-wise conveniently!
            </h3>
            <LinkButton
                href="/login"
                className="w-full bg-primary-100 text-secondary hover:shadow-largeDrop inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md transition duration-200 h-14 px-4 py-2"
            >
                Let's Start
            </LinkButton>
        </div>
    );
}