import { AppConfig } from '@/config/AppConfig';

const MainHeader = () => (
  <header className="bg-slate-200">
    <div className="mx-auto my-12 max-w-screen-lg">
      <div className="mx-8 mb-12 text-center">
        <h1 className="text-center text-4xl font-bold">{AppConfig.title}</h1>
        <div className="mt-4 text-xl md:px-20">{AppConfig.description}</div>
      </div>
    </div>
  </header>
);

export { MainHeader };
