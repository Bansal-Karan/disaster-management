import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";


export default function SafeZones() {
    const [zones, setZones] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/safezones")
            .then((res) => res.json())
            .then((data) => setZones(data));
    }, []);

    return (
        <div className="min-h-screen py-10 justify-center">
            <div className="py-12 px-4 ">
                <h1 className="text-4xl font-bold mb-2">🛑 Safe Zones Near You</h1>

                {/* Map */}
                <div className="py-6">
                    <MapContainer
                        center={[30.7333, 76.7794]} // default Chandigarh
                        zoom={12}
                        style={{ height: "400px", width: "100%" }}
                        className="mb-6"
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {zones.map((zone) => (
                            <Marker key={zone._id} position={[zone.latitude, zone.longitude]}>
                                <Popup>
                                    <b>{zone.name}</b> <br />
                                    {zone.type} <br />
                                    {zone.address} <br />
                                    📞 {zone.contact}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* List View */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {zones.map((zone) => (
                        <div key={zone._id} className="p-4 bg-gray-800 shadow rounded border">
                            <h2 className="text-xl font-semibold">{zone.name}</h2>
                            <p>🏷️ {zone.type}</p>
                            <p>📍 {zone.address}</p>
                            <p>👥 Capacity: {zone.capacity}</p>
                            <p>📞 {zone.contact}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};