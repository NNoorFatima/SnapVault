import React, { useEffect, useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { initLocalization } from './src/localization/i18n';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import store from './src/store/store';
import apiFactory from './src/api/ApiFactory';

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Starting app initialization...');
        
        // Initialize localization
        console.log('Starting localization init...');
        await initLocalization();
        console.log('Localization initialized');
        
        // Initialize API factory
        console.log('Starting API factory initialization...');
        const apiResult = await apiFactory.initialize('development') as any;
        console.log('API Factory initialized:', {
          isAuthenticated: apiResult.isAuthenticated,
          environment: apiResult.environment,
          userData: apiResult.userData
        });
        
        setIsReady(true);
        console.log('App initialization completed successfully');
      } catch (error) {
        console.error('App initialization failed:', error);
        // Still set ready to true to show the app, but with error state
        setIsReady(true);
      }
    };

    initializeApp();
  }, []);

  if (!isReady) {
    console.log('Waiting for app initialization...');
    return null;
  }

  console.log('App ready, rendering navigator...');
  return (
    <Provider store={store}>
      <AppNavigator />
      <Toast />
    </Provider>
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
