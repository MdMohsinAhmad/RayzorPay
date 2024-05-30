import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import PaymentForm from './Component/PaymentForm';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PaymentForm />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
