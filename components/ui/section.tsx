import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Flex } from "./flex";

type Props = {
    id?: string
    className?: string
    containerClassName?: string
    children?: React.ReactNode
}

export function Section({ id, className, containerClassName, children }: Props) {
    return (
        <Flex className={cn(className)}>
            <Container id={id} className={cn(containerClassName)}>
                {children}
            </Container>
        </Flex>
    )
}

export function SectionHeader({ className, children }: Props) {
    return (
        <Flex className={cn("gap-1", className)}>
            {children}
        </Flex>
    )
}

export function SectionContent({ className, children }: Props) {
    return (
        <Flex className={cn("gap-4", className)}>
            {children}
        </Flex>
    )
}

export function SectionTitle({ className, children }: Props) {
    return (
        <h2 className={cn("text-2xl md:text-3xl font-semibold", className)}>
            {children}
        </h2>
    )
}

export function SectionDescription({ className, children }: Props) {
    return (
        <p className={cn("text-base text-muted-foreground max-w-2xl", className)}>
            {children}
        </p>
    )
}
