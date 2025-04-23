import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  MessageSquare,
  Search,
  Trash,
  Plus,
  X as XIcon,
  EyeIcon,
} from "lucide-react";
import { useState, useEffect } from "react";

const ComplaintsComponent = () => {
  const [complaints, setComplaints] = useState([]);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newComplaint, setNewComplaint] = useState({
    houseNo: "",
    ownerName: "",
    complaintDate: new Date().toISOString().split("T")[0],
    description: "",
    proof: "",
    category: "General",
    status: "reported",
  });

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:3000/api/v1/problem/all-problems",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch complaints");
        }

        const data = await response.json();

        // Transform API data to match component structure
        const transformedData = data.map((item, index) => ({
          id: item._id,
          houseNo: item.user.houseNumber,
          ownerName: item.user.ownerName,
          phoneNumber: item.user.phoneNumber,
          complaintDate: new Date(item.createdAt).toISOString().split("T")[0],
          description: item.description,
          proof: item.image,
          category: item.category,
          status: item.status,
        }));

        setComplaints(transformedData);
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("category", newComplaint.category);
      formData.append("description", newComplaint.description);

      if (newComplaint.proof instanceof File) {
        formData.append("image", newComplaint.proof);
      }

      const response = await fetch(
        "http://localhost:3000/api/v1/problem/report",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      // Refresh complaints list
      const refreshResponse = await fetch(
        "http://localhost:3000/api/v1/problem/all-problems",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!refreshResponse.ok) {
        throw new Error("Failed to refresh complaints");
      }

      const data = await refreshResponse.json();

      // Transform API data
      const transformedData = data.map((item) => ({
        id: item._id,
        houseNo: item.user.houseNumber,
        ownerName: item.user.ownerName,
        phoneNumber: item.user.phoneNumber,
        complaintDate: new Date(item.createdAt).toISOString().split("T")[0],
        description: item.description,
        proof: item.image,
        category: item.category,
        status: item.status,
      }));

      setComplaints(transformedData);
      setShowComplaintForm(false);
      setNewComplaint({
        houseNo: "",
        ownerName: "",
        complaintDate: new Date().toISOString().split("T")[0],
        description: "",
        proof: "",
        category: "General",
        status: "reported",
      });

      // Show success message
      alert("Complaint submitted successfully!");
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("Failed to submit complaint: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/v1/problem/problem-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setComplaints(
        complaints.map((complaint) =>
          complaint.id === id ? { ...complaint, status: newStatus } : complaint
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  const handleDeleteComplaint = async (id) => {
    if (!confirm("Are you sure you want to delete this complaint?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/v1/problem/problem-delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete complaint");
      }

      setComplaints(complaints.filter((complaint) => complaint.id !== id));
    } catch (err) {
      console.error("Error deleting complaint:", err);
      alert("Failed to delete complaint: " + err.message);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewComplaint((prev) => ({
        ...prev,
        proof: file,
      }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "reported":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Reported
          </span>
        );
      case "in-progress":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <AlertTriangle size={12} className="mr-1" />
            In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Resolved
          </span>
        );
      default:
        return null;
    }
  };

  const filteredComplaints = complaints.filter(
    (complaint) =>
      (complaint.houseNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || complaint.status === filterStatus)
  );

  const reportedCount = complaints.filter(
    (complaint) => complaint.status === "reported"
  ).length;
  const inProgressCount = complaints.filter(
    (complaint) => complaint.status === "in-progress"
  ).length;
  const resolvedCount = complaints.filter(
    (complaint) => complaint.status === "resolved"
  ).length;

  if (isLoading && complaints.length === 0) {
    return (
      <div className="p-4 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading complaints...</p>
        </div>
      </div>
    );
  }

  if (error && complaints.length === 0) {
    return (
      <div className="p-4">
        <div className="bg-red-100 p-4 rounded-md text-red-800">
          <h2 className="font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-0">
          Complaint Management
        </h1>
        <button
          onClick={() => setShowComplaintForm(!showComplaintForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus size={16} className="mr-1" />
          {showComplaintForm ? "Cancel" : "New Complaint"}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6">
        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-yellow-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">
                Reported Complaints
              </p>
              <p className="text-xl md:text-2xl font-bold text-yellow-600">
                {reportedCount}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-blue-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">
                In Progress Complaints
              </p>
              <p className="text-xl md:text-2xl font-bold text-blue-600">
                {inProgressCount}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <AlertTriangle size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-3 md:p-4 shadow rounded-lg border-l-4 border-green-500">
          <div className="flex justify-between">
            <div>
              <p className="text-xs md:text-sm text-gray-500">
                Resolved Complaints
              </p>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {resolvedCount}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Add Complaint Form */}
      {showComplaintForm && (
        <div className="bg-white p-4 shadow rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-4">Register New Complaint</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={newComplaint.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="General">General</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Security">Security</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proof (Image)
              </label>
              <input
                type="file"
                name="proof"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complaint Description
              </label>
              <textarea
                name="description"
                required
                value={newComplaint.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Please describe your complaint in detail..."
              ></textarea>
            </div>
            <div className="md:col-span-2 flex justify-end space-x-2 mt-2">
              <button
                type="button"
                onClick={() => setShowComplaintForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Complaint"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white p-4 shadow rounded-lg mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by house no or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-3 py-1 rounded ${
                filterStatus === "all"
                  ? "bg-gray-200"
                  : "bg-white border border-gray-300"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("reported")}
              className={`px-3 py-1 rounded ${
                filterStatus === "reported"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-white border border-gray-300"
              }`}
            >
              Reported
            </button>
            <button
              onClick={() => setFilterStatus("in-progress")}
              className={`px-3 py-1 rounded ${
                filterStatus === "in-progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-white border border-gray-300"
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilterStatus("resolved")}
              className={`px-3 py-1 rounded ${
                filterStatus === "resolved"
                  ? "bg-green-100 text-green-800"
                  : "bg-white border border-gray-300"
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Complaints</h2>
        <div className="overflow-x-auto">
          {filteredComplaints.length > 0 ? (
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">House No.</th>
                  <th className="py-2 px-4 text-left">Owner</th>
                  <th className="py-2 px-4 text-left">Category</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Description</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td className="py-2 px-4">{complaint.houseNo}</td>
                    <td className="py-2 px-4">{complaint.ownerName}</td>
                    <td className="py-2 px-4">{complaint.category}</td>
                    <td className="py-2 px-4">{complaint.complaintDate}</td>
                    <td className="py-2 px-4">
                      <div className="max-w-xs truncate">
                        {complaint.description}
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      {getStatusBadge(complaint.status)}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-1">
                        <select
                          value={complaint.status}
                          onChange={(e) =>
                            handleStatusChange(complaint.id, e.target.value)
                          }
                          className="text-sm border border-gray-300 rounded p-1"
                        >
                          <option value="reported">Reported</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                        <button
                          onClick={() => setSelectedComplaint(complaint)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <EyeIcon size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteComplaint(complaint.id)}
                          className="p-1 text-red-600 hover:text-red-800"
                          title="Delete"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No complaints found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Complaint Details</h3>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">House Number</p>
                <p className="font-medium">{selectedComplaint.houseNo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Owner Name</p>
                <p className="font-medium">{selectedComplaint.ownerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium">{selectedComplaint.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Complaint Date</p>
                <p className="font-medium">{selectedComplaint.complaintDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium">
                  {getStatusBadge(selectedComplaint.status)}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Description</p>
                <p className="font-medium">{selectedComplaint.description}</p>
              </div>
              {selectedComplaint.proof && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Image</p>
                  <div className="mt-2">
                    <img
                      src={selectedComplaint.proof}
                      alt="Complaint proof"
                      className="max-h-64 rounded-md"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="border-t pt-4 flex justify-end">
              <button
                onClick={() => setSelectedComplaint(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsComponent;
