'use client'

import { useEffect, useState } from "react";
import { Filters } from "./filters";
import { CamType } from "@/types/cam-type";
import { Grid } from "./ui/grid";
import { Cam } from "./cam";
import { serverApi } from "@/lib/server-api";

// TODO: Add pagination

export function AllCams({ limit = 150 }: { limit?: number }) {

    const [cams, setCams] = useState<CamType[]>([])

    const [query, setQuery] = useState('')
    const [orderBy, setOrderBy] = useState('default')
    const [showInactive, setShowInactive] = useState('1')

    const getCams = async () => {
        const params = new URLSearchParams({ q: query, order_by: orderBy, show_inactive: showInactive, limit: limit.toString() })
        const paramsString = params.toString()
        const path = `/cams/search?${paramsString}`
        const { data, error } = await serverApi.get<CamType[]>(path)
        if (error) {
            console.log(error)
            return
        }
        setCams(data)
    }

    useEffect(() => {
        getCams()
    }, [query, orderBy, showInactive])

    return (
        <>
            <Filters
                query={query}
                setQuery={setQuery}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                showInactive={showInactive}
                setShowInactive={setShowInactive}
            />
            <Grid className="grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                {cams.map(cam => <Cam key={cam.id} cam={cam} />)}
            </Grid>
        </>
    )
}
