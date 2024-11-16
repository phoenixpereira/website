'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import Header components
const HeaderClient = dynamic(() => import('./HeaderClient'), { ssr: true });
const HeaderMobileClient = dynamic(() => import('./HeaderMobileClient'), { ssr: true });

type HeaderData = {
    isSignedIn: boolean;
    nextStep: 'signup' | 'payment' | null;
    isMember: boolean;
    avatar?: string;
};

interface HeaderProps {
    serverData: HeaderData;
}

export default function Header({ serverData }: HeaderProps) {
    // Default signed out data
    const defaultSignedOutData: HeaderData = {
        isSignedIn: false,
        nextStep: null,
        isMember: false,
        avatar: '',
    };

    const [headerData, setHeaderData] = useState<HeaderData>(defaultSignedOutData);

    // Update the header data once the proper server data is received
    useEffect(() => {
        if (serverData) {
            setHeaderData(serverData);
        }
    }, [serverData]);

    return (
        <>
            <HeaderClient data={headerData} className="hidden md:block" />
            <HeaderMobileClient data={headerData} className="md:hidden" />
        </>
    );
}
