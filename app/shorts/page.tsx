import { CamShorts } from "@/components/cam-shorts";
import { Container } from "@/components/ui/container";
import { Flex } from "@/components/ui/flex";
import { Metadata } from "next";

export const metadata: Metadata = {
    referrer: "no-referrer"
}

export default function Page() {
    return (
        <Flex className="flex-1">
            <Container className="flex-1 my-0! mx-auto">
                <CamShorts />
            </Container>
        </Flex>
    )
}
