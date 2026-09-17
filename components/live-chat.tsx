'use client'

import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { InputGroup, InputGroupButton, InputGroupInput } from "./ui/input-group";
import { useSocketStore } from "@/stores/useSocketStore";
import { Message, MessageAvatar, MessageContent } from "./ui/message";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bubble, BubbleContent } from "./ui/bubble";
import { MessageType } from "@/types/message-type";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import { useShallow } from "zustand/shallow";

const avatar_api_url = 'https://api.dicebear.com/10.x/waves/svg'

function MessageInput() {

    const socket = useSocketStore(s => s.socket)

    const [text, setText] = useState('')

    const send = () => {
        if (!text.trim()) return
        socket.emit('message', text)
        setText('')
    }

    const onKeyDown = (event: KeyboardEvent) => {
        if (!event.shiftKey && event.key === 'Enter') {
            send()
        }
    }

    return (
        <InputGroup>
            <InputGroupInput
                value={text}
                onKeyDown={onKeyDown}
                onChange={e => setText(e.target.value)}
                placeholder="Napisz wiadomość..."
            />
            <InputGroupButton className='mr-1' onClick={send} disabled={!text}>Wyślij <Send /></InputGroupButton>
        </InputGroup>
    )
}

export function LiveChat({ camId }: { camId: number }) {

    const { socket, loading, user_id, valid_token, is_connected, connect_first_time } = useSocketStore(
        useShallow(s => ({
            socket: s.socket,
            loading: s.loading,
            user_id: s.user_id,
            valid_token: s.valid_token,
            is_connected: s.is_connected,
            connect_first_time: s.connect_first_time,
        }))
    )

    // const [visible, setVisible] = useState(false)
    const [messages, setMessages] = useState<MessageType[]>([])

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!is_connected) return;

        socket.on('message', message => {
            setMessages(prev => [...prev, message])
        })
        socket.emit('messages', camId, (messages: MessageType[]) => {
            setMessages([...messages])
        })

        return () => {
            socket.off('message')
        }
    }, [camId, socket, is_connected])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            })
        }
    }, [messages])

    // if (!visible) return <Button variant='secondary' size='xs' onClick={() => setVisible(true)}>Pokaż czat</Button>

    if (loading) return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Czat na żywo</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center flex-1">
                <Spinner className="size-6" />
            </CardContent>
        </Card>
    )

    if (!loading && !valid_token) return (
        <Empty className="border border-dashed">
            <EmptyHeader>
                <EmptyMedia variant='icon'>
                    <MessageCircle />
                </EmptyMedia>
                <EmptyTitle>Zezwól na czat</EmptyTitle>
                <EmptyDescription>Aby skorzystać z czatu musisz kliknąć poniższy przycisk.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
                <Button variant='secondary' onClick={connect_first_time}>Zezwól</Button>
            </EmptyContent>
        </Empty>
    )

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Czat na żywo</CardTitle>
                <CardDescription>Wiadomości są usuwane po 24h.</CardDescription>
            </CardHeader>
            <CardContent ref={scrollRef} className="flex flex-col gap-6 overflow-y-auto">
                {messages.map((message, index) => (
                    <Message key={index} align={user_id === message.user_id ? 'end' : 'start'}>
                        <MessageAvatar>
                            <Avatar>
                                <AvatarImage src={`${avatar_api_url}?seed=${user_id}`} alt={message.username} />
                                <AvatarFallback>{message?.username?.slice(0, 2)?.toUpperCase() || 'AA'}</AvatarFallback>
                            </Avatar>
                        </MessageAvatar>
                        <MessageContent>
                            {/* <MessageHeader>{message.username}</MessageHeader> */}
                            <Bubble variant={user_id === message.user_id ? 'tinted' : 'secondary'}>
                                <BubbleContent>{message.content}</BubbleContent>
                            </Bubble>
                        </MessageContent>
                    </Message>
                ))}
            </CardContent>
            <CardFooter className="mt-auto">
                <MessageInput />
            </CardFooter>
        </Card>
    )
}
