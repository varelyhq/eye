import { create } from "zustand";
import { io, Socket } from "socket.io-client";

type SocketStoreType = {
    socket: Socket
    loading: boolean
    user_id?: string
    valid_token: boolean
    is_connected: boolean
    connect: () => Promise<void>
    connect_first_time: () => Promise<void>
    disconnect: () => void
}

export const useSocketStore = create<SocketStoreType>()((set, get) => ({
    socket: io(process.env.NEXT_PUBLIC_API_URL, { autoConnect: false, withCredentials: true }),
    loading: true,
    valid_token: false,
    is_connected: false,
    connect: async () => {
        const res = await fetch('/api/session')
        const data = await res.json()
        if (!data.valid) return set({ valid_token: false, loading: false });

        const socket = get().socket
        if (socket.connected) return;

        socket.on('connect', () => {
            set({ is_connected: true, loading: false, valid_token: true, user_id: data.user_id })
            console.log('connected to the sio server!')
        })
        socket.on('disconnect', () => set({ is_connected: false, valid_token: false, user_id: undefined }))
        socket.connect()
    },
    connect_first_time: async () => {
        const res = await fetch('/api/session', { method: 'POST' });
        if (!res.ok) throw new Error('Nie udało się utworzyć sesji');
        set({ valid_token: true, loading: true });
        get().connect();
    },
    disconnect: () => {
        const socket = get().socket
        socket.off('connect')
        socket.off('disconnect')
        socket.disconnect()
    }
}))
