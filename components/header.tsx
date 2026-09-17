import Link from "next/link";
import { Logo } from "./logo";
import { Container } from "./ui/container";
import { Flex } from "./ui/flex";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { Heart, Search } from "lucide-react";
import { Separator } from "./ui/separator";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { SearchCams } from "./search-cams";

export function Header() {
    return (
        <Flex className="flex-row h-16 bg-background">
            <Container className="my-0! flex-row items-center">
                <Logo size='sm' />
                <SearchCams />
                <NavigationMenu className=''>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            {/* TODO: Dodać rozwijane menu z np. miastami */}
                            <NavigationMenuLink render={<Link href="/cams">Wszystkie kamery</Link>} />
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink render={<Link href="/shorts">Cam Shorts</Link>} />
                        </NavigationMenuItem>
                        <Separator orientation='vertical' className='mx-2' />
                        <NavigationMenuItem>
                            <NavigationMenuLink render={<Link href="/shorts">Ulubione <Heart className="text-rose-500" /></Link>} />
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </Container>
        </Flex>
    )
}
