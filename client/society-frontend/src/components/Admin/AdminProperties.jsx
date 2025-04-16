import { useEffect, useState } from "react";

const dummyProperties = [
  {
    id: 1,
    houseNumber: "A-101",
    ownerName: "John Smith",
    phone: "+91-9876543210",
    email: "john.smith@example.com",
    flatType: "3 BHK Premium",
    maintenance: 5500,
    isPaid: true,
    updatedAt: "2025-03-15T10:30:00Z",
  },
  {
    id: 2,
    houseNumber: "B-205",
    ownerName: "Sarah Johnson",
    phone: "+91-8765432109",
    email: "sarah.j@example.com",
    flatType: "2 BHK Standard",
    maintenance: 3500,
    isPaid: false,
    updatedAt: "2025-04-01T14:15:00Z",
  },
  {
    id: 3,
    houseNumber: "C-304",
    ownerName: "Raj Patel",
    phone: "+91-7654321098",
    email: "raj.patel@example.com",
    flatType: "4 BHK Luxury",
    maintenance: 7800,
    isPaid: true,
    updatedAt: "2025-03-28T09:45:00Z",
  },
  {
    id: 4,
    houseNumber: "A-203",
    ownerName: "Maria Garcia",
    phone: "+91-6543210987",
    email: "maria.g@example.com",
    flatType: "2 BHK Premium",
    maintenance: 4200,
    isPaid: false,
    updatedAt: "2025-04-05T11:20:00Z",
  },
  {
    id: 5,
    houseNumber: "D-401",
    ownerName: "David Chen",
    phone: "+91-9876543211",
    email: "david.chen@example.com",
    flatType: "3 BHK Standard",
    maintenance: 4800,
    isPaid: true,
    updatedAt: "2025-03-22T16:10:00Z",
  },
  {
    id: 6,
    houseNumber: "B-107",
    ownerName: "Priya Sharma",
    phone: "+91-8765432100",
    email: "priya.s@example.com",
    flatType: "1 BHK Standard",
    maintenance: 2500,
    isPaid: false,
    updatedAt: "2025-04-10T08:30:00Z",
  },
];

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0,
    totalMaintenance: 0,
    collectedMaintenance: 0,
  });

  useEffect(() => {
    // Try to fetch from API first
    fetch("http://localhost:8080/api/admin/properties")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        calculateStats(data);
      })
      .catch((err) => {
        console.error("Using dummy data due to:", err);
        // Use dummy data if API fails
        setProperties(dummyProperties);
        calculateStats(dummyProperties);
      })
      .finally(() => setLoading(false));
  }, []);

  const calculateStats = (data) => {
    const paidProperties = data.filter((p) => p.isPaid);
    const unpaidProperties = data.filter((p) => !p.isPaid);
    const totalMaintenance = data.reduce(
      (acc, curr) => acc + curr.maintenance,
      0
    );
    const collectedMaintenance = paidProperties.reduce(
      (acc, curr) => acc + curr.maintenance,
      0
    );

    setStats({
      total: data.length,
      paid: paidProperties.length,
      unpaid: unpaidProperties.length,
      totalMaintenance,
      collectedMaintenance,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Properties Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Manage and monitor all registered properties
        </p>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm font-medium">
              Total Properties
            </h3>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm font-medium">
              Maintenance Paid
            </h3>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm font-medium">
              Maintenance Pending
            </h3>
            <p className="text-2xl font-bold text-red-600">{stats.unpaid}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-gray-500 text-sm font-medium">
              Collection Rate
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {stats.total ? Math.round((stats.paid / stats.total) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Financial Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-gray-500 text-sm font-medium">
                Total Maintenance
              </h3>
              <p className="text-2xl font-bold text-gray-800">
                ₹{stats.totalMaintenance.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-gray-500 text-sm font-medium">Collected</h3>
              <p className="text-2xl font-bold text-green-600">
                ₹{stats.collectedMaintenance.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-gray-500 text-sm font-medium">Pending</h3>
              <p className="text-2xl font-bold text-red-600">
                ₹
                {(
                  stats.totalMaintenance - stats.collectedMaintenance
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          All Registered Properties
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              <div className="p-1 bg-indigo-600"></div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-indigo-600">
                    {property.houseNumber}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.isPaid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {property.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  {property.ownerName}
                </h3>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{property.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium truncate">{property.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Flat Type</p>
                    <p className="font-medium">{property.flatType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Maintenance</p>
                    <p className="font-medium">
                      ₹{property.maintenance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                  Last Updated:{" "}
                  {new Date(property.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Properties;
