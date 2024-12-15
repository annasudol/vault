import { AppConfig } from '@/utils/AppConfig';

const VaultHeader = () => (
  <header className="mx-auto max-w-screen-lg p-4">
    <div className="mb-12 flex max-w-screen-lg justify-between">
      <h1 className="text-4xl font-bold">{AppConfig.title}</h1>
      <div className="mt-4 text-xl md:px-20">{AppConfig.description}</div>
    </div>
  </header>
);

export { VaultHeader };
