import { Link, usePathname } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';

const apartats = [
  { href: '/', title: 'Mis lugares' },
  { href: '/descobreix', title: 'Descubre' },
  { href: '/mis-ciudades', title: 'Mis ciudades' },
  { href: '/afegir', title: 'Añadir lugar' },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <SafeAreaView edges={['bottom']} style={styles.footer}>
      <View style={styles.row}>
        {apartats.map(({ href, title }) => {
          const actiu = pathname === href || (href === '/mis-ciudades' && pathname === '/ciutats');
          return (
            <Link key={href} href={href} replace asChild>
              <Pressable accessibilityRole="link" accessibilityState={{ selected: actiu }}
                style={StyleSheet.flatten([styles.item, actiu && styles.active])}>
                <Text style={[styles.label, actiu && styles.activeLabel]}>{title}</Text>
              </Pressable>
            </Link>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: '#D7E5F4' },
  row: { flexDirection: 'row', width: '100%', maxWidth: 760, alignSelf: 'center', padding: 8, gap: 4 },
  item: { flex: 1, minHeight: 52, justifyContent: 'center', padding: 6, borderRadius: 12 },
  active: { backgroundColor: '#EAF3FF' },
  label: { color: colors.text, textAlign: 'center', fontSize: 14 },
  activeLabel: { color: colors.blue, fontWeight: 'bold' },
});
