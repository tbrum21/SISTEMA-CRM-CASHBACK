'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('@elobonus:token');
        const user = localStorage.getItem('@elobonus:user');

        if (!token || !user) {
            router.replace('/login');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) {
        return <div className="h-screen w-full flex items-center justify-center bg-[#f8fafc] dark:bg-[#0a0a0c]">
                 <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               </div>;
    }

    return <>{children}</>;
}
