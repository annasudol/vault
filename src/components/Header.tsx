import { Navbar } from '@/components/navigation/Navbar';
import { Section } from '@/components/Section';

import { Background } from './background/Background';

const Header = () => (
  <Background color="bg-gray-400">
    <Section yPadding="py-6" component="header">
      <Navbar />
    </Section>
  </Background>
);

export { Header };
