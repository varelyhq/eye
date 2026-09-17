'use client'

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { Button } from "./ui/button";
import { useSocketStore } from "@/stores/useSocketStore";

export function LiveCount({ camId }: { camId: number }) {

    const socket = useSocketStore(s => s.socket)
    const is_connected = useSocketStore(s => s.is_connected)

    const [liveCount, setLiveCount] = useState(0)

    useEffect(() => {
        if (!is_connected) return

        socket.on('live_count', count => setLiveCount(count))
        socket.emit('join_room', camId)

        return () => {
            socket.off('live_count')
        }
    }, [camId, is_connected, socket])

    if (!liveCount) return null

    return (
        <Button variant='ghost' size='lg' className='cursor-auto'>
            {liveCount} <Eye />
        </Button>
    )
}
