import React, { ReactNode, ElementType } from 'react';

type ISectionProps = {
  title?: string;
  description?: string;
  yPadding?: string;
  children: ReactNode;
  component?: ElementType; // Allows specifying the type of element to render
};

const Section = ({
  title,
  description,
  yPadding = 'py-4',
  children,
  component: Component = 'div',
}: ISectionProps) => {
  return (
    <Component className={`mx-auto max-w-screen-lg px-3 ${yPadding}`}>
      {(title || description) && (
        <div className="mb-12 text-center">
          {title && (
            <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
          )}
          {description && (
            <div className="mt-4 text-xl md:px-20">{description}</div>
          )}
        </div>
      )}

      {children}
    </Component>
  );
};

export { Section };
