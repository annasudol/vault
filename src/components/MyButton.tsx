import type { ButtonProps } from '@nextui-org/button';
import { Button } from '@nextui-org/button';
import {
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardBackspace,
} from 'react-icons/md';

interface MyButtonProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
  icon?: ButtonIcon;
}

enum ButtonIcon {
  ArrowRight = 'ArrowRight',
  ArrowLeft = 'ArrowLeft',
}

const buttonIcons: Record<ButtonIcon, JSX.Element> = {
  [ButtonIcon.ArrowRight]: <MdOutlineKeyboardArrowRight />,
  [ButtonIcon.ArrowLeft]: <MdOutlineKeyboardBackspace />,
};

const MyButton = ({
  children,
  icon,
  className,
  variant,
  isLoading,
  ...props
}: MyButtonProps) => {
  const buttonIcon = icon && !isLoading && buttonIcons[icon];
  return (
    <Button
      color="primary"
      variant={variant || 'solid'}
      className={className}
      isLoading={isLoading}
      {...props}
    >
      {icon === ButtonIcon.ArrowLeft && buttonIcon} {children} {buttonIcon}
    </Button>
  );
};
export { ButtonIcon, MyButton };
