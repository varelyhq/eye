import { fetchCams } from '@/api/fetch-cams';
import { useQuery } from '@tanstack/react-query';

export function useCams() {
    return useQuery({
        queryKey: ['cams'],
        queryFn: fetchCams,
        staleTime: 60 * 60 * 1000 // 1h
    });
}
