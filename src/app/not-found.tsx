import {
    Input, Button, TaskCheckbox, Badge, Label, Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@shared/ui";
import {Navbar} from "@widgets/navbar";
import {Check} from "lucide-react";

export default function Page() {
    return (
        <div className="px-5">
            <div className="grid grid-cols-1 gap-3 max-w-2xl">
                <h1 className="text-2xl">Error Page</h1>
                <div className='flex flex-1 gap-1 max-w-2xl'>
                    <Input type='input' placeholder="Email"/>
                    <Input type='password' placeholder="Password"/>
                </div>
                <Button>Lets</Button>
                <Button variant='secondary' size='lg'>Lets</Button>

                <Button variant="primary" size='lg'>Primary</Button>
                <div className='flex gap-2'>
                    <TaskCheckbox level="high"/>
                    <TaskCheckbox level="high"/>
                    <TaskCheckbox level="low"/>
                    <TaskCheckbox level="low"/>
                    <TaskCheckbox level="medium"/>
                    <TaskCheckbox level="medium"/>
                </div>
                <div className='inline-flex gap-2'>
                    <Badge variant="low">Low</Badge>
                    <Badge variant="medium">Medium</Badge>
                    <Badge variant="high">High</Badge>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Task</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 gap-2">
                                <div className="flex gap-2 flex-col">
                                    <Label>Name</Label>
                                    <Input placeholder="Name"/>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <h1 className="text-sm">Priority</h1>
                                    <div className='inline-flex gap-2'>
                                        <Badge variant="low">Low</Badge>
                                        <Badge variant="medium">Medium</Badge>
                                        <Badge variant="high">High</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center gap-2">
                            <Button className="w-1/3 rounded-soft">
                                <Check/>
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
                <Navbar/>
            </div>
        </div>
    )
}