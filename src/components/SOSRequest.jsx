import { useState } from "react";

export default function SOSRequest() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        location: "",
        message: "",
    });

    const [status, setStatus] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");

        const res = await fetch("http://localhost:5000/api/sos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (res.ok) {
            setStatus("✅ SOS request sent successfully!");
            setForm({ name: "", email: "", phone: "", location: "", message: "" });
        } else {
            setStatus("❌ Failed to send request: " + data.error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <div className="max-w-md bg-gray-800 shadow-md rounded-2xl px-4 py-2">
                <h1 className="text-2xl font-bold mb-4">🚨 Send SOS Request</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Your Phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="Your Location"
                        value={form.location}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Describe your emergency..."
                        value={form.message}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        rows="3"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
                    >
                        Send SOS
                    </button>
                </form>
                {status && <p className="mt-4 text-center">{status}</p>}
            </div>
        </div>
    );
}
