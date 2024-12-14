import Link from 'next/link';

import { Logo } from '@/components/Logo';
import { AppConfig } from '@/utils/AppConfig';

const Footer = () => (
  <footer className="mx-auto w-full max-w-screen-lg p-4">
    <div className="flex items-center justify-center">
      <Logo size="sm" />
      <p className="py-1 text-xs">
        Developped by{' '}
        <Link href={AppConfig.author_git} className="p-1 underline">
          {AppConfig.author}
        </Link>
        .
      </p>
    </div>
  </footer>
);

export { Footer };
