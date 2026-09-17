'use client'

import { Heart } from "lucide-react";
import { Button } from "./ui/button";
import { useFavoriteStore } from "@/stores/useFavoriteStore";
import { cn } from "cn";

export function FavoriteButton({ camId }: { camId: number }) {

    const favorite_cams = useFavoriteStore(s => s.favorite_cams)
    const add_favorite_cam = useFavoriteStore(s => s.add_favorite_cam)
    const del_favorite_cam = useFavoriteStore(s => s.del_favorite_cam)

    const is_fav = Boolean(favorite_cams.filter(cam => cam.id === camId).length)
    const onClick = is_fav ? () => del_favorite_cam(camId) : () => add_favorite_cam(camId)

    return (
        <Button size='icon-lg' variant={is_fav ? 'ghost' : 'ghost'} onClick={onClick}>
            <Heart className={cn("text-rose-500", is_fav ? 'fill-rose-500' : '')} />
        </Button>
    )
}
