import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "./ui/container";
import { Flex } from "./ui/flex";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "./ui/navigation-menu";
import { Clapperboard, Heart, LayoutGrid } from "lucide-react";
import { Separator } from "./ui/separator";
import { SearchCams } from "./search-cams";

export function Header() {
    return (
        <Flex className="flex-row h-16 bg-background">
            <Container className="my-0! flex-row items-center gap-0 md:gap-4">
                <Logo size='sm' />
                <SearchCams />
                <NavigationMenu className=''>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            {/* TODO: Dodać rozwijane menu z np. miastami */}
                            <NavigationMenuLink render={
                                <Link href="/cams">
                                    <span className="hidden md:inline">Wszystkie kamery</span>
                                    <LayoutGrid className="md:hidden" />
                                </Link>
                            } />
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink render={
                                <Link href="/shorts">
                                    <span className="hidden md:inline">Cam Shorts</span>
                                    <Clapperboard className="md:hidden" />
                                </Link>
                            } />
                        </NavigationMenuItem>
                        <Separator orientation='vertical' className='mx-2' />
                        <NavigationMenuItem>
                            <NavigationMenuLink render={
                                <Link href="/#favorite_cams">
                                    <span className="hidden md:inline">Ulubione</span>
                                    <Heart className="text-rose-500" />
                                </Link>
                            } />
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </Container>
        </Flex>
    )
}
