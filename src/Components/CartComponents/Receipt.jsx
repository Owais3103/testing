import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf"; // Import jsPDF
import html2canvas from "html2canvas"; // Import html2canvas
import { useNavigate } from "react-router-dom";
const Receipt = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate

  const { receipt, cartItems } = location.state;

  const receiptRef = useRef(); // Create a reference for the receipt div

  // console.log(combinedData);
  const orderDateTime = new Date(receipt.order_datetime);
  const formattedDate = orderDateTime.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = orderDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  // Function to handle downloading the receipt as a PDF
  const handleDownload = () => {
    const receiptElement = receiptRef.current;

    html2canvas(receiptElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth - 20; // Leave some padding on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // If the image height is larger than the page height, adjust the page size dynamically
      if (imgHeight > pageHeight) {
        // Set custom page dimensions to fit the entire receipt on a single page
        pdf.internal.pageSize.height = imgHeight + 20; // Adjust with padding
      }

      // Add the image to the PDF
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

      pdf.save("receipt.pdf"); // Save the PDF

      navigate("/");
    });
  };

  return (
    <div
      className="flex justify-center bg-[#F4F5F8] pt-5 pb-5 small:pl-5 ssssm:pl-0 small:pr-5 ssssm:pr-0"
      id="cards-container"
    >
      <div className="relative w-full max-w-screen-sm  bg-white">
        <div
          ref={receiptRef}
          className="relative w-full max-w-screen-sm  bg-white"
        >
          <div className="flex justify-between pl-5 pr-5 items-center">
            <h1 className="text-left text-[15px] font-bold text-[#1B5EC9]">
              Order ID: {receipt.orderId}
            </h1>
            <div className="text-right text-gray-500 text-[12px]">
              {formattedDate} <br />
              <span>{formattedTime}</span>
            </div>
          </div>

          <div
            className="overflow-y-scroll pl-5 pt-5 pr-5"
            style={{
              scrollbarWidth: "none",
              "-ms-overflow-style": "none",
            }}
          >
            <style>
              {`
                ::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            {/* 
            <div className="text-left mb-1">
              <p>
                <span className="text-[15px] font-semibold">
                  {receipt.firstName}
                </span>
                <br />
                <span className="text-gray-400">{receipt.address}</span>
                <br />
                <span className="text-gray-400">{receipt.city}</span>
                <br />
                <span className="text-gray-400">{receipt.contact}</span>
              </p>
            </div> */}

            <div className="border border-gray-300 rounded-lg shadow-sm">
              <div className="text-left mb-1 p-3">
                <p>
                  <span className="text-[15px] text-gray-400 ">
                    {receipt.firstName}
                  </span>
                  <br />
                  <span className="text-gray-400">{receipt.address}</span>
                  <br />
                  <span className="text-gray-400">{receipt.city}</span>
                  <br />
                  <span className="text-gray-400">{receipt.contact}</span>
                </p>
              </div>
            </div>
            {/* <hr className="border-t border-gray-300 mt-7 mb-2 " /> */}
            <h2 className="mt-4 mb-1 text-lg font-semibold">Cart Items</h2>

            {/* <div className="border border-gray-300 rounded-lg shadow-sm p-4 pb-2 pt-2  ">
              {cartItems.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex justify-between items-center "
                >
                  <div className="flex items-center">
                    <div className="">
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      <p className="text-sm font-semibold">
                        PKR {item.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {item.selectedVariants
                        ? Object.values(item.selectedVariants).join(", ")
                        : "No variants"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div> */}

            <div className="text-left">
              {/* <h2 className="text-[17px] font-semibold ">Cart Details</h2> */}
              <div className="pt-4 pl-4 pr-4 border border-gray-300 rounded-lg shadow-sm">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="flex justify-between mb-4 "
                  >
                    <div className="flex w-[60%] items-center ">
                      {/* Product Details */}
                      <div className=" ">
                        <h3 className="text-gray-800  leading-[1.2rem] text-[13px] font-bold">
                          {item.name}
                        </h3>
                        <p className="text-gray-800 text-[12px] font-medium">
                          PKR {item.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center   text-right  w-[45%]  ">
                      <h3 className="text-sm text-gray-600 ">
                        {item.selectedVariants
                          ? Object.values(item.selectedVariants).join(", ")
                          : "No variants"}
                      </h3>
                      <p className="text-sm text-gray-600 ">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-left mb-4 mt-8">
              <h2 className="text-[17px] font-semibold leading-[1.6rem] mb-2">
                Payment Method
              </h2>
              <div className="">
                <div className="flex justify-between items-center p-2 mb-2 rounded-lg cursor-pointer border border-gray-300 bg-gray-50">
                  <div className="flex items-center">
                    <h3 className="font-medium text-gray-700 text-[14px]">
                      {receipt.paymentMethodName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* <span className="ml-auto bg-green-200 text-green-700 px-2 py-[2px] rounded-lg text-[10px] font-semibold flex items-center justify-center h-6">
                      {receipt.paymentMethodName === "COD" ? "UNPAID" : "PAID"}
                    </span> */}
                    <div className="flex items-center justify-center w-4 h-4 rounded-full border border-gray-400">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <hr className="border-t border-gray-300 mt-7 " /> */}

            <div>
              <h1
                style={{
                  fontWeight: "650",
                  fontFamily: "Poppins, sans-serif",
                }}
                className="text-left h-12 font-extrabold "
              >
                Payment Summary
              </h1>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Items</span>
                <span>{receipt.item_price}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Sales Tax</span>
                <span>-</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Discount</span>
                <span>{receipt.discount}</span>
              </div>
              <div className="flex justify-between text-gray-600 mb-1">
                <span>Shipping</span>
                <span>{receipt.ship_Price}</span>
              </div>
              <div className="flex justify-between font-semibold mb-2">
                <span>Total Payment</span>
                <span>{receipt.total_price}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center p-1 pb-5">
          <button
            className=" bg-black mt-2 text-white py-3 px-7 rounded-[5px]"
            onClick={handleDownload}
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
