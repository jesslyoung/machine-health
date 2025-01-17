import {StyleSheet} from 'react-native';
import EditScreenInfo from '../../components/sections/log-data/EditScreenInfo';
import {View} from '../../components/Themed';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.separator} />
      <EditScreenInfo path='app/(tabs)/log.tsx' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
});
