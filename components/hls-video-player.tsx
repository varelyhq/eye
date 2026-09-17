"use client"

import { useEffect, useRef, useState } from "react"
import { GlobeOff, Maximize, Minimize, Pause, Play, X } from "lucide-react"
import Hls from "hls.js"
import { cn } from "cn"
import { Button } from "./ui/button"
import { Flex } from "./ui/flex"
import { Skeleton } from "./ui/skeleton"
import { Marker } from "./ui/marker"
import { Spinner } from "./ui/spinner"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty"

type Props = {
    src: string
    className?: string
    showControls?: boolean
}

export function HlsVideoPlayer({ src, showControls: showControlsProp = true, className }: Props) {

    const [error, setError] = useState(false)
    const [paused, setPaused] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [fullscreen, setFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(false)

    const hlsRef = useRef<Hls>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const playPromiseRef = useRef<Promise<void> | null>(null)
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

    const onError = (err: any) => {
        setError(err)
    }

    const toggle = async () => {
        const video = videoRef.current
        const hls = hlsRef.current
        if (!video) return

        if (video.paused) {
            hls?.startLoad(-1)
            video.currentTime = video.duration
            playPromiseRef.current = video.play()
            try {
                await playPromiseRef.current
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    throw err
                }
            }
            setPaused(false)
        } else {
            if (playPromiseRef.current) {
                try { await playPromiseRef.current } catch { }
            }
            video.pause()
            hls?.stopLoad()
            setPaused(true)
        }
    }

    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            videoRef.current?.parentElement?.requestFullscreen()
        }
    }

    const handleMouseMove = () => {
        setShowControls(true)

        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
        }

        hideTimeoutRef.current = setTimeout(() => {
            setShowControls(false)
        }, 2000)
    }

    const handleMouseLeave = () => {
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
        }
        setShowControls(false)
    }

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleCanPlay = () => setIsLoading(false)

        video.addEventListener("canplay", handleCanPlay)

        return () => {
            video.removeEventListener("canplay", handleCanPlay)
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
        }
    }, [])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        setIsLoading(true)
        let hls: Hls | null = null

        if (Hls.isSupported()) {
            hls = new Hls()
            hlsRef.current = hls

            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (!hls) return

                const offlineIndicators = [
                    Hls.ErrorDetails.MANIFEST_LOAD_ERROR,
                    Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT,
                    Hls.ErrorDetails.LEVEL_LOAD_ERROR,
                    Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT,
                ]

                if (data.fatal) {
                    if (offlineIndicators.includes(data.details)) {
                        setError(true)
                        hls.destroy()
                        return
                    }

                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad()
                            break
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError()
                            break
                        default:
                            hls.destroy()
                            setError(true)
                            break
                    }
                }
            })

            hls.loadSource(src)
            hls.attachMedia(video)
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src
        }

        return () => {
            hlsRef.current?.destroy()
            hlsRef.current = null
        }
    }, [src])

    useEffect(() => {
        const handleFullscreenChange = () => {
            setFullscreen(!!document.fullscreenElement)
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange)

        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange)
        }
    }, [])

    if (error) return (
        <Flex className="aspect-video justify-center items-center">
            <Empty className="border border-dashed">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <GlobeOff />
                    </EmptyMedia>
                    <EmptyTitle>Kamera jest offline</EmptyTitle>
                    <EmptyDescription>Kamera nie nadaje obrazu. Spróbuj ponownie później.</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button>Odkryj inne kamery</Button>
                </EmptyContent>
            </Empty>
        </Flex>
    )

    return (
        <Flex
            className={cn("relative aspect-video", !showControls && 'cursor-none')}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {isLoading && (
                <Skeleton className='absolute aspect-video inset-0 rounded-4xl flex justify-center items-center'>
                    <Spinner className="size-6" />
                </Skeleton>
            )}
            <video
                ref={videoRef}
                className={cn(fullscreen ? '' : 'rounded-4xl', className)}
                autoPlay
                muted
                playsInline
                onError={onError}
            />
            {!isLoading &&
                <>
                    <Button
                        className={cn(
                            'absolute left-2 bottom-2 transition-opacity duration-300',
                            (showControls && showControlsProp) ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        )}
                        variant='secondary'
                        size='icon-lg'
                        onClick={toggle}
                    >
                        {paused ? <Play /> : <Pause />}
                    </Button>
                    <Button
                        className={cn(
                            'absolute right-2 bottom-2 transition-opacity duration-300',
                            (showControls && showControlsProp) ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        )}
                        variant='secondary'
                        size='icon-lg'
                        onClick={toggleFullscreen}
                    >
                        {fullscreen ? <Minimize /> : <Maximize />}
                    </Button>
                </>
            }
        </Flex>
    )
}
