'use client'

import { Search } from "lucide-react";
import { Flex } from "./ui/flex";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useState } from "react";
import { serverApi } from "@/lib/server-api";
import { CamType } from "@/types/cam-type";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "./ui/item";
import Link from "next/link";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { Button } from "./ui/button";

function CamSearchResult({ cam }: { cam: CamType }) {
    return (
        <Item
            variant='muted'
            className="items-start bg-transparent hover:bg-muted/50 px-2 py-2"
            render={<DialogClose nativeButton={false} render={<Link href={`/cams/${cam.slug}`} />} />}
        >
            <ItemMedia variant='image'>
                <img
                    src={cam.image}
                    alt={cam.name}
                    width={128}
                    height={128}
                    className="object-cover"
                />
            </ItemMedia>
            <ItemContent>
                <ItemTitle className="line-clamp-2">{cam.name}</ItemTitle>
                <ItemDescription className="line-clamp-1">{cam.title}</ItemDescription>
            </ItemContent>
        </Item>
    )
}

export function SearchCams() {

    const [text, setText] = useState('')
    const [results, setResults] = useState<CamType[]>([])

    const queryResults = async (query: string) => {
        const { data, error } = await serverApi.get<CamType[]>(`/cams/search?q=${query}`)
        if (error) {
            return
        }
        setResults(data)
    }

    const onChange = (e: { target: { value: string } }) => {
        const newText = e.target.value
        setText(newText)
        if (newText.trim()) queryResults(newText.trim())
        else setResults([])
    }

    return (
        <Flex className="relative ml-auto">
            <Dialog>
                <DialogTrigger
                    nativeButton={false}
                    render={
                        <Flex>
                            <InputGroup className="hidden sm:flex w-fit cursor-pointer">
                                <InputGroupAddon>
                                    <Search />
                                </InputGroupAddon>
                                <InputGroupInput disabled autoComplete='off' placeholder="Szukaj kamer..." className="cursor-pointer" />
                            </InputGroup>
                            <Button variant='ghost' size='icon' className='sm:hidden'>
                                <Search />
                            </Button>
                        </Flex>
                    } />
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Szukaj kamer</DialogTitle>
                        {/* <DialogDescription>
                        </DialogDescription> */}
                    </DialogHeader>
                    <InputGroup className="w-full">
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                        <InputGroupInput value={text} onChange={onChange} autoComplete='off' placeholder="Szukaj kamer..." />
                    </InputGroup>
                    <Flex className="h-78.5 max-h-78.5 overflow-y-auto pr-1">
                        {Boolean(results.length) ?
                            <Flex className="p-1 border border-border rounded-3xl">
                                {results.map(cam => <CamSearchResult key={cam.id} cam={cam} />)}
                            </Flex>
                            :
                            !results.length && text ?
                                <Empty className="border rounded-3xl">
                                    <EmptyHeader>
                                        <EmptyMedia variant='icon'>
                                            <Search />
                                        </EmptyMedia>
                                        <EmptyTitle>Brak wyników</EmptyTitle>
                                        <EmptyDescription>Spróbuj wyszukać czegoś innego.</EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                                :
                                <Empty className="border rounded-3xl">
                                    <EmptyHeader>
                                        <EmptyMedia variant='icon'>
                                            <Search />
                                        </EmptyMedia>
                                        <EmptyTitle>Rozpocznij wyszukiwanie</EmptyTitle>
                                        <EmptyDescription>Wpisz coś, aby pokazały się wyniki.</EmptyDescription>
                                    </EmptyHeader>
                                </Empty>
                        }
                    </Flex>
                </DialogContent>
            </Dialog>
        </Flex>
    )
}
