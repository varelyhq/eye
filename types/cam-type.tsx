export type CamType = {
    id: number
    slug: string

    name: string
    title: string
    image: string
    stream_url?: string
    is_online: boolean

    views: number
    rating_sum: number
    rating_count: number
}
