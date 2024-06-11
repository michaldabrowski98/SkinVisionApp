import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import RenderHTML from 'react-native-render-html';

const ResultScreen = () => {
    const { width } = useWindowDimensions();
    const { result } = useLocalSearchParams();
    const router = useRouter();

    const diagnosis = JSON.parse(result);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{diagnosis.polish_name} ({diagnosis.latin_name})</Text>
            </View>
            <View style={styles.content}>
                <RenderHTML
                    contentWidth={width}
                    source={{ html: diagnosis.description }}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
                <Text style={styles.buttonText}>Powrót do strony głównej</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#E5E5EA',
    },
    header: {
        backgroundColor: '#FF9500',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: 'white',
    },
    content: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#FF9500',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
});

export default ResultScreen;
