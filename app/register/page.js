"use client";

import { useEffect, useState, useRef } from "react";


export default function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        accountType: "",
        video: null,
        paymentDone: false,
    });
    const [isMobile, setIsMobile] = useState(false);

    const upiId = "zorokartindia2@fbl";
    const upiName = "Akshayavahini";
    const amount = 999;

    const upiLink = `upi://pay?pa=${upiId}&pn=${upiName}&am=${amount}&cu=INR&tn=Zorokart Registration`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;

    useEffect(() => {
        setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }, []);

    const copyUpiId = () => {
        navigator.clipboard.writeText(upiId);
        alert("UPI ID copied to clipboard");
    };

    const [errors, setErrors] = useState({
        email: "",
        phone: "",
    });

    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, type, value, checked, files } = e.target;

        if (name === "phone") {
            const numericValue = value.replace(/\D/g, "").slice(0, 10);
            setFormData({ ...formData, [name]: numericValue });

            // Real-time phone validation
            if (numericValue.length > 0 && numericValue.length < 10) {
                setErrors((prev) => ({ ...prev, phone: "Phone number must be exactly 10 digits." }));
            } else {
                setErrors((prev) => ({ ...prev, phone: "" }));
            }
            return;
        }

        if (name === "email") {
            setFormData({ ...formData, [name]: value });

            // Real-time email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value.length > 0 && !emailRegex.test(value)) {
                setErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
            } else {
                setErrors((prev) => ({ ...prev, email: "" }));
            }
            return;
        }

        setFormData({
            ...formData,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "file"
                        ? files[0]
                        : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(formData.email);
        const isPhoneValid = formData.phone.length === 10;

        if (!isEmailValid || !isPhoneValid) {
            setErrors({
                email: isEmailValid ? "" : "Please enter a valid email address.",
                phone: isPhoneValid ? "" : "Phone number must be exactly 10 digits.",
            });
            alert("Please fix the errors before submitting.");
            return;
        }

        setLoading(true);

        try {
            let videoUrl = "";

            if (formData.video) {
                const uploadResult = await uploadVideoToCloudinary(formData.video);
                videoUrl = uploadResult.secure_url;
            }

            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                accountType: formData.accountType,
                paymentDone: formData.paymentDone,
                videoUrl,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            alert("Registration successful!");

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                accountType: "",
                video: null,
                paymentDone: false,
            });

            // Clear file input manually
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }

        } catch (err) {
            console.error(err);
            alert(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };


    const uploadVideoToCloudinary = async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "ecommerce_videos");

        const res = await fetch(
            "https://api.cloudinary.com/v1_1/daj8zz425/video/upload",
            {
                method: "POST",
                body: data,
            }
        );

        if (!res.ok) {
            throw new Error("Video upload failed");
        }

        return res.json();
    };


    return (
        <main>
            <header style={{ marginBottom: "2rem" }}>
                <h1>Create Account</h1>
                <p>Join the Akshayavahini community and start your journey with us.</p>
            </header>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="accountType">Account Type</label>
                    <select
                        id="accountType"
                        name="accountType"
                        value={formData.accountType}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="" disabled>Select Account Type</option>
                        <option value="agent">Agent</option>
                        <option value="vendor">Vendor</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="firstName">First Name</label>
                    <input id="firstName" name="firstName" type="text" onChange={handleChange} required disabled={loading} value={formData.firstName} />
                </div>

                <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input id="lastName" name="lastName" type="text" onChange={handleChange} required disabled={loading} value={formData.lastName} />
                </div>

                <div>
                    <label htmlFor="email">Email address</label>
                    <input id="email" type="email" name="email" onChange={handleChange} placeholder="name@example.com" required disabled={loading} value={formData.email} />
                    {errors.email && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.25rem" }}>{errors.email}</p>}
                </div>

                <div>
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" type="tel" name="phone" onChange={handleChange} placeholder="10-digit number" required disabled={loading} value={formData.phone} maxLength="10" />
                    {errors.phone && <p style={{ color: "red", fontSize: "0.85rem", marginTop: "0.25rem" }}>{errors.phone}</p>}
                </div>

                <div>
                    <label htmlFor="video">Introduction Video</label>
                    <input id="video" type="file" name="video" accept="video/*" onChange={handleChange} disabled={loading} ref={fileInputRef} />
                </div>
                <div>
                    {!isMobile && (
                        <>
                            <img src={qrUrl} alt="UPI QR Code" className="qr-image" />
                            <p>Scan using Google Pay / PhonePe or any other UPI app</p>
                            <p>UPI ID: {upiId}</p>

                            <button onClick={copyUpiId} className="copy-btn">
                                Copy UPI ID
                            </button>
                        </>
                    )}

                    {isMobile && (
                        <a href={upiLink} className="upi-button">
                            Pay ₹{amount} via UPI App
                        </a>
                    )}
                </div>

                <div style={{ flexDirection: "row", alignItems: "center", gap: "0.75rem", padding: "0.5rem 0" }}>
                    <input
                        id="paymentDone"
                        type="checkbox"
                        name="paymentDone"
                        onChange={handleChange}
                        style={{ width: "auto" }}
                        disabled={loading}
                        checked={formData.paymentDone}
                    />
                    <label htmlFor="paymentDone" style={{ cursor: "pointer" }}>
                        I have completed the payment
                    </label>
                </div>

                <button type="submit" style={{ marginTop: "1rem" }} disabled={loading}>
                    {loading ? "Registering..." : "Register Now"}
                </button>
            </form>
        </main>
    );
}
