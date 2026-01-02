import { HeaderActions } from "./HeaderActions";
import { ResponsiveHeaderProps } from "../props/responsiveHeader-props";

export function ResponsiveHeader({ title, onGoBack, onNotification }: ResponsiveHeaderProps) {
    const handleGoBack = onGoBack || (() => window.history.back());
    const handleNotification = onNotification || (() => {});
    return (
        <>
            <div className="lg:hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative flex items-center justify-between pb-6">
                        <HeaderActions
                            variant="mobile"
                            onGoBack={handleGoBack}
                        />

                        <h1 className="text-base font-semibold absolute left-1/2 transform -translate-x-1/2">
                            {title}
                        </h1>

                        <HeaderActions
                            variant="mobile"
                            onNotification={handleNotification}
                        />
                    </div>
                </div>
            </div>

            <div className="hidden lg:block">
                <div className="fixed top-12 left-[50px] z-20">
                    <HeaderActions
                        variant="desktop"
                        onGoBack={onGoBack || (() => window.history.back())}
                    />
                </div>

                <div className="fixed top-[6rem] left-[50px] z-20">
                    <h1 className="text-xl font-semibold">{title}</h1>
                </div>

                <div className="fixed top-12 right-[50px] z-20">
                    <HeaderActions
                        variant="desktop"
                        onNotification={onNotification || (() => {})}
                    />
                </div>
            </div>
        </>
    );
}
