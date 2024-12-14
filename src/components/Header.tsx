import { Navbar } from '@/components/navigation/Navbar';
import { AppConfig } from '@/utils/AppConfig';

const Header = () => (
  <header className="mx-auto max-w-screen-lg p-4">
    <Navbar />
    <div className="mb-12 max-w-screen-lg text-center">
      <h1 className="text-4xl font-bold">{AppConfig.title}</h1>
      <div className="mt-4 text-xl md:px-20">{AppConfig.description}</div>
    </div>
  </header>
);

export { Header };
