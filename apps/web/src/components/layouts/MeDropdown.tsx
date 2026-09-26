import { useState, useRef, useEffect } from "react";
import type { Me } from "../../api/me"
import { logout } from "../../api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { meQueryKey } from "../../hooks/use_me";

interface MeDropdownProps {
    me: Me;
    isMobile?: boolean;
}

export function MeDropdown({ me, isMobile = false }: MeDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Logout mutation
    const mutation = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: meQueryKey });
            navigate("/");
        }
    });

    // Navigate to lists
    const onCustomLists = () => {
        setIsOpen(false);
        navigate("/custom-lists");
    }

    // Logout event
    const onLogout = () => {
        mutation.mutate();
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={toggleDropdown}
                className="inline-flex justify-center w-full outline-none items-center text-xl hover:cursor-pointer"
            >
                {me.username}
                <svg className={`w-5 h-5 ml-2 -mr-1 ${isOpen ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={`z-1000 absolute w-56 mt-2 origin-top-right bg-background-secondary border border-background-tertiary divide-y divide-background-tertiary rounded-md shadow-lg outline-none ${isMobile ? "-right-1/2 bottom-10" : "right-0"}`}>
                    <div>
                        <button className="block w-full px-4 py-2 text-md text-left transition-colors hover:bg-background-tertiary cursor-pointer" onClick={onCustomLists}>Custom Lists</button>
                    </div>
                    <div>
                        <button className="block w-full px-4 py-2 text-md text-left transition-colors hover:bg-background-tertiary cursor-pointer" onClick={onLogout}>Sign out</button>
                    </div>
                </div>
            )}
        </div>
    );
}
