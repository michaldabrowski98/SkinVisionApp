import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { usePhoto } from '@/PhotoContext';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants'


export default function PhotoScreen() {
    const { photoUri } = usePhoto();
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toBase64 = async (uri: string) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result as string;
                const base64Image = base64data.split(',')[1];
                resolve(base64Image);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const startTask = async () => {
        if (!photoUri) {
            Alert.alert('Brak zdjęcia', 'Proszę wybrać zdjęcie.');
            return;
        }

        setLoading(true);
        try {
            const base64Image = await toBase64(photoUri);
            console.log('Base64 Image:', base64Image); // Logowanie zakodowanego obrazu

            const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/api/start-task`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: "img.jpg", content: base64Image }),
            });

            const data = await response.json();
            console.log('Start Task Response:', data);

            const task_id = data.task_id;

            await checkTaskStatus(task_id);
        } catch (error) {
            setLoading(false);
            Alert.alert('Błąd', 'Nie udało się rozpocząć badania.');
            console.error('Start Task Error:', error);
        }
    };


    const checkTaskStatus = async (task_id: string) => {
        const interval = setInterval(async () => {
            try {
                console.log('Task ID:', task_id);
                const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/api/task-status/${task_id}`);
                const data = await response.json();
                console.log('Task Status Response:', data, task_id);

                const status = data.status;

                if (status === 'SUCCESS' || status === 'FAILURE') {
                    clearInterval(interval);
                    setLoading(false);
                    if (status === 'SUCCESS') {
                        await getTaskResult(task_id);
                    } else {
                        Alert.alert('Błąd', 'Nie udało się wykonać zadania, spróbuj ponownie.');
                    }
                }
            } catch (error) {
                clearInterval(interval);
                setLoading(false);
                Alert.alert('Błąd', 'Nie udało się wykonać zadania, spróbuj ponownie.');
                console.error('Task Status Error:', error);
            }
        }, 3000);
    };

    const getTaskResult = async (task_id: string) => {
        try {
            const response = await fetch(`${Constants.expoConfig.extra.apiUrl}/api/task-result/${task_id}`, {
                method: 'GET',
            });
            const result = await response.json();
            console.log('Task Result Response:', result);

            router.push({
                pathname: '/result',
                params: { result: JSON.stringify(result) },
            });
        } catch (error) {
            Alert.alert('Błąd', 'Nie udało się uzyskać wyniku zadania.');
            console.error('Task Result Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            {photoUri ? (
                <Image source={{ uri: photoUri }} style={styles.image} />
            ) : (
                <Text>Brak zdjęcia</Text>
            )}
            {loading ? (
                <ActivityIndicator size="large" color="#FF9500" />
            ) : (
                <TouchableOpacity style={styles.button} onPress={startTask}>
                    <Text style={styles.buttonText}>Wykonaj badanie</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E5E5EA',
        padding: 20,
    },
    image: {
        width: '100%',
        height: '70%',
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
