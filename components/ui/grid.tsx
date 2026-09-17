import { cn } from "@/lib/utils"
import type { ElementType, ComponentPropsWithoutRef, RefObject } from "react"

type Props<T extends ElementType = "div"> = {
    as?: T
    children?: React.ReactNode
    className?: string
    ref?: RefObject<null>;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children" | "className">

export function Grid<T extends ElementType = "div">({ as, children, className, ...props }: Props<T>) {

    const Component = as ?? "div"

    return (
        <Component className={cn("grid min-w-0", className)} {...props}>
            {children}
        </Component>
    )
}
