import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { AppConfig } from '@/utils/AppConfig';
import { Section } from '@/components/Section';
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
