import { FavoriteCams } from "@/components/favorite-cams";
import { HomeGrid } from "@/components/home-grid"
import { Container } from "@/components/ui/container";
import { Section, SectionContent, SectionDescription, SectionHeader, SectionTitle } from "@/components/ui/section";
import { serverApi } from "@/lib/server-api";
import { CamType } from "@/types/cam-type";

export default async function Page() {

    const { data, error } = await serverApi.get<CamType[]>('/cams/popular', { next: { revalidate: 3600 } })

    return (
        <Container>
            <Section>
                <SectionHeader>
                    <SectionTitle>Popularne kamery</SectionTitle>
                </SectionHeader>
                <SectionContent>
                    {data && <HomeGrid cams={data} />}
                </SectionContent>
            </Section>
            <Section>
                <SectionHeader>
                    <SectionTitle>Ulubione kamery</SectionTitle>
                </SectionHeader>
                <SectionContent>
                    <FavoriteCams />
                </SectionContent>
            </Section>
            <Section>
                <SectionHeader>
                    <SectionTitle>Szukaj kamery</SectionTitle>
                    <SectionDescription>Skorzystaj z poniższych filtrów, aby znaleźć dowolną kamerę.</SectionDescription>
                </SectionHeader>
            </Section>
        </Container>
    )
}
