'use client'

import { ArrowDown, ArrowUp, ExternalLink, Heart } from "lucide-react";
import { HlsVideoPlayer } from "./hls-video-player";
import { Flex } from "./ui/flex";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { serverApi } from "@/lib/server-api";
import { CamType } from "@/types/cam-type";
import Link from "next/link";
import { cn } from "cn";
import { useFavoriteStore } from "@/stores/useFavoriteStore";

export function CamShorts() {

    const favorite_cams = useFavoriteStore(s => s.favorite_cams)
    const add_favorite_cam = useFavoriteStore(s => s.add_favorite_cam)
    const del_favorite_cam = useFavoriteStore(s => s.del_favorite_cam)

    const [index, setIndex] = useState(-1)
    const [prevCams, setPrevCams] = useState<CamType[]>([])

    const touchStartY = useRef(0)

    const onTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY
    }

    const onTouchEnd = (e: React.TouchEvent) => {
        const diff = touchStartY.current - e.changedTouches[0].clientY
        const threshold = 50
        if (diff > threshold) {
            onClickNext()
        } else if (diff < -threshold) {
            onClickPrev()
        }
    }

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
    const isFav = Boolean(favorite_cams.filter(c => c.id === cam?.id).length)

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
        <Flex className="relative flex-1 flex-row justify-center items-center gap-4">
            <Flex className="gap-2 justify-center items-center max-w-4xl w-full">
                <Flex
                    className={cn("absolute not-md:top-4 left-0 right-0 px-4 md:p-0 z-10",
                        "md:relative flex-row justify-between items-center md:items-end w-full")}
                >
                    <h2 className="text-lg line-clamp-1 md:line-clamp-2 md:text-xl font-medium">{cam?.name}</h2>
                    <Button
                        variant='default'
                        disabled={index < 0 || !cam?.slug}
                        nativeButton={false}
                        render={<Link href={'/cams/' + cam?.slug}>Oglądaj <ExternalLink /></Link>}
                    />
                </Flex>
                <Flex className="relative aspect-9/16 md:aspect-video w-full" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                    <Flex className="absolute inset-0">
                        {cam?.stream_url && <HlsVideoPlayer key={cam.id} src={cam.stream_url} wrapperClassName="flex-1" className="rounded-none md:rounded-4xl flex-1 object-cover" showControls={false} />}
                    </Flex>
                </Flex>
            </Flex>
            <Flex className="absolute not-md:right-4 md:relative gap-2">
                {cam &&
                    <Button
                        variant='outline'
                        size='icon-lg'
                        onClick={() => isFav ? del_favorite_cam(cam?.id) : add_favorite_cam(cam?.id)}
                    >
                        <Heart className={cn("stroke-rose-400", isFav ? 'fill-rose-400' : '')} />
                    </Button>
                }
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
