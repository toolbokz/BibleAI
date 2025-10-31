// src/screens/Auth/LoginScreen.tsx

import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import authService from '../../services/auth/authService';
import { COLORS } from '../../constants';

type Props = StackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setIsLoading(true);
            await authService.signIn(email, password);
            // onLoginSuccess is handled by the auth state listener in AppNavigator
        } catch (err: any) {
            setError(err.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setIsLoading(true);
            await authService.resetPassword(email);
            setError('');
            Alert.alert('Success', 'Password reset email sent! Check your inbox.');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestAccess = async () => {
        try {
            setIsLoading(true);
            await authService.signInAnonymously();
            // onLoginSuccess is handled by the auth state listener in AppNavigator
        } catch (err: any) {
            setError(err.message || 'Failed to continue as guest');
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Bible AI</Text>
                    <Text style={styles.subtitle}>
                        Your Personal Bible Study Companion
                    </Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        style={styles.input}
                        left={<TextInput.Icon icon="email" />}
                    />

                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        style={styles.input}
                        left={<TextInput.Icon icon="lock" />}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? 'eye-off' : 'eye'}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                    />

                    {error ? (
                        <HelperText type="error" visible={!!error}>
                            {error}
                        </HelperText>
                    ) : null}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.loginButton}
                    >
                        Login
                    </Button>

                    <TouchableOpacity onPress={handleForgotPassword}>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <Button
                        mode="outlined"
                        onPress={() => navigation.navigate('Register')}
                        style={styles.registerButton}
                    >
                        Create New Account
                    </Button>

                    <Button
                        mode="text"
                        onPress={handleGuestAccess}
                        style={styles.guestButton}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Continue as Guest
                    </Button>
                </View>

                <Text style={styles.footer}>
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center'
    },
    header: {
        alignItems: 'center',
        marginBottom: 32
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 16
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center'
    },
    form: {
        width: '100%'
    },
    input: {
        marginBottom: 16
    },
    loginButton: {
        marginTop: 8,
        paddingVertical: 8
    },
    forgotPassword: {
        color: COLORS.primary,
        textAlign: 'center',
        marginTop: 16,
        fontSize: 14
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border
    },
    dividerText: {
        marginHorizontal: 16,
        color: COLORS.textSecondary,
        fontSize: 14
    },
    registerButton: {
        marginBottom: 12
    },
    guestButton: {
        marginTop: 8
    },
    footer: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 24
    }
});

export default LoginScreen;
