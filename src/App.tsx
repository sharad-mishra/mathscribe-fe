// src/App.tsx
import React from 'react';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import Home from '@/screens/home';
import '@/index.css';

const App: React.FC = () => (
  <MantineProvider>
    <Home />
  </MantineProvider>
);

export default App;