import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

type FavoriteCamType = {
    id: number
}

type FavoriteType = {
    favorite_cams: FavoriteCamType[]
    add_favorite_cam: (cam_id: number) => void
    del_favorite_cam: (cam_id: number) => void
}

export const useFavoriteStore = create<FavoriteType>()(
    persist(
        (set, get) => ({
            favorite_cams: [],
            add_favorite_cam: cam_id => {
                const cam = { id: cam_id }
                set({ favorite_cams: [...get().favorite_cams, cam] })
            },
            del_favorite_cam: cam_id => {
                const favorite_cams = get().favorite_cams.filter(cam => cam.id !== cam_id)
                set({ favorite_cams })
            },
        }),
        {
            name: 'favorite-cams-storage',
            storage: createJSONStorage(() => localStorage)
        }
    )
)
