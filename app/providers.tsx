'use client'

import { ThemeProvider } from '@/components/theme-provider'
import { useSocketStore } from '@/stores/useSocketStore'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
    if (typeof window === 'undefined') {
        return new QueryClient()
    }
    browserQueryClient ??= new QueryClient()
    return browserQueryClient
}

export function Providers({ children }: { children: React.ReactNode }) {

    const connect = useSocketStore(s => s.connect)
    const disconnect = useSocketStore(s => s.disconnect)

    useEffect(() => {
        connect()
        return () => {
            disconnect()
        }
    }, [])

    return (
        <QueryClientProvider client={getQueryClient()}>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </QueryClientProvider>
    )
}
