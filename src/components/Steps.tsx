'use client';

import { cn } from '@nextui-org/react';
import { useControlledState } from '@react-stately/utils';
import { color, domAnimation, LazyMotion, m } from 'framer-motion';
import type { ComponentProps } from 'react';
import React, { useRef } from 'react';

import type { StepType } from '@/types';

export type StepProps = {
  title?: React.ReactNode;
  className?: string;
  type: StepType;
};

export interface StepsProps extends React.HTMLAttributes<HTMLButtonElement> {
  steps?: StepProps[];
  currentStep?: number;
  defaultStep?: number;
  hideProgressBars?: boolean;
  className?: string;
  stepClassName?: string;
  onStepChange?: (stepIndex: number) => void;
}

function CheckIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <m.path
        animate={{ pathLength: 1 }}
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        transition={{
          delay: 0.2,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3,
        }}
      />
    </svg>
  );
}

const Steps = React.forwardRef<HTMLButtonElement, StepsProps>(
  ({
    steps = [],
    defaultStep = 0,
    onStepChange,
    currentStep: currentStepProp,
    hideProgressBars = false,
    stepClassName,
    className,
  }) => {
    const [currentStep] = useControlledState(
      currentStepProp,
      defaultStep,
      onStepChange,
    );

    const colors = React.useMemo(() => {
      const userColor = '[--step-color:hsl(var(--nextui-primary))]';
      const fgColor = '[--step-fg-color:hsl(var(--nextui-primary-foreground))]';

      const colorsVars = [
        '[--active-fg-color:var(--step-fg-color)]',
        '[--active-border-color:var(--step-color)]',
        '[--active-color:var(--step-color)]',
        '[--complete-background-color:var(--step-color)]',
        '[--complete-border-color:var(--step-color)]',
        '[--inactive-border-color:hsl(var(--nextui-default-300))]',
        '[--inactive-color:hsl(var(--nextui-default-300))]',
      ];

      if (!className?.includes('--step-fg-color')) colorsVars.unshift(fgColor);
      if (!className?.includes('--step-color')) colorsVars.unshift(userColor);
      if (!className?.includes('--inactive-bar-color'))
        colorsVars.push(
          '[--inactive-bar-color:hsl(var(--nextui-default-300))]',
        );

      return colorsVars;
    }, [color, className]);
    const ref = useRef<HTMLDivElement | null>(null);

    return (
      <div
        aria-label="Progress"
        className="-my-4 max-w-fit overflow-x-auto py-4"
      >
        <ol
          className={cn('flex flex-row flex-nowrap gap-x-2', colors, className)}
        >
          {steps?.map((step, stepIdx) => {
            let status;
            if (currentStep === stepIdx + 1) {
              status = 'active';
            } else if (currentStep < stepIdx + 1) {
              status = 'inactive';
            } else {
              status = 'complete';
            }

            return (
              <li
                key={stepIdx}
                className="relative flex w-full items-center pr-1 sm:pr-6 lg:pr-8"
              >
                <div
                  ref={ref}
                  key={stepIdx}
                  aria-current={status === 'active' ? 'step' : undefined}
                  className={cn(
                    'group flex w-full flex-row items-center justify-center gap-x-1 rounded-large py-2.5',
                    stepClassName,
                  )}
                >
                  <div className="h-ful relative flex items-center whitespace-nowrap">
                    <LazyMotion features={domAnimation}>
                      <m.div animate={status} className="relative">
                        <m.div
                          className={cn(
                            'relative flex h-[34px] w-[34px] items-center justify-center rounded-full border-medium text-large font-semibold text-default-foreground',
                            {
                              'shadow-lg': status === 'complete',
                            },
                          )}
                          initial={false}
                          transition={{ duration: 0.25 }}
                          variants={{
                            inactive: {
                              backgroundColor: 'transparent',
                              borderColor: 'var(--inactive-border-color)',
                              color: 'var(--inactive-color)',
                            },
                            active: {
                              backgroundColor: 'transparent',
                              borderColor: 'var(--active-border-color)',
                              color: 'var(--active-color)',
                            },
                            complete: {
                              backgroundColor:
                                'var(--complete-background-color)',
                              borderColor: 'var(--complete-border-color)',
                            },
                          }}
                        >
                          <div className="flex items-center justify-center">
                            {status === 'complete' ? (
                              <CheckIcon className="size-6 text-[var(--active-fg-color)]" />
                            ) : (
                              <span>{stepIdx + 1}</span>
                            )}
                          </div>
                        </m.div>
                      </m.div>
                    </LazyMotion>
                  </div>
                  <div className="max-w-full flex-1 text-start">
                    <div
                      className={cn(
                        'text-small font-medium text-default-foreground transition-[color,opacity] duration-300 group-active:opacity-80 lg:text-medium whitespace-nowra',
                        {
                          'text-default-500': status === 'inactive',
                        },
                      )}
                    >
                      <span className="whitespace-nowrap text-xs sm:mx-1 sm:text-sm">
                        {' '}
                        {step.title}
                      </span>
                    </div>
                  </div>
                  {stepIdx < steps.length - 1 && !hideProgressBars && (
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute right-0 w-0 flex-none items-center sm:w-6 lg:w-8"
                      style={{
                        // @ts-ignore
                        '--idx': stepIdx,
                      }}
                    >
                      <div
                        className={cn(
                          'relative h-0.5 w-full bg-[var(--inactive-bar-color)] transition-colors duration-300',
                          "after:absolute after:block after:h-full after:w-0 after:bg-[var(--active-border-color)] after:transition-[width] after:duration-300 after:content-['']",
                          {
                            'after:w-full': stepIdx < currentStep,
                          },
                        )}
                      />
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    );
  },
);

Steps.displayName = 'Steps';

export default Steps;
