"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // backend will validate admin
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error("Login failed");
            const data = await res.json();

            // Save token (or flag)
            localStorage.setItem("adminToken", data.token || "logged-in");

            window.dispatchEvent(new Event("admin-auth-change"));

            router.push("/admin/dashboard");
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <header style={{ marginBottom: "2rem" }}>
                <h1>Admin Login</h1>
                <p>Access the zorokart administration dashboard.</p>
            </header>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="admin@zorokart.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </main>
    );
}
