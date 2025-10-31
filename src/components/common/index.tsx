// src/components/common/index.tsx

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    ViewStyle,
    TextStyle
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../constants';

// Loading Spinner Component
interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color = COLORS.primary,
    text
}) => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={size} color={color} />
            {text && <Text style={styles.loadingText}>{text}</Text>}
        </View>
    );
};

// Empty State Component
interface EmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    actionText?: string;
    onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'inbox',
    title,
    description,
    actionText,
    onAction
}) => {
    return (
        <View style={styles.emptyState}>
            <IconButton icon={icon} size={64} iconColor={COLORS.textSecondary} />
            <Text style={styles.emptyTitle}>{title}</Text>
            {description && (
                <Text style={styles.emptyDescription}>{description}</Text>
            )}
            {actionText && onAction && (
                <TouchableOpacity style={styles.emptyButton} onPress={onAction}>
                    <Text style={styles.emptyButtonText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// Error View Component
interface ErrorViewProps {
    error: string;
    onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry }) => {
    return (
        <View style={styles.errorContainer}>
            <IconButton icon="alert-circle" size={64} iconColor={COLORS.error} />
            <Text style={styles.errorTitle}>Oops! Something went wrong</Text>
            <Text style={styles.errorText}>{error}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// Custom Button Component
interface CustomButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'text';
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle
}) => {
    const buttonStyle = [
        styles.button,
        variant === 'outline' && styles.buttonOutline,
        variant === 'text' && styles.buttonText,
        disabled && styles.buttonDisabled,
        style
    ];

    const buttonTextStyle = [
        styles.buttonTextDefault,
        variant === 'outline' && styles.buttonOutlineText,
        variant === 'text' && styles.buttonTextOnly,
        textStyle
    ];

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <View style={styles.buttonContent}>
                    {icon && <IconButton icon={icon} size={20} iconColor="#fff" />}
                    <Text style={buttonTextStyle}>{title}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

// Card Component
interface CardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, onPress }) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container style={[styles.card, style]} onPress={onPress}>
            {children}
        </Container>
    );
};

// Divider Component
interface DividerProps {
    style?: ViewStyle;
    vertical?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
    style,
    vertical = false
}) => {
    return (
        <View
            style={[vertical ? styles.dividerVertical : styles.divider, style]}
        />
    );
};

// Badge Component
interface BadgeProps {
    text: string;
    color?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    text,
    color = COLORS.primary,
    style,
    textStyle
}) => {
    return (
        <View style={[styles.badge, { backgroundColor: color }, style]}>
            <Text style={[styles.badgeText, textStyle]}>{text}</Text>
        </View>
    );
};

// Avatar Component
interface AvatarProps {
    name: string;
    size?: number;
    uri?: string;
    backgroundColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
    name,
    size = 40,
    uri,
    backgroundColor = COLORS.primary
}) => {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);

    return (
        <View
            style={[
                styles.avatar,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor
                }
            ]}
        >
            <Text style={[styles.avatarText, { fontSize: size / 2.5 }]}>
                {initials}
            </Text>
        </View>
    );
};

// Section Header Component
interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: {
        text: string;
        onPress: () => void;
    };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    subtitle,
    action
}) => {
    return (
        <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderContent}>
                <Text style={styles.sectionTitle}>{title}</Text>
                {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
            </View>
            {action && (
                <TouchableOpacity onPress={action.onPress}>
                    <Text style={styles.sectionAction}>{action.text}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl
    },
    emptyTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.sm,
        textAlign: 'center'
    },
    emptyDescription: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg
    },
    emptyButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.md
    },
    emptyButtonText: {
        color: '#fff',
        fontSize: FONT_SIZES.md,
        fontWeight: '600'
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl
    },
    errorTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.sm,
        textAlign: 'center'
    },
    errorText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.md
    },
    retryButtonText: {
        color: '#fff',
        fontSize: FONT_SIZES.md,
        fontWeight: '600'
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary
    },
    buttonText: {
        backgroundColor: 'transparent'
    },
    buttonDisabled: {
        backgroundColor: COLORS.disabled,
        opacity: 0.6
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonTextDefault: {
        color: '#fff',
        fontSize: FONT_SIZES.md,
        fontWeight: '600'
    },
    buttonOutlineText: {
        color: COLORS.primary
    },
    buttonTextOnly: {
        color: COLORS.primary
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border
    },
    dividerVertical: {
        width: 1,
        backgroundColor: COLORS.border
    },
    badge: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.round,
        alignSelf: 'flex-start'
    },
    badgeText: {
        color: '#fff',
        fontSize: FONT_SIZES.xs,
        fontWeight: '600'
    },
    avatar: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg
    },
    sectionHeaderContent: {
        flex: 1
    },
    sectionTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.text
    },
    sectionSubtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs
    },
    sectionAction: {
        fontSize: FONT_SIZES.md,
        color: COLORS.primary,
        fontWeight: '600'
    }
});