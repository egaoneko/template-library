import { GestureResponderEvent } from 'react-native';

export interface TouchableProps {
  onPress?: (event: GestureResponderEvent) => void;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
}
