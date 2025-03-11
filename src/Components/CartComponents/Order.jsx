import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaShoppingBag, FaTimes } from "react-icons/fa";
import Checkoutbutton from "./Checkoutbutton";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClipLoader from "react-spinners/ClipLoader";

const Order = ({ toggleCheckout, handleBack, handleBackClick, cartData }) => {
  const [shippingMethods, setShippingMethods] = useState([]);
  const [shippingMethod, setShippingMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [discount, setDiscount] = useState("0");
  const [loading, setLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default to COD

  const [fetchedPrice, setFetchedPrice] = useState(null); // New state for fetched price
  const storeId = localStorage.getItem("storeId");
  console.log(cartData);
  const selectedArea = localStorage.getItem("selectedArea");

  console.log(selectedArea);

  // useEffect(() => {
  //   const businessType = localStorage.getItem("businessType");

  //   if (!businessType) {
  //     console.error("Business type is missing in localStorage.");
  //     return;
  //   }

  //   if (businessType === "retail") {
  //     const selectedArea = localStorage.getItem("selectedArea");

  //     if (selectedArea) {
  //       const { ariaId, storeId } = JSON.parse(selectedArea);

  //       if (ariaId && storeId) {
  //         fetch(
  //           `https://api.tapppp.com/api/Stores/fetch_retail_price?store_id=${storeId}&aria_id=${ariaId}`,
  //           {
  //             method: "POST",
  //             headers: { Accept: "*/*" },
  //           }
  //         )
  //           .then((response) => response.json())
  //           .then((data) => {
  //             if (data) {
  //               setFetchedPrice(data.price); // Ensure it's storing only the price
  //               console.log("Retail Price:", data.price);
  //             } else {
  //               console.error("Invalid data format:", error);
  //             }
  //           })
  //           .catch((error) =>
  //             console.error("Error fetching retail price:", error)
  //           );
  //       }
  //     }
  //   } else if (businessType === "ecommerce") {
  //     const city = cartData?.customerDetails?.city;
  //     const method = paymentMethod;
  //     const kg = cartData?.totalWeightRange;
  //     const storeId = localStorage.getItem("storeId"); // Ensure storeId is fetched

  //     if (!storeId || !city || !method || !kg) {
  //       console.error("Missing parameters for fetch_price API.");
  //       return;
  //     }

  //     fetch(
  //       `https://api.tapppp.com/api/Stores/fetch_price?store_id=${storeId}&city=${city}&method=${method}&kg=${kg}`,
  //       {
  //         method: "POST",
  //         headers: { Accept: "*/*" },
  //       }
  //     )
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setFetchedPrice(data.price);
  //         console.log("Ecommerce Price Data:", data.price);
  //       })
  //       .catch((error) =>
  //         console.error("Error fetching ecommerce price:", error)
  //       );
  //   }
  // }, [cartData, paymentMethod]); // Dependencies to trigger updates when cartData or payment method changes

  useEffect(() => {
    const businessType = localStorage.getItem("businessType");
    if (businessType !== "ecommerce") return;

    const storeId = localStorage.getItem("storeId");
    const city = cartData?.customerDetails?.city;
    const method = paymentMethod;
    const kg = cartData?.totalWeightRange;

    if (!storeId || !city || !method || !kg) {
      return console.error("Missing parameters for fetch_price API.");
    }

    fetch(
      `https://api.tapppp.com/api/Stores/fetch_price?store_id=${storeId}&city=${city}&method=${method}&kg=${kg}`,
      {
        method: "POST",
        headers: { Accept: "*/*" },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.price) {
          setFetchedPrice(data.price);
          console.log("Ecommerce Price Data:", data.price);
        } else {
          console.error("Invalid data format:", data);
        }
      })
      .catch((error) =>
        console.error("Error fetching ecommerce price:", error)
      );
  }, [cartData, paymentMethod]);

  useEffect(() => {
    const businessType = localStorage.getItem("businessType");
    if (!businessType)
      return console.error("Business type is missing in localStorage.");

    if (businessType === "retail") {
      const selectedArea = localStorage.getItem("selectedArea");
      const storeId = localStorage.getItem("storeId");

      if (!selectedArea || !storeId)
        return console.error("Missing retail parameters.");

      let ariaId;
      try {
        const parsedArea = JSON.parse(selectedArea);
        ariaId = parsedArea?.ariaId;
        console.log(ariaId);
      } catch (error) {
        return console.error("Invalid selectedArea format:", error);
      }

      if (!ariaId) return console.error("Invalid area ID.");

      fetch(
        `https://api.tapppp.com/api/Stores/fetch_retail_price?store_id=${storeId}&aria_id=${ariaId}`,
        {
          method: "POST",
          headers: { Accept: "*/*", "Content-Type": "application/json" },
          body: JSON.stringify({}), // Ensures body is sent if required
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("API Response:", data);
          if (data?.price) {
            setFetchedPrice(data.price);
            console.log("Retail Price:", data.price);
          } else {
            console.error("Invalid data format:", data);
          }
        })
        .catch((error) => console.error("Error fetching retail price:", error));
    }
  }, []);

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const methods = [
    { paymentMethodName: "COD" },
    { paymentMethodName: "Online" },
  ];
  // Correctly calculate total payment and items
  const totalPayment = cartData.items.reduce(
    (total, item) => total + item.total,
    0
  );
  const totalItems = cartData.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalWithShipping = totalPayment + fetchedPrice;

  const handleClick = async () => {
    setIsButtonDisabled(true); // Disable button

    const combinedData = {
      cartItems: cartData.items,
      totalWeight: cartData.totalWeightRange,
      customerDetails: cartData.customerDetails,
      shippingCost: fetchedPrice, // Shipping cost fetched dynamically
      item_price: totalPayment,
      totalPayment: totalWithShipping,
      discount,
      storeId,
      paymentMethodDetails: paymentMethod, // Pass the selected payment method
    };

    console.log("Combined data for checkout:", combinedData);
    try {
      const response = await fetch(
        // "https://tapppp.il-solution.com/api/Stores/checkout",
        // "https://api.tapppp.com/api/Stores/checkout",
        "https://api.tapppp.com/api/Stores/checkout",

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          body: JSON.stringify(combinedData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      console.log(result);
      toast.success("Order placed successfully!", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => setIsButtonDisabled(false), // Re-enable button after toast
      });

      setTimeout(() => {
        navigate("/receipt", {
          state: {
            ...combinedData,
            cartItems: cartData.items,
            receipt: result.receipt,
          },
        });
      }, 3000);
    } catch (error) {
      toast.error("Failed to complete checkout. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        onClose: () => setIsButtonDisabled(false), // Re-enable button after toast
      });
    }
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <ClipLoader color="#4A90E2" loading={loading} size={40} />
  //     </div>
  //   );
  // }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-full border-gray-300 rounded-lg">
        {/* Header Section */}
        <div className="flex justify-end pr-7 pt-3 pb-3">
          <button
            onClick={toggleCheckout}
            className="text-black bg-white rounded-full p-1"
          >
            <FaTimes size={18} />
          </button>
        </div>
        <div className="flex pl-4 pr-4 items-center justify-between mb-4">
          <div
            onClick={handleBack}
            className="relative rounded-full border border-gray-300 p-2 inline-block cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <FaArrowLeft className="text-[17px] text-gray-600" />
          </div>
          <h2 className="text-lg font-semibold text-center">Order</h2>
          <div
            onClick={handleBackClick}
            className="relative rounded-full border border-gray-300 p-2 cursor-pointer"
          >
            <FaShoppingBag className="text-[17px] text-[#20144c]" />
            <span className="absolute top-0 right-0 translate-x-2 -translate-y-2 bg-green-300 text-black text-xs font-semibold rounded-full px-1.5 py-0.5">
              {totalItems}
            </span>
          </div>
        </div>
        {/* Content Section */}
        <div
          className="pl-4 pr-4 ssm:max-h-[360px] small:max-h-[372px] lg:max-h-[456px]"
          style={{
            overflowY: "scroll",
            scrollbarWidth: "none",
            "-ms-overflow-style": "none",
          }}
        >
          {/* Address Section */}
          <div>
            <div className="flex justify-between items-center h-8">
              <h2 className="text-[17px] font-semibold">Details</h2>
              <h2
                onClick={handleBack}
                className="text-[17px] font-semibold text-blue-500 cursor-pointer"
              >
                Edit
              </h2>
            </div>
            <div className="border border-gray-300 rounded-lg shadow-sm">
              <div className="text-left mb-1 p-3">
                <p>
                  <span className="text-[15px] text-gray-400  ">
                    {cartData.customerDetails.firstName}
                  </span>
                  <br />
                  <span className="text-gray-400">
                    {cartData.customerDetails.address}
                  </span>
                  <br />
                  <span className="text-gray-400">
                    {cartData.customerDetails.city}
                  </span>
                  <br />
                  <span className="text-gray-400">
                    {cartData.customerDetails.contact}
                  </span>
                </p>
              </div>
            </div>
            <div className="text-left">
              <h2 className="text-[17px] mt-6 mb-2 font-semibold  leading-[1.5rem] ">
                Cart Details
              </h2>
              <div className="pt-4 pl-4 border border-gray-300 rounded-lg shadow-sm">
                {cartData.items.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex justify-between mb-4 "
                  >
                    <div className="flex w-[60%] items-center ">
                      <div className="rounded-md border border-gray-300 w-[4.7rem] h-[3.8rem] flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full object-top h-full object-cover rounded-md"
                        />
                      </div>
                      {/* Product Details */}
                      <div className=" px-2 ">
                        <h3 className="text-gray-800  overflow-hidden  capitalize  leading-[1.2rem] text-[13px] font-bold">
                          {item.name}
                        </h3>
                        <p className="text-gray-800 text-[12px] font-medium">
                          PKR {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center pr-4 text-right  w-[40%]">
                      <h3 className="text-gray-500 leading-[1.2rem] text-[12px]">
                        {item.selectedVariants
                          ? Object.values(item.selectedVariants).join(" - ")
                          : ""}
                      </h3>
                      <p className="text-gray-500 text-[13px] ">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* <hr className="border-t border-gray-300 mt-7 mb-5" /> */}

            {/* Shipping Section */}
            {/* Shipping Section */}
            {/* <div className="text-left mb-4 mt-8">
              <h2 className="text-[17px] font-semibold leading-[1.6rem] mb-2">
                Available Shipping Method
              </h2>
              <div className="">
                {shippingMethods.map((method) => (
                  <div
                    key={method.shippingMethodId}
                    className={`flex justify-between items-center p-2 mb-2 rounded-lg cursor-pointer ${
                      shippingMethod === method.methodName
                        ? "border-2 border-gray-600 bg-gray-50"
                        : "border border-gray-300"
                    }`}
                    onClick={() =>
                      handleShippingChange(method.methodName, method.price)
                    }
                  >
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-700 text-[14px]">
                        {method.methodName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold text-gray-700 text-[14px]">
                        {method.price === 0
                          ? "Free"
                          : `PKR ${method.price.toFixed(2)}`}
                      </p>
                      <input
                        type="radio"
                        name="shipping"
                        value={method.methodName}
                        checked={shippingMethod === method.methodName}
                        onChange={() =>
                          handleShippingChange(method.methodName, method.price)
                        }
                        className="form-radio text-blue-500"
                        style={{ accentColor: "blue" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* <hr className="border-t border-gray-300 mt-7 mb-4" /> */}
            {/* <div className="text-left mb-4 mt-8">
              <h2 className="text-[17px] font-semibold leading-[1.6rem] mb-2">
                Payment Method
              </h2>
              <div className="">
                {paymentMethods.map((method) => (
                  <div
                    key={method.paymentid}
                    className={`flex justify-between items-center p-2 mb-2 rounded-lg cursor-pointer ${
                      paymentMethod === method.paymentMethodName
                      ? "border-2 border-gray-600 bg-gray-50"
                      : "border border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod(method.paymentMethodName)}
                  >
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-700 text-[14px]">
                        {method.paymentMethodName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="hidden">
                        {method.paymentMethodName === "COD" ? "Unpaid" : "Paid"}
                      </p>
                      <input
                        type="radio"
                        name="payment"
                        value={method.paymentMethodName}
                        checked={paymentMethod === method.paymentMethodName}
                        onChange={() =>
                          setPaymentMethod(method.paymentMethodName)
                        }
                        className="form-radio text-blue-500"
                        style={{ accentColor: "blue" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div> */}

            {/* <hr className="border-t border-gray-300 mt-7 mb-4" /> */}
            {/* Cart Items Section */}

            {/* <hr className="border-t border-gray-300 my-3" /> */}
            {/* Summary Section */}
            <div className="text-left mb-4 mt-8">
              <h2 className="text-[17px] font-semibold leading-[1.6rem] mb-2">
                Payment Method
              </h2>
              <div>
                {methods.map((method) => (
                  <div
                    key={method.paymentMethodName}
                    className={`flex justify-between items-center p-2 mb-2 rounded-lg cursor-pointer ${
                      paymentMethod === method.paymentMethodName
                        ? "border-2 border-gray-600 bg-gray-50"
                        : "border border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod(method.paymentMethodName)}
                  >
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-700 text-[14px]">
                        {method.paymentMethodName}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* {method.paymentMethodName !== "Online" && (
                        <p className="text-[14px] font-semibold text-gray-700">
                          PKR {fetchedPrice || "Fetching..."}
                        </p>
                      )} */}
                      <input
                        type="radio"
                        name="payment"
                        value={method.paymentMethodName}
                        checked={paymentMethod === method.paymentMethodName}
                        onChange={() =>
                          setPaymentMethod(method.paymentMethodName)
                        }
                        className="form-radio text-blue-500"
                        style={{ accentColor: "blue" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Items Price</span>
                <span>{totalPayment}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Sales Tax</span>
                <span>-</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Discount</span>
                <span>{discount}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Shipping</span>
                PKR {fetchedPrice}
              </div>
              <div className="flex justify-between font-semibold mb-2">
                <span>Total Payment</span>
                <span>{totalWithShipping.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Checkout Button */}
        <Checkoutbutton
          buttonLbel={
            paymentMethod === "COD" ? (
              <span className="font-bold">Confirm Order</span>
            ) : (
              <>
                <span className="text-[#D7FC51] font-bold">PAY </span>
                <span className="font-extrabold">
                  PKR {totalWithShipping.toFixed(2)}
                </span>
              </>
            )
          }
          onClick={handleClick}
          disabled={isButtonDisabled || fetchedPrice === null} // Ensure button is disabled if shipping price is still loading
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Order;
