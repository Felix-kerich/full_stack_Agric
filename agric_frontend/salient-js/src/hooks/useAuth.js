// src/hooks/useAuth.js
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import UserService from '../hooks/UserService'; // Adjust the path if necessary

export function useAuth(redirectPath = '/login') {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const isAdmin = UserService.adminOnly();
            if (!isAdmin) {
                router.push(redirectPath);
            } else {
                setIsAuthorized(true);
            }
            setLoading(false);
        };

        checkAuth();
    }, [router, redirectPath]);

    return { loading, isAuthorized };
}
