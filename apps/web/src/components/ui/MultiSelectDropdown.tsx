import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "./icons/Icons";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Loading } from "./Loading";

interface MultiSelectDropdown2Props {
    placeholder: string;
    selectedKeys: Set<string>;
    loadingKeys?: Set<string>;
    values: Map<string, string>;
    onSelect: (key: string) => void;
    onDeselect: (key: string) => void;
    closeOnSelect?: boolean;
}

export function MultiSelectDropdown({ placeholder, selectedKeys, loadingKeys = new Set(), values, onSelect, onDeselect, closeOnSelect = false }: MultiSelectDropdown2Props) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const onValueElementClick = (key: string) => {
        if (loadingKeys.has(key)) return;
        selectedKeys.has(key) ? onDeselect(key) : onSelect(key);
        if (closeOnSelect) {
            setIsOpen(false);
        }
    }

    const valueElements = Array.from(values.entries()).map(([key, value]) => {
        return (
            <div key={key} className="flex gap-3 px-4 py-2 text-left font-medium items-center select-none transition-colors cursor-pointer hover:bg-background-tertiary" onClick={() => onValueElementClick(key)}>
                <span onClick={event => event.stopPropagation()}>
                    {loadingKeys.has(key) ? (
                        <Loading size="small" />
                    ) : (
                        <Checkbox
                            isSelected={selectedKeys.has(key)}
                            onSelect={() => onSelect(key)}
                            onDeselect={() => onDeselect(key)}
                        />
                    )}
                </span>
                <span className="wrap-anywhere">{value}</span>
            </div>
        );
    });

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
                                    <div className="flex gap-2">
                                        <span className="whitespace-nowrap opacity-50">{placeholder}</span>
                                        <span className="whitespace-nowrap font-medium">{selectedKeys.size} selected</span>
                                    </div>
                                    <ChevronDownIcon className={`w-4 h-4 ml-2 -mr-1  ${isOpen ? "rotate-180" : ""}`} />
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
                    <div className="left-1/2 -translate-x-1/2 z-1000 absolute w-full max-h-100 overflow-scroll mt-2 origin-top-right bg-background-secondary border border-background-tertiary divide-y divide-background-tertiary rounded-md shadow-lg outline-none">
                        <>
                            {valueElements}
                        </>
                    </div>
                ) : null
            }
        </div >
    );
};
