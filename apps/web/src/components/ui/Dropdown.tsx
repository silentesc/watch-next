import { useState, useRef, useEffect, type JSX, useCallback, useMemo } from "react";
import { Button } from "./Button";
import { ChevronDownIcon } from "./icons/Icons";

interface DropdownProps {
    title: string | React.ReactElement | JSX.Element | JSX.Element[];
    values: Map<string, string>;
    onSelect: (key: string) => void;
    alignedRight?: boolean;
    closeOnSelect?: boolean;
}

export function Dropdown({ title, values, onSelect, alignedRight = false, closeOnSelect = true }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const onValueElementClick = (key: string) => {
        onSelect(key);
        if (closeOnSelect) {
            setIsOpen(false);
        }
    }

    const valueElements = useMemo(() =>
        Array.from(values.entries()).map(([key, value]) =>
            <p key={key} className="block w-full px-4 py-2 text-md text-left transition-colors cursor-pointer hover:bg-background-tertiary" onClick={() => onValueElementClick(key)}>{value}</p>
        ), [values]);

    // Close dropdown when clicking outside
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, handleClickOutside]);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Trigger Button */}
            <div>
                <Button
                    value={
                        (
                            <>
                                <div className="flex justify-between items-center">
                                    {
                                        typeof title === "string" ? (
                                            <span className="whitespace-nowrap">{title}</span>
                                        ) : (
                                            title
                                        )
                                    }
                                    <ChevronDownIcon className={`w-5 h-5 ml-2 -mr-1  ${isOpen ? "rotate-180" : ""}`} />
                                </div>
                            </>
                        )
                    }
                    onClick={toggleDropdown}
                />
            </div>

            {/* Dropdown Menu */}
            {
                isOpen ? (
                    <div className={`${alignedRight ? "right-0" : null} z-1000 absolute w-56 max-h-100 overflow-scroll mt-2 origin-top-right bg-background-secondary border border-background-tertiary divide-y divide-background-tertiary rounded-md shadow-lg outline-none`}>
                        <>
                            {valueElements}
                        </>
                    </div>
                ) : null
            }
        </div >
    );
}
