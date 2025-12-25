'use client';

import { Button } from "@shared/ui/button";
import { Input } from "@shared/ui/input";
import { Label } from "@shared/ui/label";
import { Badge } from "@shared/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@shared/ui/dialog";
import {Check, Plus} from "lucide-react";

interface CreateTaskModalProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps = {}) {
    const isControlled = isOpen !== undefined && onClose !== undefined;

    const handleClose = () => {
        if (isControlled && onClose) {
            onClose();
        }
    };

    const trigger = !isControlled ? (
        <DialogTrigger asChild>
            <Button size="sm" className="bg-primary-100 text-white hover:bg-primary-200 px-4 py-2
            rounded-lg shadow-md hover:shadow-lg transition-all duration-200">
                <span className="mr-2">
                    <Plus/>
                </span>
                Создать задачу
            </Button>
        </DialogTrigger>
    ) : null;

    return (
        <Dialog open={isControlled ? isOpen : undefined} onOpenChange={isControlled ? onClose : undefined}>
            {trigger}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Task</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-2">
                        <div className="flex gap-3 flex-col">
                            <Label>Name</Label>
                            <Input placeholder="Name"/>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <Label>Priority</Label>
                            <div className='inline-flex gap-2'>
                                <Badge variant="low">Low</Badge>
                                <Badge variant="medium">Medium</Badge>
                                <Badge variant="high">High</Badge>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center gap-2">
                    <Button onClick={handleClose} size='lg'>
                        <Check/>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
