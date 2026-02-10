"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            setIsAdmin(!!localStorage.getItem("adminToken"));
        };

        checkAuth();
        window.addEventListener("storage", checkAuth);
        window.addEventListener("admin-auth-change", checkAuth);
        return () => window.removeEventListener("storage", checkAuth);
        return () => window.removeEventListener("admin-auth-change", checkAuth);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        window.dispatchEvent(new Event("admin-auth-change"));
        router.push("/admin/login");
    };
    const isActive = (path) => {
        if (path === "/") return pathname === "/";
        if (path === "/admin") return pathname.startsWith("/admin");
        return pathname === path;
    };

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const closeMenu = () => setMenuOpen(false);


    return (
        <nav className="navbar">
            <div className="logo">
                <Link href="/" onClick={closeMenu}>
                    <Image src="/images/logo.svg" alt="Logo" width={120} height={60} />
                </Link>
            </div>

            <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
                <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
            </button>

            <div className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
                <Link href="/" className={isActive("/") ? "active-link" : ""} onClick={closeMenu}>
                    Home
                </Link>
                <Link href="/about" className={isActive("/about") ? "active-link" : ""} onClick={closeMenu}>
                    About
                </Link>
                <Link
                    href="/register"
                    className={isActive("/register") ? "active-link" : ""}
                    onClick={closeMenu}
                >
                    Register
                </Link>

                {isAdmin ? (
                    <>
                        <Link
                            href="/admin/dashboard"
                            className={isActive("/admin/dashboard") ? "active-link" : ""}
                            onClick={closeMenu}
                        >
                            Dashboard
                        </Link>
                        <Link href="/admin/login" onClick={() => { handleLogout(); closeMenu(); }}>
                            Logout
                        </Link>
                    </>
                ) : (
                    <Link href="/admin/login" className={isActive("/admin/login") ? "active-link" : ""} onClick={closeMenu}>
                        Login
                    </Link>
                )}
            </div>
        </nav>
    );
}
