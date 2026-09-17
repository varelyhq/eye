'use client'

import { ArrowDown, ArrowUp, ExternalLink } from "lucide-react";
import { HlsVideoPlayer } from "./hls-video-player";
import { Flex } from "./ui/flex";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { serverApi } from "@/lib/server-api";
import { CamType } from "@/types/cam-type";
import Link from "next/link";

export function CamShorts() {

    const [index, setIndex] = useState(-1)
    const [prevCams, setPrevCams] = useState<CamType[]>([])

    const getRandomStream = async () => {
        const { data, error } = await serverApi.post<CamType>('/cams/random', { exclude_ids: prevCams.map(cam => cam.id) })
        if (error) {
            return
        }
        if (data) {
            setIndex(prev => prev + 1)
            setPrevCams(prev => [...prev, data])
        }
    }

    const cam: CamType | undefined = prevCams?.[index]

    const onClickNext = () => {
        if (prevCams[prevCams.length - 1].id === cam?.id) {
            getRandomStream()
        } else {
            setIndex(prev => prev + 1)
        }
    }

    const onClickPrev = () => {
        setIndex(prev => {
            if (prev > 0) return prev - 1
            return 0
        })
    }

    useEffect(() => {
        getRandomStream()
    }, [])

    return (
        <Flex className="flex-1 flex-row justify-center items-center gap-4">
            <Flex className="gap-2 justify-center items-center max-w-4xl w-full">
                <Flex className="flex-row justify-between items-end w-full">
                    <h2 className="text-xl font-medium">{cam?.name}</h2>
                    <Button
                        variant='default'
                        disabled={index < 0 || !cam?.slug}
                        nativeButton={false}
                        render={<Link href={'/cams/' + cam?.slug}>Oglądaj <ExternalLink /></Link>}
                    />
                </Flex>
                <Flex className="aspect-video w-full">
                    {cam?.stream_url && <HlsVideoPlayer key={cam.id} showControls={false} src={cam.stream_url} />}
                </Flex>
            </Flex>
            <Flex className="gap-2">
                <Button variant='outline' size='icon-lg' disabled={index <= 0} onClick={onClickPrev}>
                    <ArrowUp />
                </Button>
                <Button variant='outline' size='icon-lg' onClick={onClickNext}>
                    <ArrowDown />
                </Button>
            </Flex>
        </Flex>
    )
}
