import React from 'react';
import {useColorScheme} from 'react-native';
import {Tabs} from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '../../constants/Colors';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Dashboard',
          tabBarIcon: ({color}) => <TabBarIcon name='dashboard' color={color} />,
        }}
      />
      <Tabs.Screen
        name='log'
        options={{
          title: 'Log Part',
          tabBarIcon: ({color}) => <TabBarIcon name='edit' color={color} />,
        }}
      />
      <Tabs.Screen
        name='history'
        options={{
            title: 'History',
            tabBarIcon: ({color}) => <TabBarIcon name='list' color={color} />,
        }}
      />
      <Tabs.Screen
        name='chart'
        options={{
            title: 'Analytics',
            tabBarIcon: ({color}) => <TabBarIcon name='bar-chart' color={color} />,
        }}
      />
      <Tabs.Screen
        name='settings'
        options={{
            title: 'Profile',
            tabBarIcon: ({color}) => <TabBarIcon name='user' color={color} />,
        }}
      />
    </Tabs>
  );
}
