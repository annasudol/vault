import { Alert } from '@nextui-org/react';

interface MyAlertProps {
  message: string;
  color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export function MyAlert({ message, color }: MyAlertProps) {
  return (
    <div className="my-3 flex w-full items-center">
      <Alert color={color} title={message} />
    </div>
  );
}
