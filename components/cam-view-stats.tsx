'use client'

import { serverApi } from "@/lib/server-api"
import { useEffect } from "react"
import { Flex } from "./ui/flex"

export function CamViewStats({ views, camId }: { views: number, camId: number }) {

    const make_request = async () => {
        await serverApi.post(`/cams/cam/${camId}/view`)
    }

    useEffect(() => {
        make_request()
    }, [camId])

    return (
        <Flex className="text-xs text-muted-foreground">
            {views} wyświetleń
        </Flex>
    )
}
