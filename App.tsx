import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { initLocalization } from './src/localization/i18n';
import Toast from 'react-native-toast-message';
export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('Starting localization init...');
    initLocalization()
      .then(() => {
        console.log('Localization initialized');
        // i18n.changeLanguage('en'); // or 'en'
        setIsReady(true);
      })
      .catch((err) => {
        console.error('Localization failed:', err);
      });
  }, []);

  if (!isReady) {
    console.log('Waiting for i18n...');
    return null;
  }

  console.log('App ready, rendering navigator...');
  return (
    <>
      <AppNavigator />
      <Toast />
    </>
  );
}


// export default function App() {
//   return (
//     <>
//       <AppNavigator />
//       <Toast />
//     </>
//   );
// }
