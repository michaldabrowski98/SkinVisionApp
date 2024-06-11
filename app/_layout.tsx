import React from 'react';
import { Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, usePathname  } from 'expo-router';
import { PhotoProvider } from "@/PhotoContext";

function getHeaderTitle(route: string) : string {
    switch (route) {
        case '/':
            return 'Strona główna';
        case '/about':
            return 'O aplikacji';
        case '/photo':
            return 'Wykonaj badanie';
        case '/result':
            return 'Wynik badania';
        default:
            return 'Aplikacja'
    }
}


export default function Layout() {
    const route: string = usePathname();

    return (
        <PhotoProvider>
            <Stack
                screenOptions={{
                    headerRight: () => (
                        <Link href="/about" asChild>
                            <TouchableOpacity style={{ marginRight: 15 }}>
                                <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                            </TouchableOpacity>
                        </Link>
                    ),
                    title: getHeaderTitle(route)
                }}
            />
        </PhotoProvider>
    );
}
