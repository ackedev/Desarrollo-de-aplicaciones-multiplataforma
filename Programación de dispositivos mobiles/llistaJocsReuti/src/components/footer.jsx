import { Text, View } from 'react-native';

export default function Footer() {
  return (
    <View
      style={{
        backgroundColor: '#12355b',
        padding: 20,
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'black',
      }}>
      <Text style={{ color: 'white' }}>Footer para nada genérico</Text>
    </View>
  );
}
