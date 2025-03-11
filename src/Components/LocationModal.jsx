import { useState, useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const LocationModal = ({ setSelectedArea, setIsModalVisiblee }) => {
  const [orderType, setOrderType] = useState("Delivery");
  const [selectedArea, setSelectedAreaState] = useState({
    ariaId: "",
    areaName: "",
  });
  const [areas, setAreas] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const storeId = localStorage.getItem("storeId");
    if (storeId) {
      fetchAreas(storeId);
    }
  }, []);

  const fetchAreas = async (storeId) => {
    try {
      const response = await fetch(
        `https://api.tapppp.com/api/Stores/fetch_arias?store_id=${storeId}`,
        {
          method: "POST",
          headers: { Accept: "*/*" },
        }
      );
      const data = await response.json();
      if (data.arias_list) {
        setAreas(data.arias_list);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const handleConfirm = () => {
    if (selectedArea.areaName && selectedArea.ariaId) {
      setSelectedArea(selectedArea);
      setIsModalVisiblee(false);
    }
  };

  const useCurrentLocation = () => {
    alert("Fetching current location...");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-96 max-w-full">
        <div className="text-center">
          <h2 className="text-xl font-bold">Select Your Order Type</h2>
          <div className="flex justify-center gap-4 mt-3">
            {["Delivery", "Pick-Up"].map((type) => (
              <button
                key={type}
                className={`px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${orderType === type
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                onClick={() => setOrderType(type)}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <h3 className="text-center text-lg font-semibold mt-5">
          Please Select Your Location
        </h3>

        {orderType === "Delivery" && (
          <div>
            <div className="flex justify-center items-center">
              <button
                onClick={useCurrentLocation}
                className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-2 px-4 rounded-lg mt-4 hover:bg-gray-200 transition"
              >
                <FaMapMarkerAlt /> Use Current Location
              </button>
            </div>

            {/* Custom Dropdown */}
            <div className="relative mt-4">
              <div
                className="w-full p-2 border rounded-lg cursor-pointer bg-white"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {selectedArea.areaName || "Select Area"}
              </div>

              {dropdownOpen && (
                <div className="absolute w-full bg-white border mt-1 rounded-lg shadow-md max-h-40 overflow-y-auto z-10">
                  {areas.length > 0 ? (
                    areas.map((item, index) => (
                      <div
                        key={item.ariaId}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => {
                          setSelectedAreaState({
                            ariaId: item.ariaId,
                            areaName: item.areaName,
                          });
                          setDropdownOpen(false);
                        }}
                      >
                        {item.areaName}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">Loading areas...</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {orderType === "Pick-Up" && (
          <p className="text-center text-gray-600 mt-4">
            Please visit our nearest store for pickup.
          </p>
        )}

        <button
          className={`mt-5 w-full py-2 text-white font-medium rounded-lg transition-all ${selectedArea.areaName
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
            }`}
          onClick={handleConfirm}
          disabled={!selectedArea.areaName}
        >
          {orderType === "Delivery" ? "Select" : "Confirm Pick-Up"}
        </button>
      </div>
    </div>
  );
};

export default LocationModal;
