import {Button, Input} from "@shared/ui";

export function LoginPage () {
    return (
        <div>
            <h1 className="text-lg font-semibold text-center mb-3">Login</h1>
            <div className="grid grid-cols-1 gap-4">
                <form className="grid gap-3">
                    <Input placeholder='Email' type="email"/>
                    <Input placeholder="Password" type="password"/>
                </form>
                <Button variant="primary" className="w-full" size="xl">Enter</Button>
                <Button variant="link" href="/registration">Registration</Button>
            </div>
        </div>
    )
}