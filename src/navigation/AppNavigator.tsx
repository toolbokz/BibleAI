// src/navigation/AppNavigator.tsx

import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton } from 'react-native-paper';
import authService from '../services/auth/authService';

// Import screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import BibleScreen from '../screens/Bible/BibleScreen';
import ChatScreen from '../screens/Chat/ChatScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';

import { RootStackParamList, MainTabParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: string;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Bible':
                            iconName = focused ? 'book-open' : 'book-open-outline';
                            break;
                        case 'Chat':
                            iconName = focused ? 'message' : 'message-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'account' : 'account-outline';
                            break;
                        default:
                            iconName = 'help';
                    }

                    return <IconButton icon={iconName} size={size} iconColor={color} />;
                },
                tabBarActiveTintColor: '#6200ee',
                tabBarInactiveTintColor: 'gray',
                headerStyle: {
                    backgroundColor: '#6200ee'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold'
                }
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Home' }}
            />
            <Tab.Screen
                name="Bible"
                component={BibleScreen}
                options={{ title: 'Bible' }}
            />
            <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{ title: 'AI Chat' }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{ title: 'Profile' }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
            setIsLoading(false);
        });

        return unsubscribe;
    }, []);

    if (isLoading) {
        return null; // Or a splash screen component
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#6200ee'
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold'
                    }
                }}
            >
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{ title: 'Create Account' }}
                        />
                    </>
                ) : (
                    <>
                        <Stack.Screen
                            name="Main"
                            component={MainTabs}
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name="Settings"
                            component={SettingsScreen}
                            options={{ title: 'Settings' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;