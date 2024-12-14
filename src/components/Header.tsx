import { Background } from './background/Background';
import { Section } from '@/components/Section';
import { Navbar } from '@/components/navigation/Navbar';

const Header = () => (
  <Background color="bg-gray-400">
    <Section yPadding="py-6" component="header">
      <Navbar />
    </Section>
  </Background>
);

export { Header };
