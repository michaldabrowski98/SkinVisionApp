import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PhotoContextProps {
    photoUri: string | null;
    setPhotoUri: (uri: string) => void;
}

const PhotoContext = createContext<PhotoContextProps | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    return (
        <PhotoContext.Provider value={{ photoUri, setPhotoUri }}>
            {children}
        </PhotoContext.Provider>
    );
};

export const usePhoto = (): PhotoContextProps => {
    const context = useContext(PhotoContext);
    if (!context) {
        throw new Error('usePhoto must be used within a PhotoProvider');
    }
    return context;
};
