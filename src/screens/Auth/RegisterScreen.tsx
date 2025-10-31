// src/screens/Auth/RegisterScreen.tsx

import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { Text, TextInput, Button, HelperText, Checkbox } from 'react-native-paper';
import authService from '../../services/auth/authService';

interface RegisterScreenProps {
    onRegisterSuccess: () => void;
    onNavigateToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({
    onRegisterSuccess,
    onNavigateToLogin
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const handleRegister = async () => {
        setError('');

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!agreeToTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        try {
            setIsLoading(true);
            await authService.signUp(email, password, name);
            onRegisterSuccess();
        } catch (err: any) {
            setError(err.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>
                        Join thousands of Bible study enthusiasts
                    </Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                        autoCapitalize="words"
                        style={styles.input}
                        left={<TextInput.Icon icon="account" />}
                    />

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

                    <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="outlined"
                        secureTextEntry={!showConfirmPassword}
                        autoCapitalize="none"
                        style={styles.input}
                        left={<TextInput.Icon icon="lock-check" />}
                        right={
                            <TextInput.Icon
                                icon={showConfirmPassword ? 'eye-off' : 'eye'}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        }
                    />

                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            status={agreeToTerms ? 'checked' : 'unchecked'}
                            onPress={() => setAgreeToTerms(!agreeToTerms)}
                        />
                        <Text style={styles.checkboxText}>
                            I agree to the{' '}
                            <Text style={styles.link}>Terms of Service</Text> and{' '}
                            <Text style={styles.link}>Privacy Policy</Text>
                        </Text>
                    </View>

                    {error ? (
                        <HelperText type="error" visible={!!error}>
                            {error}
                        </HelperText>
                    ) : null}

                    <Button
                        mode="contained"
                        onPress={handleRegister}
                        loading={isLoading}
                        disabled={isLoading}
                        style={styles.registerButton}
                    >
                        Create Account
                    </Button>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <Button mode="text" onPress={onNavigateToLogin}>
                            Login
                        </Button>
                    </View>
                </View>

                <View style={styles.benefits}>
                    <Text style={styles.benefitsTitle}>What you'll get:</Text>
                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>✓</Text>
                        <Text style={styles.benefitText}>
                            AI-powered Bible study assistant
                        </Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>✓</Text>
                        <Text style={styles.benefitText}>
                            Access to multiple Bible versions
                        </Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>✓</Text>
                        <Text style={styles.benefitText}>
                            Voice chat and text-to-speech
                        </Text>
                    </View>
                    <View style={styles.benefitItem}>
                        <Text style={styles.benefitIcon}>✓</Text>
                        <Text style={styles.benefitText}>
                            Sync across all your devices
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    scrollContent: {
        padding: 24
    },
    header: {
        marginBottom: 24
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6200ee',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 16,
        color: '#666'
    },
    form: {
        width: '100%',
        marginBottom: 24
    },
    input: {
        marginBottom: 16
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
    },
    checkboxText: {
        flex: 1,
        fontSize: 14,
        color: '#666'
    },
    link: {
        color: '#6200ee',
        fontWeight: '600'
    },
    registerButton: {
        marginTop: 8,
        paddingVertical: 8
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16
    },
    loginText: {
        fontSize: 14,
        color: '#666'
    },
    benefits: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16
    },
    benefitsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    benefitIcon: {
        fontSize: 20,
        color: '#6200ee',
        marginRight: 12
    },
    benefitText: {
        fontSize: 14,
        color: '#666'
    }
});

export default RegisterScreen;