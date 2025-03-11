import React, { useEffect, useRef, useState } from "react";

import { MdClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdMenu, MdTrackChanges, MdLogin } from "react-icons/md";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { MdLocationOn } from "react-icons/md";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import CAMETRUEWITHELVO1 from "../assets/Storeimages/CAMETRUEWITHELVO5.png";

import CAMETRUEWITHELVO from "../assets/Storeimages/CAMETRUEWITHELVO14.png";
const Navbar = ({ onLogout, selectedArea, setSelectedArea }) => {
  const storeName = localStorage.getItem("storeName");
  const storeImg = localStorage.getItem("storeImg");
  const [areas, setAreas] = useState([]);
  console.log(selectedArea);

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
          headers: {
            Accept: "*/*",
          },
        }
      );
      const data = await response.json();
      console.log("Fetched Areas:", data); // Debugging line
      if (data.arias_list) {
        setAreas(data.arias_list);
      }
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  const handleAction = (action) => {
    if (action === "openYouTube") {
      window.open("https://admin.tapppp.com/", "_blank");
    }
  };

  // Close dropdown when clicking outside
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // const handleSelect = (area) => {
  //   setSelectedArea(area);
  //   localStorage.setItem("selectedArea", area); // Save in local storage
  //   setIsOpen(false);
  // };

  const businessType = localStorage.getItem("businessType");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white ssm:text-3xl small:text-[18px]  cursor-pointer bg-black/50 p-2 rounded-full"
        onClick={onClick}
      >
        <MdKeyboardArrowRight />
      </div>
    );
  };
  // const [isOpen, setIsOpen] = useState(false);

  // const handleSelect = (area) => {
  //   // setSelectedArea(area);
  //   setIsOpen(false); // Option select hone ke baad dropdown band ho jaye
  // };
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <div
        className="absolute top-1/2 left-2 transform ssm:text-3xl small:text-[18px] -translate-y-1/2 text-white text-3xl cursor-pointer bg-black/50 p-2 rounded-full z-30"
        onClick={onClick}
      >
        <MdKeyboardArrowLeft />
      </div>
    );
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const images = [
    CAMETRUEWITHELVO1,
    CAMETRUEWITHELVO,

  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots custom-dots", // Custom class for styling dots
  };

  const MenuButton = ({ label, action, Icon }) => (
    <button
      onClick={() => handleAction(action)}
      className="flex items-center text-sm px-4 py-3 w-full text-white hover:bg-gray-800 text-left font-medium"
    >
      <Icon className="mr-3 text-xl" />
      {label}
    </button>
  );

  const handleSelect = (area) => {
    setSelectedArea(area); // Update state
    localStorage.setItem("selectedArea", JSON.stringify(area)); // Store both ID and name
    setIsOpen(false); // Close dropdown
  };

  return (
    <>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-[#090916] text-white z-50 shadow-lg">
        <div className="flex items-center justify-between px-4 small:py-1 ssm:py-3">
          <div className="flex items-center space-x-3 w-full">
            <div className="h-10 w-10 rounded-full overflow-hidden border-[1.5px] border-white">
              <img
                src={storeImg}
                alt="Store Logo"
                className="h-full w-full object-contain"
              />
            </div>
            <h1 className="ssm:text-lg small:text-[12px] font-bold uppercase">
              {storeName}
            </h1>
          </div>

          {/* {businessType === "retail" && (
            <div className="hidden md:flex items-center justify-center w-full">
              <span className="font-medium text-[12px] text-[#CCFF00]">
                Free Deliveries On Orders Over PKR 5000
              </span>
            </div>
          )} */}

          <div className="flex items-center gap-2 ">
            {businessType === "retail" && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="bg-transparent border border-gray-500 text-white rounded-md px-4 py-2 flex items-center justify-between min-w-max focus:outline-none transition-all duration-200"
                >
                  {selectedArea ? selectedArea.areaName : "Select Area"}
                  <div className="ml-2">
                    {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                  </div>
                </button>

                {isOpen && (
                  <div className="absolute right-0 mt-1 bg-white text-black rounded-md shadow-lg w-full max-h-40 overflow-y-auto">
                    {areas.length > 0 ? (
                      areas.map((item, index) => (
                        <div
                          key={index}
                          onClick={() => handleSelect(item)} // Pass the whole area object
                          className="px-4 py-2 hover:bg-gray-200 rounded-md cursor-pointer transition-all"
                        >
                          {item.areaName}
                        </div>
                      ))
                    ) : (
                      <div className="py-2 px-2 text-gray-500">
                        Loading areas...
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="text-2xl focus:outline-none"
            >
              {isDrawerOpen ? <MdClose /> : <MdMenu />}
            </button>
          </div>
        </div>
      </nav>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity duration-300 z-40"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[18rem] bg-black shadow-2xl transform transition-transform duration-300 z-50 ${isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4  border-b border-gray-700">
          {/* <div className=" flex items-center justify-center">
          <h1 className="text-[18px] text-white">Menu</h1>

          </div> */}
          <h1 className="text-[14px] font-bold tracking-[.15em] leading-[1rem] text-white">
            MENU
          </h1>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="text-white text-[20px] focus:outline-none hover:text-gray-400"
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col mt-4">
          <MenuButton
            label="Track Order"
            action="trackOrder"
            Icon={MdTrackChanges}
          />
          <MenuButton
            label="Admin Portal"
            action="openYouTube"
            Icon={MdLogin}
          />
        </div>
        <div className="absolute text-left bottom-[4rem] left-4 flex flex-col space-y-2 text-white text-sm">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#CCFF00] transition-colors duration-200 flex items-center space-x-2"
          >
            <span className=" no-underline decoration-transparent hover:decoration-[#CCFF00] transition-all duration-200">
              Facebook
            </span>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#CCFF00] transition-colors duration-200 flex items-center space-x-2"
          >
            <span className=" decoration-transparent hover:decoration-[#CCFF00] transition-all duration-200">
              Twitter
            </span>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#CCFF00] transition-colors duration-200 flex items-center space-x-2"
          >
            <span className=" decoration-transparent  transition-all duration-200">
              Instagram
            </span>
          </a>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="pt-[63px] relative">
        <Slider {...sliderSettings}>
          {images.map((image, index) => (
            <div key={index} className="ssm:h-[400px] small:h-[190px] w-full">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-center object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Navbar;
