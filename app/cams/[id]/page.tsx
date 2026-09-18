import { CamViewStats } from "@/components/cam-view-stats"
import { FavoriteButton } from "@/components/favorite-button"
import { HlsVideoPlayer } from "@/components/hls-video-player"
import { HomeGrid } from "@/components/home-grid"
import { LiveChat } from "@/components/live-chat"
import { LiveCount } from "@/components/live-count"
import { Rating } from "@/components/rating"
import { Container } from "@/components/ui/container"
import { Flex } from "@/components/ui/flex"
import { Section, SectionContent, SectionHeader, SectionTitle } from "@/components/ui/section"
import { serverApi } from "@/lib/server-api"
import { CamType } from "@/types/cam-type"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id: slug } = await params
    const { data, error } = await serverApi.get<CamType>(`/cams/slug/${slug}`)

    if (error) return {
        title: 'Kamera nie została znaleziona | Varely Cams',
        referrer: "no-referrer"
    }

    return {
        title: data.name + ' | Varely Cams',
        description: data?.title,
        referrer: "no-referrer"
    };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id: slug } = await params

    const { data, error } = await serverApi.get<CamType>(`/cams/slug/${slug}`)
    // const { data: featured_cams, error: error2 } = await serverApi.get<CamType[]>('/cams?limit=5&random=1')
    const featured_cams = undefined

    if (error) return (
        <Flex className="flex-1 justify-center items-center text-destructive">
            {error.name} {error.message}
        </Flex>
    )

    return (
        <Container>
            <Flex className="xl:flex-row gap-4">
                <Flex className="flex-2 gap-4">
                    <HlsVideoPlayer src={data.stream_url || ''} />
                    <Flex className="flex-2 md:flex-row md:justify-between md:items-start gap-2">
                        <Flex className="gap-1">
                            <CamViewStats views={data.views} camId={data.id} />
                            <h1 className="text-2xl font-semibold">{data.name}</h1>
                            <p className="text-sm text-muted-foreground mb-3">{data.title}</p>
                        </Flex>
                        <Flex className="gap-1 items-end">
                            <Flex className="flex-row gap-2">
                                <LiveCount camId={data.id} />
                                <FavoriteButton camId={data.id} />
                            </Flex>
                            <Rating camId={data.id} ratingSum={data.rating_sum} ratingCount={data.rating_count} />
                        </Flex>
                    </Flex>
                </Flex>
                <Flex className="flex-1 min-h-128 max-h-128">
                    <LiveChat camId={data.id} />
                </Flex>
            </Flex>
            {featured_cams &&
                <Section>
                    <SectionHeader>
                        <SectionTitle>Zobacz również</SectionTitle>
                    </SectionHeader>
                    <SectionContent>
                        <HomeGrid cams={featured_cams} />
                    </SectionContent>
                </Section>
            }
        </Container>
    )
}
