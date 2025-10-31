// src/screens/Auth/LoginScreen.tsx

import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image
} from 'react-native';
import { Text, TextInput, Button, HelperText } from 'react-native-paper';
import authService from '../../services/auth/authService';

interface LoginScreenProps {
    onLoginSuccess: () => void;
    onNavigateToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
    onLoginSuccess,
    onNavigateToRegister
}) => {
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
            onLoginSuccess();
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
            alert('Password reset email sent! Check your inbox.');
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGuestAccess = () => {
        onLoginSuccess();
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
                        onPress={onNavigateToRegister}
                        style={styles.registerButton}
                    >
                        Create New Account
                    </Button>

                    <Button
                        mode="text"
                        onPress={handleGuestAccess}
                        style={styles.guestButton}
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
        backgroundColor: '#fff'
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
        color: '#6200ee',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
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
        color: '#6200ee',
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
        backgroundColor: '#e0e0e0'
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#666',
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