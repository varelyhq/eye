'use client'

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Flex } from "./ui/flex";
import { cn } from "cn";
import { toast } from "./ui/toast";
import { serverApi } from "@/lib/server-api";

export function Rating({ camId, ratingSum, ratingCount }: { camId: number, ratingSum: number, ratingCount: number }) {

    const [userRating, setUserRating] = useState(0)
    const [hoveredCount, setHoveredCount] = useState(-1)
    const [userRatingBefore, setUserRatingBefore] = useState(0)

    const onClick = async (newRating: number) => {
        const body = { rating: newRating }
        const { error } = await serverApi.post('/ratings/' + camId, body, { credentials: 'include' })
        if (error) {
            return toast.add({
                title: "Nie możesz teraz ocenić",
                description: "Odczekaj chwilę zanim ocenisz ponownie.",
            });
        }
        setUserRating(newRating)
    }

    const getUserRating = async () => {
        const { data, error } = await serverApi.get<{ rating: number } | null>('/ratings/' + camId, { credentials: 'include' })
        if (error) {
            console.warn(error)
            return
        }
        if (data?.rating) {
            setUserRating(data.rating)
            setUserRatingBefore(data.rating)
        }
    }

    useEffect(() => {
        getUserRating()
    }, [camId])

    const items = [...Array(5).keys()]

    // TODO: Check for errors
    let rating_count_delta = 0
    if (userRatingBefore && userRating) rating_count_delta = 0
    else if (!userRatingBefore && userRating) rating_count_delta = 1
    else if (userRatingBefore && !userRating) rating_count_delta = -1

    let rating_delta = 0
    if (!userRating) rating_delta = -userRatingBefore
    else if (userRatingBefore === userRating) rating_delta = 0
    else if (userRatingBefore !== userRating) rating_delta = userRating - userRatingBefore

    ratingCount = ratingCount + rating_count_delta
    const rating = (ratingSum + rating_delta) / (ratingCount || 1)

    const star_color = userRating ? 'fill-rose-400' : 'fill-amber-400'

    return (
        <Flex className="flex-row items-center gap-2 me-3">
            <Flex className="text-xs text-muted-foreground">
                <span>{rating} ({ratingCount} głosów)</span>
            </Flex>
            <Flex className="flex-row gap-1" onMouseLeave={() => setHoveredCount(-1)}>
                {items.map(key => (
                    <Star
                        key={key}
                        onClick={() => onClick(key === userRating - 1 ? 0 : key + 1)}
                        onMouseOver={() => setHoveredCount(key)}
                        className={cn(
                            "size-4 cursor-pointer dark:stroke-amber-400",
                            ((userRating || rating) > key && hoveredCount === -1) ? star_color : '',
                            hoveredCount >= key ? star_color : ''
                        )}
                    />
                ))}
            </Flex>
        </Flex>
    )
}
