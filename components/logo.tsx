import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { AuroraText } from "./ui/aurora-text"

const logoVariants = cva(
    "select-none font-bold tracking-tight text-foreground brand-font",
    {
        variants: {
            size: {
                default: "text-5xl md:text-7xl drop-shadow-sm",
                sm: "text-xl",
                lg: "text-6xl md:text-8xl drop-shadow-md",
            },
        },
        defaultVariants: {
            size: "default",
        },
    }
)

type Props = VariantProps<typeof logoVariants> & {
    className?: string
}

export function Logo({ size, className }: Props) {
    return (
        <Link href='/'>
            <h1 className={cn(logoVariants({ size }), className)}>
                Varely&nbsp;<AuroraText>Cams</AuroraText>
            </h1>
        </Link>
    )
}
