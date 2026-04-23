
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import StackNavigator from './src/Navegacion/Stacknavigator';


export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <StackNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});