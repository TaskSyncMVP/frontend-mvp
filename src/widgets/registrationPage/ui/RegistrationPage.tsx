import {Button, Input} from "@shared/ui";

export function RegistrationPage () {
    return (
        <div>
            <h1 className="text-lg font-semibold text-center mb-3">Registration</h1>
            <div className="grid grid-cols-1 gap-3">
                <form className="grid gap-2">
                    <Input placeholder='Email' type="email"/>
                    <Input placeholder="Password" type="password"/>
                </form>
                <Button variant="primary" className="w-full" size="xl">Enter</Button>
                <Button variant="link" href="/login">Login</Button>
            </div>
        </div>
    )
}