import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@mantine/core/styles.css';
import './index.css';

import { MantineProvider } from '@mantine/core';

import App from './App';
import { theme } from './theme';
import { debugData } from './utils/debugData';
import { isEnvBrowser } from './utils/misc';

debugData([
  {
    action: 'setVisible',
    data: true,
  },
]);

if (isEnvBrowser()) {
  const root = document.getElementById('root');

  if (root) {
    root.style.backgroundImage = 'url("https://www.wikigta6.com/wp-content/uploads/2025/09/GTA-6-Wallpapers-Trailer-2-23.jpg")';
    root.style.backgroundSize = 'cover';
    root.style.backgroundRepeat = 'no-repeat';
    root.style.backgroundPosition = 'center';
  }
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <App />
    </MantineProvider>
  </StrictMode>,
);