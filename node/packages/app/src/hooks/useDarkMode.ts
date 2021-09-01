import {useColorScheme} from 'react-native';

export default function useDarkMode(): boolean {
  return useColorScheme() === 'dark';
}
