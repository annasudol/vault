import { Link } from '@nextui-org/react';

import { AppConfig } from '@/config/AppConfig';

const Footer = () => (
  <footer className="mx-auto max-w-screen-lg p-4 text-center">
    <div className="mx-auto flex-col items-center justify-center">
      <p className="py-1 ">
        Developped by{' '}
        <Link isExternal href={AppConfig.author_git}>
          {AppConfig.author}
        </Link>
        .
      </p>
      <Link isExternal showAnchorIcon href={AppConfig.url}>
        Visit source code on GitHub.
      </Link>
    </div>
  </footer>
);

export { Footer };
