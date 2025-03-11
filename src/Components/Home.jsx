import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Slider from "./Slider";
import LocationModal from "./LocationModal"; // Import the modal

const Home = () => {
  const [isModalVisiblee, setIsModalVisiblee] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    console.log("Is modal visible?", isModalVisible); // Debugging log
  }, [isModalVisible]);

  const [selectedArea, setSelectedArea] = useState(() => {
    const storedArea = localStorage.getItem("selectedArea");

    return storedArea
      ? JSON.parse(storedArea)
      : { ariaId: "", areaName: "Gulshan-e-Iqbal Block 4" };
  });

  useEffect(() => {
    const storedBusinessType = localStorage.getItem("businessType");
    const hasSelectedArea = localStorage.getItem("selectedArea");
    // console.log(hasSelectedArea);
    if (storedBusinessType === "retail" && !hasSelectedArea) {
      setIsModalVisiblee(true);
    }
  }, []);

  const handleAreaSelection = (area) => {
    setSelectedArea(area);
    localStorage.setItem("selectedArea", JSON.stringify(area)); // Store both ID and name as an object
    setIsModalVisiblee(false);
  };

  return (
    <div className="relative text-center  min-h-screen">
      {isModalVisiblee && (
        <LocationModal
          setSelectedArea={handleAreaSelection}
          setIsModalVisiblee={setIsModalVisiblee}
        />
      )}

      <div className="relative">
        {isModalVisiblee && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-10"></div>
        )}

        <div className="relative z-0">
          <Navbar
            selectedArea={selectedArea}
            setSelectedArea={handleAreaSelection}
            onModalVisibleChange={setIsModalVisible} // Receive modal visibility changes
          />
          {/* <Slider selectedArea={selectedArea} />
          <Footer isModalVisible={isModalVisible} /> */}
          <Slider
            selectedArea={selectedArea}
            onModalVisibleChange={setIsModalVisible} // Receive modal visibility changes
          />
          <Footer isModalVisible={isModalVisible} />
        </div>
      </div>
    </div>
  );
};

export default Home;

// import React, { useState, useEffect } from "react";
// import Navbar from "./Navbar";
// import Slider from "./Slider";
// import { mockData } from "../data.js";
// import Footer from "./Footer.jsx";

// const Home = () => {
//   const logo = mockData[0].logoImage;
//   const [isModalVisible, setIsModalVisible] = useState(false);

// useEffect(() => {
//   console.log("Is modal visible?", isModalVisible); // Debugging log
// }, [isModalVisible]);

//   return (
//     <div  className="relative text-center bg-[#F4F5F8]">
//       <Navbar logo={logo} />
// <Slider
//   onModalVisibleChange={setIsModalVisible} // Receive modal visibility changes
// />
// <Footer isModalVisible={isModalVisible} />
//     </div>
//   );
// };

// export default Home;
