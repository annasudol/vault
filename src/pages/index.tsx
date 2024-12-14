import React from 'react';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

const Index = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="container mx-auto max-w-3xl grow">app</main>
    <Footer />
  </div>
);

export default Index;
