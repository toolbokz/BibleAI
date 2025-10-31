
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

const ReadingHistoryScreen: React.FC<StackScreenProps<RootStackParamList, 'ReadingHistory'>> = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Reading History Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
});

export default ReadingHistoryScreen;
