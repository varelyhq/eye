import { CamShorts } from "@/components/cam-shorts";
import { Container } from "@/components/ui/container";
import { Flex } from "@/components/ui/flex";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Cam Shorts | Varely Cams',
    referrer: "no-referrer"
}

export default function Page() {
    return (
        <Flex className="not-md:h-[calc(100vh-4rem)] md:flex-1 overflow-hidden">
            <Container className="flex-1 my-0! mx-auto px-0 md:px-4">
                <CamShorts />
            </Container>
        </Flex>
    )
}
