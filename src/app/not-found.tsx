'use client';

import {LinkButton} from "@shared/ui";
import {FileQuestion} from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full
                flex items-center justify-center">
                    <FileQuestion className="w-16 h-16 text-white"/>
                </div>
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Oooops!</h1>
                <p className="text-lg text-gray-600 mb-8">This page has decided to take a day off.
                </p>
                <LinkButton size="lg" href="/home">Return home</LinkButton>
            </div>
        </div>
    );
}