export interface CreateTaskModalProps {
    isOpen?: boolean;
    onClose?: () => void;
    onSubmit?: () => void;
    variant?: 'default' | 'primary';
}
