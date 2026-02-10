"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboard() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("all");
    const [paymentStatus, setPaymentStatus] = useState("all");

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            router.push("/admin/login");
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (res.status === 401 || res.status === 403) {
                    localStorage.removeItem("adminToken");
                    router.replace("/admin/login");
                    throw new Error("Unauthorized");
                }
                return res.json();
            })
            .then((data) => {
                setUsers(Array.isArray(data.users) ? data.users : []);
            })
            .catch(console.error);
    }, [router]);

    const filteredUsers = users.filter((user) => {
        const query = search.toLowerCase();

        const matchesSearch =
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.phone.includes(query);

        const matchesRole = role === "all" || user.accountType === role;

        const matchesPaymentStatus = paymentStatus === "all" || user.paymentDone === (paymentStatus === "paid");

        return matchesSearch && matchesRole && matchesPaymentStatus;
    });
    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Zorokart – User Dashboard Report", 14, 15);

        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

        const tableColumn = [
            "Name",
            "Email",
            "Phone",
            "Role",
            "Payment Status",
        ];

        const tableRows = filteredUsers.map((user) => [
            `${user.firstName} ${user.lastName}`,
            user.email,
            user.phone,
            user.accountType,
            user.paymentDone ? "Paid" : "Unpaid",
        ]);

        autoTable(doc, {
            startY: 30,
            head: [tableColumn],
            body: tableRows,
            styles: {
                fontSize: 9,
            },
            headStyles: {
                fillColor: [255, 122, 0], // zorokart accent
            },
        });

        doc.save("zorokart-users-report.pdf");
    };
    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("adminToken");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${userId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Delete failed");

            // Remove user from frontend immediately
            setUsers((prev) => prev.filter((u) => u._id !== userId));
        } catch (err) {
            alert("Failed to delete user");
            console.error(err);
        }
    };

    const handleTogglePayment = async (user) => {
        try {
            const token = localStorage.getItem("adminToken");

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${user._id}/payment`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        paymentDone: !user.paymentDone,
                    }),
                }
            );

            if (!res.ok) throw new Error("Update failed");

            // Update frontend state
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === user._id
                        ? { ...u, paymentDone: !u.paymentDone }
                        : u
                )
            );
        } catch (err) {
            alert("Failed to update payment status");
            console.error(err);
        }
    };



    return (
        <main style={{ maxWidth: "1200px" }}>
            <header style={{ marginBottom: "2rem" }}>
                <h1>Admin Dashboard</h1>
                <p>Manage users and monitor platform registrations.</p>
            </header>

            {/* Filters */}
            <div className="filters">
                <div>
                    <label htmlFor="search">Search Users</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search Name, Email, or Phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="role">Filter by Role</label>
                    <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="all">All Roles</option>
                        <option value="vendor">Vendors</option>
                        <option value="agent">Agents</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="paymentStatus">Filter by Payment Status</label>
                    <select id="paymentStatus" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
                        <option value="all">All Payments</option>
                        <option value="paid">Paid</option>
                        <option value="unpaid">Unpaid</option>
                    </select>
                </div>
                <button onClick={handleDownloadPDF} className="download-btn">
                    Download PDF
                </button>

                {/* search button */}
                {/* <button className="search-btn" onClick={() => setSearch("")}>Search</button> */}
            </div>

            {/* User table (shown on desktop) */}
            <div className="table-container desktop-only">
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                            <th>Payment Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td style={{ fontWeight: "500" }}>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td style={{ textTransform: "capitalize" }}>{user.accountType || user.role}</td>
                                    <td>{user.paymentDone ? "Paid" : "Unpaid"}</td>
                                    <td>
                                        <button
                                            onClick={() => handleTogglePayment(user)}
                                            title="Toggle Payment Status"
                                            style={{ marginRight: "10px" }}
                                        >
                                            <FontAwesomeIcon icon={faPen} />
                                        </button>

                                        <button
                                            onClick={() => handleDeleteUser(user._id)}
                                            title="Delete User"
                                            style={{ color: "red" }}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                                    No users found matching your filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* User cards (shown on mobile) */}
            <div className="user-cards-container mobile-only">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user._id} className="user-card">
                            <div className="card-header">
                                <h3>{user.firstName} {user.lastName}</h3>
                                <span className={`badge ${user.accountType || user.role}`}>
                                    {user.accountType || user.role}
                                </span>
                            </div>
                            <div className="card-body">
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Phone:</strong> {user.phone}</p>
                                <p>
                                    <strong>Payment:</strong>
                                    <span className={user.paymentDone ? "status-paid" : "status-unpaid"} style={{ marginLeft: "5px" }}>
                                        {user.paymentDone ? "Paid" : "Unpaid"}
                                    </span>
                                </p>
                            </div>
                            <div className="card-actions">
                                <button
                                    onClick={() => handleTogglePayment(user)}
                                    className="action-btn"
                                >
                                    <FontAwesomeIcon icon={faPen} style={{ marginRight: "8px" }} />
                                    {user.paymentDone ? "Mark Unpaid" : "Mark Paid"}
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="action-btn delete"
                                >
                                    <FontAwesomeIcon icon={faTrash} style={{ marginRight: "8px" }} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
                        No users found matching your filters.
                    </div>
                )}
            </div>
        </main>
    );
}
