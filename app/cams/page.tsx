import { AllCams } from "@/components/all-cams"
import { Flex } from "@/components/ui/flex"
import { Section, SectionContent, SectionDescription, SectionHeader, SectionTitle } from "@/components/ui/section"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Lista wszystkich kamer | Varely Cams'
}

export default function Page() {

    return (
        <Flex>
            <Section>
                <SectionHeader>
                    <SectionTitle>Lista kamer</SectionTitle>
                    <SectionDescription>Znajdź, wybierz, oglądaj!</SectionDescription>
                </SectionHeader>
                <SectionContent>
                    <AllCams />
                </SectionContent>
            </Section>
        </Flex>
    )
}
