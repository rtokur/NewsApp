import { CircleButton } from '@/src/components/CircleButton';
import { router, Stack } from "expo-router";
export default function RootLayout() {
  return (
  <Stack 
  screenOptions={{
    headerLeft: () => (
      <CircleButton 
      icon='menu'
      onPress={() => console.log('Menu button pressed')}/>
      ),
    headerRight: () => (
      <>
      <CircleButton
      icon='search'
      onPress={() => router.push('/search')}
      style={{marginRight: 10}}/>

      <CircleButton 
      icon='bell'
      onPress={() => router.push('/notifications')}/>
      </>
    ),
    headerTitle: '',
  }}
  >
  </Stack>
);
}
