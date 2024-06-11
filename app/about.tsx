import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import Collapsible from 'react-native-collapsible';
import RenderHTML from 'react-native-render-html';
import Constants from 'expo-constants'

const AboutScreen = () => {
    const { width } = useWindowDimensions();
    const [activeSections, setActiveSections] = useState<Array<number>>([]);
    const [lesionsInfo, setLesionsInfo] = useState<Array<any>>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const sections = [
        {
            title: 'Choroby skóry',
            content: lesionsInfo,
        },
        {
            title: 'Jak wykonać badanie',
            content: 'Zdjęcie zmian chorobowych należy wykonać z odległości około 15 cm. Zmiana powinna być dobrze oświetlona.',
        },
        {
            title: 'O aplikacji',
            content: 'Ta aplikacja powstała jako część pracy licencjackiej.',
        },
    ];

    useEffect(() => {
        const fetchLesionsInfo = async () => {
            try {
                console.log('Fetching lesions info...');
                const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/api/lesions-info`);
                if (!response.ok) {
                    console.log(`${Constants.expoConfig.extra.apiUrl}/api/lesions-info`);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Lesions Info Response:', data);
                setLesionsInfo(data);
            } catch (error) {
                console.error('Error fetching lesions info:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLesionsInfo();
    }, []);

    const toggleSection = (sectionIndex: number) => {
        setActiveSections((prevSections) =>
            prevSections.includes(sectionIndex)
                ? prevSections.filter((index) => index !== sectionIndex)
                : [...prevSections, sectionIndex]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {sections.map((section, index) => (
                <View key={index} style={styles.section}>
                    <TouchableOpacity onPress={() => toggleSection(index)} style={styles.header}>
                        <Text style={styles.headerText}>{section.title}</Text>
                    </TouchableOpacity>
                    <Collapsible collapsed={!activeSections.includes(index)}>
                        <View style={styles.content}>
                            {index === 0 ? (
                                loading ? (
                                    <ActivityIndicator size="large" color="#007AFF" />
                                ) : (
                                    section.content.map((lesion: any) => (
                                        <View key={lesion.id} style={styles.lesion}>
                                            <Text style={styles.lesionTitle}>{lesion.polish_name} ({lesion.latin_name})</Text>
                                            <RenderHTML
                                                contentWidth={width}
                                                source={{ html: lesion.description }}
                                            />
                                        </View>
                                    ))
                                )
                            ) : (
                                <Text style={styles.contentText}>{section.content}</Text>
                            )}
                        </View>
                    </Collapsible>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#E5E5EA',
    },
    section: {
        marginBottom: 10,
    },
    header: {
        padding: 10,
        backgroundColor: '#FF9500',
        borderRadius: 5,
    },
    headerText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    content: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 5,
    },
    contentText: {
        fontSize: 16,
        color: '#333',
    },
    lesion: {
        marginBottom: 10,
    },
    lesionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
    },
});

export default AboutScreen;
