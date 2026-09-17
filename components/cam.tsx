import Link from "next/link";
import { Item, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "./ui/item";
import { Flex } from "./ui/flex";
import { Heart, Star } from "lucide-react";
import { CamType } from "@/types/cam-type";

export function Cam({ cam, showHeart }: { cam: CamType, showHeart?: boolean }) {
    return (
        <Item
            key={cam.id}
            variant='muted'
            className="items-start bg-transparent hover:bg-muted/50 flex-nowrap flex-col px-2 py-2 relative"
            render={<Link href={`/cams/${cam.slug}`} />}
        >
            <ItemHeader className="basis-auto">
                <img
                    src={cam.image}
                    alt={cam.name}
                    width={128}
                    height={128}
                    className="w-full rounded-lg object-cover"
                />
            </ItemHeader>
            <ItemContent>
                <ItemTitle className="line-clamp-2">{cam.name}</ItemTitle>
                <ItemDescription>{cam.title}</ItemDescription>
                <Flex className="flex-row justify-between">
                    <ItemDescription className="text-xs">{cam.views} wyświetleń</ItemDescription>
                    {Boolean(cam.rating_count) &&
                        <Flex className="flex-row gap-1 items-center">
                            <ItemDescription className="text-xs">
                                {(cam.rating_sum / (cam.rating_count || 1)).toFixed(1)}
                            </ItemDescription>
                            <Star className="size-3 fill-amber-400 dark:stroke-amber-400" />
                        </Flex>
                    }
                </Flex>
            </ItemContent>
            {showHeart && <Heart className="absolute top-4 right-4 size-5 fill-rose-400 stroke-rose-400" />}
        </Item>
    )
}
