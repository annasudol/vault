import Link from 'next/link';

import { Logo } from '@/components/Logo';
import { Section } from '@/components/Section';
import { AppConfig } from '@/utils/AppConfig';

const Footer = () => (
  <div>
    <Section component="footer">
      <Logo size="sm" />
      <p className="py-1 text-xs">
        {AppConfig.title}. Made by{' '}
        <Link href={AppConfig.author_git}>{AppConfig.author}</Link>.
      </p>
    </Section>
  </div>
);

export { Footer };
