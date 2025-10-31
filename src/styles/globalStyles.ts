// src/styles/globalStyles.ts

import { StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants';

export const globalStyles = StyleSheet.create({
    // Containers
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background
    },
    scrollContainer: {
        flex: 1
    },
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background
    },

    // Layout
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    column: {
        flexDirection: 'column'
    },
    wrap: {
        flexWrap: 'wrap'
    },

    // Padding & Margin
    p0: { padding: 0 },
    p1: { padding: SPACING.xs },
    p2: { padding: SPACING.sm },
    p3: { padding: SPACING.md },
    p4: { padding: SPACING.lg },
    p5: { padding: SPACING.xl },

    px0: { paddingHorizontal: 0 },
    px1: { paddingHorizontal: SPACING.xs },
    px2: { paddingHorizontal: SPACING.sm },
    px3: { paddingHorizontal: SPACING.md },
    px4: { paddingHorizontal: SPACING.lg },
    px5: { paddingHorizontal: SPACING.xl },

    py0: { paddingVertical: 0 },
    py1: { paddingVertical: SPACING.xs },
    py2: { paddingVertical: SPACING.sm },
    py3: { paddingVertical: SPACING.md },
    py4: { paddingVertical: SPACING.lg },
    py5: { paddingVertical: SPACING.xl },

    m0: { margin: 0 },
    m1: { margin: SPACING.xs },
    m2: { margin: SPACING.sm },
    m3: { margin: SPACING.md },
    m4: { margin: SPACING.lg },
    m5: { margin: SPACING.xl },

    mx0: { marginHorizontal: 0 },
    mx1: { marginHorizontal: SPACING.xs },
    mx2: { marginHorizontal: SPACING.sm },
    mx3: { marginHorizontal: SPACING.md },
    mx4: { marginHorizontal: SPACING.lg },
    mx5: { marginHorizontal: SPACING.xl },

    my0: { marginVertical: 0 },
    my1: { marginVertical: SPACING.xs },
    my2: { marginVertical: SPACING.sm },
    my3: { marginVertical: SPACING.md },
    my4: { marginVertical: SPACING.lg },
    my5: { marginVertical: SPACING.xl },

    mt0: { marginTop: 0 },
    mt1: { marginTop: SPACING.xs },
    mt2: { marginTop: SPACING.sm },
    mt3: { marginTop: SPACING.md },
    mt4: { marginTop: SPACING.lg },
    mt5: { marginTop: SPACING.xl },

    mb0: { marginBottom: 0 },
    mb1: { marginBottom: SPACING.xs },
    mb2: { marginBottom: SPACING.sm },
    mb3: { marginBottom: SPACING.md },
    mb4: { marginBottom: SPACING.lg },
    mb5: { marginBottom: SPACING.xl },

    // Text Styles
    textCenter: {
        textAlign: 'center'
    },
    textLeft: {
        textAlign: 'left'
    },
    textRight: {
        textAlign: 'right'
    },
    textBold: {
        fontWeight: 'bold'
    },
    textSemiBold: {
        fontWeight: '600'
    },
    textItalic: {
        fontStyle: 'italic'
    },
    textUnderline: {
        textDecorationLine: 'underline'
    },

    // Text Sizes
    textXs: { fontSize: FONT_SIZES.xs },
    textSm: { fontSize: FONT_SIZES.sm },
    textMd: { fontSize: FONT_SIZES.md },
    textLg: { fontSize: FONT_SIZES.lg },
    textXl: { fontSize: FONT_SIZES.xl },
    textXxl: { fontSize: FONT_SIZES.xxl },
    textXxxl: { fontSize: FONT_SIZES.xxxl },

    // Headings
    h1: {
        fontSize: FONT_SIZES.heading1,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.md
    },
    h2: {
        fontSize: FONT_SIZES.heading2,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.md
    },
    h3: {
        fontSize: FONT_SIZES.heading3,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.sm
    },
    h4: {
        fontSize: FONT_SIZES.heading4,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: SPACING.sm
    },
    h5: {
        fontSize: FONT_SIZES.heading5,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.sm
    },
    h6: {
        fontSize: FONT_SIZES.heading6,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: SPACING.xs
    },

    // Text Colors
    textPrimary: { color: COLORS.primary },
    textSecondary: { color: COLORS.textSecondary },
    textError: { color: COLORS.error },
    textSuccess: { color: COLORS.success },
    textWarning: { color: COLORS.warning },
    textInfo: { color: COLORS.info },
    textWhite: { color: '#ffffff' },
    textBlack: { color: '#000000' },

    // Cards
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    cardFlat: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg
    },

    // Buttons
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#ffffff',
        fontSize: FONT_SIZES.md,
        fontWeight: '600'
    },
    buttonOutlineText: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.md,
        fontWeight: '600'
    },
    buttonDisabled: {
        backgroundColor: COLORS.disabled,
        opacity: 0.6
    },

    // Input
    input: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.lg,
        fontSize: FONT_SIZES.md,
        color: COLORS.text
    },
    inputFocused: {
        borderColor: COLORS.primary,
        borderWidth: 2
    },
    inputError: {
        borderColor: COLORS.error
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginVertical: SPACING.md
    },
    dividerVertical: {
        width: 1,
        backgroundColor: COLORS.border,
        marginHorizontal: SPACING.md
    },

    // Badge
    badge: {
        backgroundColor: COLORS.primary,
        borderRadius: BORDER_RADIUS.round,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        alignSelf: 'flex-start'
    },
    badgeText: {
        color: '#ffffff',
        fontSize: FONT_SIZES.xs,
        fontWeight: '600'
    },

    // Chip
    chip: {
        backgroundColor: COLORS.primaryLight,
        borderRadius: BORDER_RADIUS.round,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        marginRight: SPACING.sm,
        marginBottom: SPACING.sm
    },
    chipText: {
        color: COLORS.primary,
        fontSize: FONT_SIZES.sm,
        fontWeight: '600'
    },

    // Avatar
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarLarge: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    avatarSmall: {
        width: 32,
        height: 32,
        borderRadius: 16
    },

    // Shadow
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    shadowLarge: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6
    },

    // Border
    border: {
        borderWidth: 1,
        borderColor: COLORS.border
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: COLORS.border
    },
    borderBottom: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    borderLeft: {
        borderLeftWidth: 1,
        borderLeftColor: COLORS.border
    },
    borderRight: {
        borderRightWidth: 1,
        borderRightColor: COLORS.border
    },

    // Border Radius
    rounded: { borderRadius: BORDER_RADIUS.md },
    roundedSm: { borderRadius: BORDER_RADIUS.sm },
    roundedLg: { borderRadius: BORDER_RADIUS.lg },
    roundedXl: { borderRadius: BORDER_RADIUS.xl },
    roundedFull: { borderRadius: BORDER_RADIUS.round },

    // Flex
    flex1: { flex: 1 },
    flex2: { flex: 2 },
    flex3: { flex: 3 },
    flexGrow: { flexGrow: 1 },
    flexShrink: { flexShrink: 1 },

    // Alignment
    itemsCenter: { alignItems: 'center' },
    itemsStart: { alignItems: 'flex-start' },
    itemsEnd: { alignItems: 'flex-end' },
    itemsStretch: { alignItems: 'stretch' },
    justifyCenter: { justifyContent: 'center' },
    justifyStart: { justifyContent: 'flex-start' },
    justifyEnd: { justifyContent: 'flex-end' },
    justifyBetween: { justifyContent: 'space-between' },
    justifyAround: { justifyContent: 'space-around' },
    justifyEvenly: { justifyContent: 'space-evenly' },

    // Position
    absolute: { position: 'absolute' },
    relative: { position: 'relative' },

    // Overflow
    overflowHidden: { overflow: 'hidden' },
    overflowVisible: { overflow: 'visible' },

    // Opacity
    opacity0: { opacity: 0 },
    opacity25: { opacity: 0.25 },
    opacity50: { opacity: 0.5 },
    opacity75: { opacity: 0.75 },
    opacity100: { opacity: 1 },

    // Width & Height
    fullWidth: { width: '100%' },
    fullHeight: { height: '100%' },
    halfWidth: { width: '50%' },
    halfHeight: { height: '50%' }
});

export default globalStyles;