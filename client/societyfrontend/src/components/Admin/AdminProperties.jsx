import { useEffect, useState } from "react";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    paymentStatus: "all", // all, paid, unpaid
    flatType: "all",
  });
  const url = import.meta.env.VITE_API_URL;

  const [flatTypes, setFlatTypes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0,
    totalMaintenance: 0,
    collectedMaintenance: 0,
  });

  useEffect(() => {
    // Fetch data from the API
    fetch(`${url}/api/v1/user/all`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((responseData) => {
        // Extract the users array from the response
        if (responseData && responseData.users) {
          const userData = responseData.users;
          setProperties(userData);
          setFilteredProperties(userData);
          calculateStats(userData);

          // Extract unique flat types for filter dropdown
          const uniqueFlatTypes = [
            ...new Set(userData.map((p) => p.flatType).filter(Boolean)),
          ];
          setFlatTypes(uniqueFlatTypes);
        } else {
          throw new Error("Invalid data format received from API");
        }
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Apply search and filters
  useEffect(() => {
    let result = [...properties];

    // Apply payment status filter
    if (filters.paymentStatus !== "all") {
      const isPaid = filters.paymentStatus === "paid";
      result = result.filter((property) => property.isPaid === isPaid);
    }
    console.log("Filtered Properties", result);
    // Apply flat type filter
    if (filters.flatType !== "all") {
      result = result.filter(
        (property) => property.flatType === filters.flatType
      );
    }

    // Apply search term
    if (searchTerm.trim() !== "") {
      const lowercasedSearch = searchTerm.toLowerCase();
      result = result.filter(
        (property) =>
          property.houseNumber?.toLowerCase().includes(lowercasedSearch) ||
          property.ownerName?.toLowerCase().includes(lowercasedSearch) ||
          property.email?.toLowerCase().includes(lowercasedSearch) ||
          property.phoneNumber?.includes(searchTerm) ||
          property.flatType?.toLowerCase().includes(lowercasedSearch)
      );
    }

    setFilteredProperties(result);
  }, [searchTerm, filters, properties]);

  const calculateStats = (data) => {
    const paidProperties = data.filter((p) => p.isPaid);
    const unpaidProperties = data.filter((p) => !p.isPaid);
    const totalMaintenance = data.reduce(
      (acc, curr) => acc + (curr.maintenance || 0),
      0
    );
    const collectedMaintenance = paidProperties.reduce(
      (acc, curr) => acc + (curr.maintenance || 0),
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      paymentStatus: "all",
      flatType: "all",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">
          Error loading properties: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Properties Dashboard
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"></div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-grow md:max-w-md">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            <div className="flex flex-wrap gap-3">
              {/* Payment Status Filter */}

              {/* Flat Type Filter */}
              <div>
                <select
                  value={filters.flatType}
                  onChange={(e) =>
                    handleFilterChange("flatType", e.target.value)
                  }
                  className="py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="all">All Flat Types</option>
                  {flatTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm ||
                filters.paymentStatus !== "all" ||
                filters.flatType !== "all") && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Filter Summary */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredProperties.length} of {properties.length}{" "}
            properties
            {(searchTerm ||
              filters.paymentStatus !== "all" ||
              filters.flatType !== "all") && <span> (filtered)</span>}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          All Registered Properties
        </h2>

        {filteredProperties.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-xl text-gray-600">
              No properties found matching your criteria
            </p>
            {(searchTerm ||
              filters.paymentStatus !== "all" ||
              filters.flatType !== "all") && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property._id || property.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div className="p-1 bg-indigo-600"></div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-indigo-600">
                      {property.houseNumber}
                    </h2>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    {property.ownerName}
                  </h3>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{property.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium truncate">{property.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Flat Type</p>
                      <p className="font-medium">{property.flatType}</p>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
                    Last Updated:{" "}
                    {property.updatedAt
                      ? new Date(property.updatedAt).toLocaleDateString()
                      : "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
