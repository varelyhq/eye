import { cn } from "@/lib/utils"
import type { ElementType, ComponentPropsWithoutRef } from "react"

type Props<T extends ElementType = "div"> = {
    as?: T
    className?: string
    children?: React.ReactNode
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">

export function Container<T extends ElementType = "div">({ as, className = "", children, ...props }: Props<T>) {

    const Component = as ?? "div"

    return (
        <Component
            className={cn(
                "container mx-auto flex flex-col px-4 my-16 md:my-20 gap-4",
                className
            )}
            {...props}
        >
            {children}
        </Component>
    )
}
