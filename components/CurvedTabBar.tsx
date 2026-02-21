import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CurvedTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CurvedTabBar({ state, descriptors, navigation }: CurvedTabBarProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { height: 100 + insets.bottom, paddingBottom: insets.bottom }]}>
      <View style={styles.curve} />
      <View style={styles.tabs}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Progress':
              iconName = 'stats-chart';
              break;
            case 'MoodChecker':
              iconName = 'happy';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            default:
              iconName = 'circle';
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              <Ionicons name={iconName as any} size={24} color={isFocused ? '#000' : '#666'} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
  },
  curve: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#B8D8F0',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 70,
    paddingHorizontal: 40,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    minWidth: 60,
  },
});