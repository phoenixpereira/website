'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import header components
const HeaderClient = dynamic(() => import('./HeaderClient'), { ssr: true });
const HeaderMobileClient = dynamic(() => import('./HeaderMobileClient'), { ssr: true });

// Type definition for header data
export type HeaderData = {
    isSignedIn: boolean;
    nextStep: 'signup' | 'payment' | null;
    isMember: boolean;
};

// Function to fetch header data
const fetchHeaderData = async (): Promise<HeaderData> => {
    const res = await fetch('/api/headerData');
    if (!res.ok) {
        return { isSignedIn: false, nextStep: null, isMember: false };
    }
    return res.json();
};

export default function Header() {
    const [headerData, setHeaderData] = useState<HeaderData>({
        isSignedIn: false,
        nextStep: null,
        isMember: false,
    });

    // Fetch the header data on client-side mount
    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchHeaderData();
            setHeaderData(data);
        };
        fetchData();
    }, []);

    return (
        <>
            <HeaderClient data={headerData} className="hidden lg-xl:block" />
            <HeaderMobileClient data={headerData} className="lg-xl:hidden" />
        </>
    );
}
