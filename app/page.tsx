import { AllCams } from "@/components/all-cams";
import { FavoriteCams } from "@/components/favorite-cams";
import { HomeGrid } from "@/components/home-grid"
import { Button } from "@/components/ui/button";
import { Flex } from "@/components/ui/flex";
import { Section, SectionContent, SectionDescription, SectionHeader, SectionTitle } from "@/components/ui/section";
import { serverApi } from "@/lib/server-api";
import { CamType } from "@/types/cam-type";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function Page() {

    const { data, error } = await serverApi.get<CamType[]>('/cams/popular', { next: { revalidate: 3600 } })

    return (
        <Flex>
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
                <Flex className="flex-row justify-between">
                    <SectionHeader>
                        <SectionTitle>Szukaj kamery</SectionTitle>
                        <SectionDescription>Skorzystaj z poniższych filtrów, aby znaleźć dowolną kamerę.</SectionDescription>
                    </SectionHeader>
                    <Button variant='secondary' render={<Link href='/cams'>Zobacz więcej <ArrowRight /></Link>} nativeButton={false} />
                </Flex>
                <SectionContent>
                    <AllCams limit={10} />
                </SectionContent>
            </Section>
        </Flex>
    )
}
