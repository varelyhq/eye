'use client'

import { Search } from "lucide-react";
import { Field, FieldLabel } from "./ui/field";
import { Flex } from "./ui/flex";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";

const items = [
    { label: "Domyślnie", value: "default" },
    { label: "Popularność", value: "popular" },
    { label: "A-Z", value: "a-z" },
    { label: "Z-A", value: "z-a" },
]

const show_inactive_items = [
    { label: "Tak", value: "1" },
    { label: "Nie", value: "0" },
]

type Props = {
    query: string
    setQuery: (query: string) => void
    orderBy: string
    setOrderBy: (orderBy: string) => void
    showInactive: string
    setShowInactive: (showInactive: string) => void
}

export function Filters(props: Props) {

    return (
        <Flex className="md:flex-row md:items-end gap-4">
            <Flex className="flex-row items-end gap-4">
                <Field className="md:w-[180px]">
                    <FieldLabel>Sortuj według</FieldLabel>
                    <Select items={items} defaultValue='default' onValueChange={value => value && props.setOrderBy(value)}>
                        <SelectTrigger className="md:w-[180px]">
                            <SelectValue placeholder="Domyślnie" />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                            <SelectGroup>
                                {items.map(item => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
                <Field className="md:w-fit">
                    <FieldLabel>Pokazuj nieaktywne</FieldLabel>
                    <Select items={show_inactive_items} defaultValue='1' onValueChange={value => value && props.setShowInactive(value)}>
                        <SelectTrigger className="md:w-[180px]">
                            <SelectValue placeholder="Tak" />
                        </SelectTrigger>
                        <SelectContent alignItemWithTrigger={false}>
                            <SelectGroup>
                                {show_inactive_items.map(item => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </Field>
            </Flex>
            <InputGroup className="md:ml-auto md:w-fit">
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupInput
                    value={props.query}
                    onChange={e => props.setQuery(e.target.value)}
                    autoComplete='off'
                    placeholder="Szukaj kamer..."
                />
            </InputGroup>
        </Flex>
    )
}
