import React from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar barStyle="light-content" backgroundColor="#6200ee" />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
