"use client"
import React, { use } from 'react'
import { useEffect, useState } from 'react'
interface LegalInfo {
    pan: string,
    gst: string
}
interface Address {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
}
interface Profile {
    category: string;
    subcategory: string;
    addresses: {
        registered: Address;
    };
}
interface CampaignOwner {
    email: string;
    phone: number;
    legal_business_name: string;
    customer_facing_business_name: string;
    contact_name: string;
    business_type: string;
    profile: Profile;
    legal_info: LegalInfo;
}
const Dashboard = () => {
    const [owner, setOwner] = useState<CampaignOwner>({
        email: "",
        phone: "",
        legal_business_name: "",
        contact_name: "",
        business_type: "",
        profile: {
            category: "",
            subcategory: "",
            addresses: {
                registered: {
                    street1: "",
                    street2: "",
                    city: "",
                    state: "",
                    postal_code: "",
                    country: "IN",
                },
            },
        },
        legal_info: {
            pan: "",
            gst: "",
        },
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: string | number) => {
        // Nested updates for simplicity
        if (field.includes(".")) {
            const keys = field.split(".");
            setOwner((prev) => {
                const updated = { ...prev } as any;
                let obj = updated;
                for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
                obj[keys[keys.length - 1]] = value;
                return updated;
            });
        } else {
            setOwner((prev) => ({ ...prev, [field]: value }));
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/create-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...owner,
                    type: "route",
                    reference_id: Math.floor(Math.random() * 100000).toString(), // optional
                }),
            });
            const data = await res.json();
            console.log("Account created:", data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Campaign Owner Info</h1>

            <input
                type="text"
                placeholder="Legal Business Name"
                value={owner.legal_business_name}
                onChange={(e) => handleChange("legal_business_name", e.target.value)}
                className="border p-2 mb-2 w-full"
            />

            <input
                type="text"
                placeholder="Contact Name"
                value={owner.contact_name}
                onChange={(e) => handleChange("contact_name", e.target.value)}
                className="border p-2 mb-2 w-full"
            />

            <input
                type="email"
                placeholder="Email"
                value={owner.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="border p-2 mb-2 w-full"
            />

            <input
                type="text"
                placeholder="Phone"
                value={owner.phone}
                onChange={(e) => handleChange("phone", Number(e.target.value))}
                className="border p-2 mb-2 w-full"
            />

            <input
                type="text"
                placeholder="Business Type"
                value={owner.business_type}
                onChange={(e) => handleChange("business_type", e.target.value)}
                className="border p-2 mb-2 w-full"
            />

            <input
                type="text"
                placeholder="PAN"
                value={owner.legal_info.pan}
                onChange={(e) => handleChange("legal_info.pan", e.target.value)}
                className="border p-2 mb-2 w-full"
            />

            <input
                type="text"
                placeholder="GST"
                value={owner.legal_info.gst}
                onChange={(e) => handleChange("legal_info.gst", e.target.value)}
                className="border p-2 mb-2 w-full"
            />

            <input
                type="text"
                placeholder="Street 1"
                value={owner.profile.addresses.registered.street1}
                onChange={(e) => handleChange("profile.addresses.registered.street1", e.target.value)}
                className="border p-2 mb-2 w-full"
            />

            <input
                type="text"
                placeholder="City"
                value={owner.profile.addresses.registered.city}
                onChange={(e) => handleChange("profile.addresses.registered.city", e.target.value)}
                className="border p-2 mb-2 w-full"
            />

            <input
                type="text"
                placeholder="State"
                value={owner.profile.addresses.registered.state}
                onChange={(e) => handleChange("profile.addresses.registered.state", e.target.value)}
                className="border p-2 mb-2 w-full"
            />

            <input
                type="text"
                placeholder="Postal Code"
                value={owner.profile.addresses.registered.postal_code}
                onChange={(e) => handleChange("profile.addresses.registered.postal_code", e.target.value)}
                className="border p-2 mb-2 w-full"
            />

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
            >
                {loading ? "Creating..." : "Create Account"}
            </button>

        </div >
    )
}

export default Dashboard;

