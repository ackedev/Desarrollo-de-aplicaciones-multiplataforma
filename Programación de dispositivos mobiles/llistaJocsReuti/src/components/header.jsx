import { Text, View } from 'react-native';

export default function Header() {
  return (
    <View
      style={{
        backgroundColor: '#12355b',
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'black',
      }}>
      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
        El mejor header del mundo
      </Text>
    </View>
  );
}
