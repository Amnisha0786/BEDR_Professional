'use client';

import { InfoIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      icons={{
        success: <InfoIcon color='green' size={16} />,
        error: <InfoIcon color='red' size={16} />,
        warning: <InfoIcon color='orange' size={16} />,
        info: <InfoIcon color='blue' size={16} />,
      }}
      closeButton
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group flex items-baseline toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          title: 'text-[15px]',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground ',
          cancelButton:
            'group-[.toast]:bg-white group-[.toast]:text-primary bg-primary',
          success: 'text-green-400',
          error: 'text-red-400',
          warning: 'text-yellow-400',
          info: 'bg-blue-400',
          closeButton: 'bg-white text-primary right-0',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
