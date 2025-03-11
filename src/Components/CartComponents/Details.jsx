import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaShoppingBag } from "react-icons/fa";
import Order from "../CartComponents/Order.jsx";
import Checkoutbutton from "./Checkoutbutton.jsx";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import { Accordion, RadioGroup, Radio } from "rsuite";

const Details = ({
  cartItems,
  formData,
  setFormData,
  handleBackClick,
  toggleCheckout,
  cartData,
}) => {
  const formRef = useRef(null);
  const containerRef = useRef(null);

  const handleChange = (e) => {
    const { id, value } = e.target;

    // If the input field is the "contact" field, restrict alphabetic input and limit to 12 digits
    if (id === "contact") {
      if (/[^\d]/.test(value)) {
        return; // Prevent updating the state with non-numeric characters
      }
      if (value.length > 12) {
        return; // Prevent updating the state if length exceeds 12
      }
    }

    setFormData((prev) => ({ ...prev, [id]: value }));

    // Clear the error for this field if it is corrected
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "", // Clear the error for the current field
    }));
  };

  const [cities, setCities] = useState([]);

  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term
  const [selectedCity, setSelectedCity] = useState(""); // State for the selected city

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form Data:", formData);
      // formData now contains city_id
      setIsSubmitted(true);
    }
  };

  const validateForm = () => {
    let newErrors = {};

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
    }

    // Validate city
    if (!formData.city.trim() || !searchTerm.trim()) {
      newErrors.city = "City is required.";
    }

    // Validate contact
    if (!formData.contact.trim()) {
      newErrors.contact = "Contact is required.";
    } else if (!/^\d{10,12}$/.test(formData.contact)) {
      newErrors.contact = "Contact must be a valid phone number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [errors, setErrors] = useState({});

  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const handleCityChange = (city) => {
    setSelectedCity(city.city_name); // Update selected city name
    setSelectedCityId(city.id); // Update selected city ID
    setFormData({ ...formData, city: city.city_name }); // Update form data
    setSearchTerm(city.city_name); // Update the search term in the input
    setIsAccordionOpen(false); // Close the dropdown

    // Clear the error for city
    setErrors((prevErrors) => ({
      ...prevErrors,
      city: "", // Remove the error for the city field
    }));
  };

  // const validateForm = () => {
  // let newErrors = {};
  // if (!formData.firstName.trim()) {
  //   newErrors.firstName = "First name is required.";
  // }
  // if (!formData.address.trim()) {
  //   newErrors.address = "Address is required.";
  // }
  // if (!formData.city.trim()) {
  //   newErrors.city = "City is required.";
  // }
  // if (!formData.contact.trim()) {
  //   newErrors.contact = "Contact is required.";
  // } else if (!/^\d{10,12}$/.test(formData.contact)) {
  //   newErrors.contact = "Contact must be a valid phone number.";
  // }

  // setErrors(newErrors);
  // return Object.keys(newErrors).length === 0;
  // };

  useEffect(() => {
    const fetchCities = async () => {
      const storedCities = localStorage.getItem("cities"); // Check if cities are already stored

      if (storedCities) {
        setCities(JSON.parse(storedCities)); // Parse and set cities from localStorage
        return;
      }

      try {
        const response = await fetch("https://oms.getorio.com/api/cities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify({ country_id: 1 }),
        });

        const data = await response.json();

        // Validate and map cities
        const validCities = data
          .filter(
            (city) =>
              city?.city_name &&
              city?.id &&
              city?.country_id &&
              city?.province_id
          )
          .map((city) => ({
            id: city.id,
            city_name: city.city_name,
            country_id: city.country_id,
            province_id: city.province_id,
          }));

        setCities(validCities); // Set the valid cities in state
        localStorage.setItem("cities", JSON.stringify(validCities)); // Store cities in localStorage
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const filteredCities = cities.filter(
    (city) =>
      city?.city_name &&
      city.city_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Accordion open state

  const handleButtonClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    containerRef.current.scrollTop = scrollTop - deltaY;
  };
  const [selectedCityId, setSelectedCityId] = useState("");

  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const hasSelectedArea = localStorage.getItem("selectedArea");

  const parsedArea = JSON.parse(hasSelectedArea);
  // console.log(parsedArea.areaName); // Logs: Islamabad
  const businessType = localStorage.getItem("businessType");

  const updatedCartData = {
    ...cartData,
    customerDetails: {
      firstName: formData.firstName,
      address: formData.address,
      customer_aria: businessType === "retail" ? parsedArea.areaName : "", // Set areaName only if businessType is "retail"
      city: formData.city, // City name for display
      city_id: selectedCityId, // City ID for other purposes
      country_id: cities.find((city) => city.id === selectedCityId)?.country_id, // Get country_id from selected city
      province_id: cities.find((city) => city.id === selectedCityId)
        ?.province_id, // Get province_id from selected city
      contact: formData.contact,
      ...(businessType === "retail" && {
        customer_aria: parsedArea.areaName || "",
      }),
    },
  };

  console.log("Updated Cart Data:", updatedCartData);

  const handleBack = () => {
    setIsSubmitted(false); // Hide the form and show cart
  };
  //   If the form is submitted, render the Order component
  if (isSubmitted) {
    return (
      <Order
        formData={formData}
        handleBackClick={handleBackClick}
        cartItems={cartItems}
        handleBack={handleBack}
        toggleCheckout={toggleCheckout}
        cartData={updatedCartData} // Pass the updated cartData
      />
    );
  }

  // Otherwise, render the form and button
  return (
    <div
      style={{ borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}
      className="flex "
    >
      <div
        style={{ borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}
        className="w-full max-w-[34] bg-[#f6f8fc] border-gray-300 rounded-lg "
      >
        <div className="flex justify-end pr-[20px] pt-3">
          <button
            onClick={toggleCheckout}
            className="text-black bg-white rounded-full p-1"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Header with back arrow, title, and shopping icon */}
        <div
          style={{ borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}
          className="w-full flex items-center justify-between py-3" // Added padding for vertical space
        >
          <div
            onClick={handleBackClick}
            className="relative mx-4 rounded-full border border-gray-300 p-2 cursor-pointer hover:bg-gray-200 transition-colors flex items-center justify-center" // Changed mt-5 to mx-4
          >
            <FaArrowLeft className="text-[17px] text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold text-center">Details</h2>
          <div
            onClick={handleBackClick}
            className="relative mx-4 rounded-full border border-gray-300 p-2 cursor-pointer flex items-center justify-center" // Changed mt-5 to mx-4
          >
            <FaShoppingBag className="text-[17px] text-[#20144c]" />
            <span className="absolute top-0 right-0 translate-x-2 -translate-y-2 bg-green-300 text-black text-xs font-semibold rounded-full px-1.5 py-0.5">
              {totalItems}
            </span>
          </div>
        </div>

        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            overflowY: "scroll",
            scrollbarWidth: "none", // Firefox
            "-ms-overflow-style": "none", // Internet Explorer and Edge
          }}
          // Chrome, Safari, and Opera
          className="px-4 small:mb-[1px] sssm:mb-0  small:max-h-[373px] lg:max-h-[390px] lg:mb-[85px] "
        >
          {" "}
          {/* Added scrollable container */}
          <form ref={formRef} onSubmit={handleSubmit} className="ml-0.5">
            <div className="flex justify-between items-center ">
              <h2 className="text-[17px] font-semibold">Address</h2>
            </div>

            <div className="mb-4">
              <label
                // style={{
                //   // fontWeight: "550",
                //   fontFamily: "'Plus Jakarta Sans', sans-serif",
                // }}
                className="block text-left text-[13px] mb-1 font-medium"
              >
                Full name
                {errors.firstName && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              <input
                // className={`w-full rounded-[2px] px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1f1e4d] ${
                //   errors.firstName ? "border-red-500" : ""
                // }`}
                className={`w-full text-[16px] bg-[#ffffff] border ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                } rounded-lg px-[10px] py-[7px] focus:outline-none focus:ring-2 ${
                  errors.firstName
                    ? "focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label
                // style={{
                //   fontWeight: "550",
                //   fontFamily: "'Plus Jakarta Sans', sans-serif",
                // }}
                className="block text-left text-[13px] mb-1 font-medium"
              >
                Address
                {errors.address && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                className={`w-full text-[16px] bg-[#ffffff] border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } rounded-lg px-[10px] py-[7px] focus:outline-none focus:ring-2 ${
                  errors.address ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                id="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                // style={{
                //   fontWeight: "550",
                //   fontFamily: "'Plus Jakarta Sans', sans-serif",
                // }}
                className="block text-left text-[13px] mb-1 font-medium"
              >
                City
                {errors.city && <span className="text-red-500 ml-1">*</span>}
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={`w-full text-[16px] bg-[#ffffff] border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } rounded-lg px-[10px] py-[7px] focus:outline-none focus:ring-2 ${
                    errors.city ? "focus:ring-red-500" : "focus:ring-blue-500"
                  }`}
                  placeholder="Type or select a city"
                  value={searchTerm} // Reflect typed value in the input field
                  onChange={(e) => {
                    setSearchTerm(e.target.value); // Update search term without affecting formData
                    setIsAccordionOpen(true); // Open dropdown while typing
                  }}
                  onFocus={() => setIsAccordionOpen(true)} // Open dropdown on focus
                  onBlur={() => {
                    // Delay closing the dropdown slightly to allow onClick to fire
                    setTimeout(() => setIsAccordionOpen(false), 200);
                  }}
                />
                {isAccordionOpen && (
                  <div
                    style={{
                      maxHeight: "135px",
                      overflowY: "scroll",
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                    className="dropdown-container"
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur when interacting with dropdown
                  >
                    {filteredCities.length > 0 ? (
                      <ul className="text-left">
                        {filteredCities.map((city) => (
                          <li
                            key={city.id}
                            onClick={() => {
                              handleCityChange(city); // Update city
                              setIsAccordionOpen(false); // Close dropdown after selection
                            }}
                            className="cursor-pointer hover:bg-gray-200 p-2"
                          >
                            {city.city_name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 p-2">No cities found</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className=" small:mb-6 sssm:mb-4 ">
              <label
                className="block text-left text-[13px] mb-1 font-medium"
                // style={{
                //   fontWeight: "550",
                //   fontFamily: "'Plus Jakarta Sans', sans-serif",
                // }}
              >
                Contact
                {errors.contact && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                className={`w-full text-[16px] bg-[#ffffff] border ${
                  errors.contact ? "border-red-500" : "border-gray-300"
                } rounded-lg px-[10px] py-[7px] focus:outline-none focus:ring-2 ${
                  errors.contact ? "focus:ring-red-500" : "focus:ring-blue-500"
                }`}
                id="contact"
                type="text"
                placeholder="Enter your contact number"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
        <Checkoutbutton
          buttonLbel={"Save Details"}
          onClick={handleButtonClick}
        />
      </div>
      <style jsx>{`
        .rs-panel-btn {
          padding: 0% !important;
          outline: none !important;
          background-color: none;
          padding-left: 3px !important;
          padding-right: 3px !important;
          padding-top: 1px !important;
          padding-bottom: 1px !important;
        }
        .rs-panel-btn:focus {
          outline: none;
          box-shadow: none;
        }
        .rs-panel-collapsible > .rs-panel-header {
          /* background-color: white; */
          padding: 9px;
        }
        .rs-panel .rs-anim-collapse {
          /* background-color: white; */
        }

        .rs-panel {
          background-color: white;
        }
      `}</style>
    </div>
  );
};

export default Details;
