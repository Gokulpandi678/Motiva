import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

interface PromptModalProps {
  open: boolean;
  title: string;
  label: string;
  initialValue?: string;
  confirmLabel?: string;
  isLoading?: boolean;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export function PromptModal({
  open,
  title,
  label,
  initialValue = '',
  confirmLabel = 'Save',
  isLoading = false,
  onSubmit,
  onCancel,
}: PromptModalProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSubmit(value)} isLoading={isLoading} disabled={!value.trim()}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <label className="flex flex-col gap-1.5 text-left">
        <span className="text-sm font-medium text-ink-primary">{label}</span>
        <Input
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && value.trim()) onSubmit(value);
          }}
        />
      </label>
    </Modal>
  );
}
