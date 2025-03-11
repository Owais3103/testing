import React, { useState, useRef, useEffect } from "react";
import Cards from "./Cards.jsx";
import Search from "./Search.jsx";
import { fetchCategories, fetchProducts } from "../Apis/Handlers.jsx";

const Slider = ({ onModalVisibleChange }) => {
  const [categories, setCategories] = useState([]); // Fetched categories
  const [selectedItem, setSelectedItem] = useState(null); // Initially null until categories load
  const sliderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [isUserScroll, setIsUserScroll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeId = localStorage.getItem("storeId");
        const fetchedCategories = await fetchCategories(storeId);
        const fetchedProducts = await fetchProducts(storeId);

        const filteredCategories = fetchedCategories.filter(
          (category) => fetchedProducts[category.categoryId]?.length > 0
        );

        setCategories(filteredCategories);

        if (filteredCategories.length > 0) {
          setSelectedItem(filteredCategories[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleScroll = () => {
    if (window.scrollY > sliderRef.current.offsetTop) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleItemClick = (item, isUserTriggered = true) => {
    setSelectedItem(item);

    if (isUserTriggered) {
      setIsUserScroll(true);
      const sectionElement = document.getElementById(
        `category-${item.categoryId}`
      );
      if (sectionElement) {
        const headerOffset = 120; // Adjust based on your header height
        const elementPosition =
          sectionElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        setTimeout(() => setIsUserScroll(false), 500); // Reset after scroll
      }
    }
  };

  useEffect(() => {
    if (selectedItem) {
      const buttonElement = document.querySelector(
        `#slider-button-${selectedItem.categoryId}`
      );
      const sliderElement = sliderRef.current;

      if (buttonElement && sliderElement) {
        const buttonRect = buttonElement.getBoundingClientRect();
        const sliderRect = sliderElement.getBoundingClientRect();

        if (buttonRect.left < sliderRect.left) {
          sliderElement.scrollBy({
            left: buttonRect.left - sliderRect.left - 10, // Offset
            behavior: "smooth",
          });
        } else if (buttonRect.right > sliderRect.right) {
          sliderElement.scrollBy({
            left: buttonRect.right - sliderRect.right + 10, // Offset
            behavior: "smooth",
          });
        }
      }
    }
  }, [selectedItem]);
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div>
      <div
        className={`${
          isSticky
            ? "sticky ssm:top-[4rem] small:top-[4.4rem] z-10 bg-white"
            : ""
        }`}
      >
        <div className="flex justify-center bg-[white]">
          <div className="relative w-full max-w-screen-sm px-6  ">
            <div
              ref={sliderRef}
              className="overflow-x-auto  whitespace-nowrap  hide-scrollbar cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              {categories.map((category) => (
                <button
                  key={category.categoryId}
                  id={`slider-button-${category.categoryId}`}
                  className={`inline-block text-black px-3 pt-[14px]  py-[10px] text-[11px] uppercase lg:text-base text-sm font-semibold text-midnight relative transition-opacity duration-300 ease-in-out ${
                    selectedItem?.categoryId === category.categoryId
                      ? "opacity-100"
                      : "opacity-60"
                  }`}
                  onClick={() => handleItemClick(category, true)}
                >
                  {category.categoryName}
                  {selectedItem?.categoryId === category.categoryId && (
                    <div className="absolute bottom-0 left-2 right-2 h-[3px] bg-[black]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* <div className="w-full h-[1.5px] bg-[#BCC1CA]"></div> */}
        <Search onSearch={setSearchQuery} />
      </div>
      <Cards
        handleItemClick={handleItemClick}
        isUserScroll={isUserScroll}
        searchQuery={searchQuery}
        onModalVisibleChange={onModalVisibleChange}
        // selectedArea={selectedArea}
      />
    </div>
  );
};

export default Slider;
