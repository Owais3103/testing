import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Receipt from "./Components/CartComponents/Receipt";
import { fetchStoreData } from "./Apis/Handlers";
import "./App.css";
import ErrorPage from "./Components/ErrorPage";
import TappppLogo1 from "../src/assets/TappppLogo1.gif";

const App = () => {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeLink = window.location.origin;
        console.log(storeLink);
        let data = await fetchStoreData(storeLink);
        setStoreData(data);
        console.log(data);
        if (data.storeId) localStorage.setItem("storeId", data.storeId);
        if (data.storeName) localStorage.setItem("storeName", data.storeName);
        if (data.storeImg) localStorage.setItem("storeImg", data.storeImg);
        if (data.businessType) localStorage.setItem("businessType", data.businessType);
      } catch (err) {
        try {
          console.warn("Retrying fetch...");
          const storeLink = window.location.origin;
          const data = await fetchStoreData(storeLink);
          setStoreData(data);

          if (data.storeId) localStorage.setItem("storeId", data.storeId);
          if (data.storeName) localStorage.setItem("storeName", data.storeName);
          if (data.storeImg) localStorage.setItem("storeImg", data.storeImg);
          if (data.businessType) localStorage.setItem("businessType", data.businessType);

        } catch (retryErr) {
          setError("Failed to fetch store data after retry.");
          console.error("Retry failed:", retryErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[white]">
        <img
          src={TappppLogo1}
          alt="Loading..."
          className="w-[350px] h-[450px]"
        />
      </div>
    );
  }

  // Render ErrorPage if there's an error
  if (error) {
    return <ErrorPage message={error} />;
  }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home storeData={storeData} />} />
          <Route path="/receipt" element={<Receipt />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

// import React from "react";

// const OrderButton = () => {
// const handleApiCall = async () => {
//   const apiUrl = "https://apis.orio.digital/api/order";
//   const apiKey = "c2fc07fd61baec6c87da954351d2e610";

//   const payload = [
//     {
//       acno: "OR-03400",
//       shipper_name: "rehman",
//       shipper_address: "Patel Hospital",
//       shipper_email: "abc@gmail.com",
//       shipper_contact: "03322448731",
//       billingperson_name: "-",
//       billingperson_email: "-",
//       billingperson_contact: "-",
//       billingperson_address: "-",
//       consignee_name: "rehman",
//       consignee_address: "11/16 model colony karachi",
//       consignee_email: "-",
//       consignee_contact: "03322448731",
//       cnic_number: "4242-4242424-2",
//       other_charges: "0",
//       origin_country_id: 1,
//       origin_country: "pk",
//       origin_province: 1,
//       origin_province_id: 1,
//       origin_city_id: 655,
//       destination_country_id: 1,
//       destination_province_id: 1,
//       destination_city_id: 655,
//       discount_amount: 200,
//       gst_charges: "0",
//       piece: 1,
//       weight: 2.5,
//       order_amount: 5000,
//       order_ref: "10000058",
//       detail: [
//         {
//           id: 5024070374,
//           product_code: "1000045",
//           product_name: "Shoes",
//           quantity: 3,
//           total_quantity: 28,
//           amount: 5000,
//           image_url: "https://th.bing.com/th/id/OIP.1RfKeDjiffAd7MnXDykgcQHaFs?rs=1&pid=ImgDetMain",
//           refcode: "0",
//           variation: "XL",
//           sku_code: "blue",
//           product_id: 583510,
//           variation_id: 0,
//         },
//         {
//           id: 5024070374,
//           product_code: "1000045",
//           product_name: "Shoes",
//           quantity: 3,
//           total_quantity: 28,
//           amount: 5000,
//           image_url: "https://th.bing.com/th/id/OIP.1RfKeDjiffAd7MnXDykgcQHaFs?rs=1&pid=ImgDetMain",
//           refcode: "0",
//           variation: "small",
//           sku_code: "red",
//           product_id: 583510,
//           variation_id: 0,
//         },
//       ],
//       comment_detail: "none",
//       platform_id: 7,
//       store_name: "Tapppp",
//       payment_method_id: 3,
//       remarks: "Please do early pickup",
//       status: "Y",
//       shipping_charges: 500,
//       consignee_latitude: "0",
//       consignee_longitude: "0",
//       order_date: "2024-12-31",
//       request_from: "oms",
//     },
//   ];

//   try {
//     const response = await fetch(apiUrl, {
//       method: "POST",
//       headers: {
//         Authorization: `API-Key ${apiKey}`,
//       },
//       mode: "no-cors", // Note: Response body won't be accessible
//       body: JSON.stringify(payload),
//     });

//     console.log("Raw Response:", response);

//     if (!response.ok) {
//       console.error(`HTTP Error: ${response.status}`);
//       alert(`Error: ${response.statusText}`);
//       return;
//     }

//     const result = await response.json();
//     console.log("API Response:", result);
//   } catch (error) {
//     console.error("Error calling API:", error);
//     alert("An error occurred while calling the API.");
//   }
// };

//   return (
//     <div>
//       <button onClick={handleApiCall}>Call API</button>
//     </div>
//   );
// };

// export default OrderButton;
