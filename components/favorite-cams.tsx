'use client'

import { useFavoriteStore } from "@/stores/useFavoriteStore"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty"
import { HeartCrack } from "lucide-react"
import { useEffect, useState } from "react"
import { serverApi } from "@/lib/server-api"
import { CamType } from "@/types/cam-type"
import { Cam } from "./cam"
import { Grid } from "./ui/grid"

export function FavoriteCams() {

    const favorite_cams = useFavoriteStore(s => s.favorite_cams)

    const [favoriteCams, setFavoriteCams] = useState<CamType[]>([])

    const getFavoriteCams = async () => {
        const { data, error } = await serverApi.post<CamType[]>('/cams/favorites', { ids: favorite_cams.map(e => e.id) })
        if (error) {
            return
        }
        setFavoriteCams(data)
    }

    useEffect(() => {
        if (favorite_cams.length) getFavoriteCams()
    }, [favorite_cams])

    if (!favorite_cams.length) return (
        <Empty>
            <EmptyHeader>
                <EmptyMedia variant='icon'>
                    <HeartCrack className="stroke-rose-400" />
                </EmptyMedia>
                <EmptyTitle>Brak ulubionych kamer</EmptyTitle>
                <EmptyDescription>
                    Dodaj jakąś przechodząc na stronę kamery i klikając symbol serca.
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )

    return (
        <Grid className="grid-cols-5">
            {favoriteCams.map(cam => <Cam key={cam.id} cam={cam} showHeart />)}
        </Grid>
    )
}
