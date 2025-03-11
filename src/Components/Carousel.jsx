import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { FaCirclePlus, FaCircleMinus, FaExpand } from "react-icons/fa6";
import Slider from "react-slick";
import "rsuite/dist/rsuite.min.css";
import { Accordion, RadioGroup, Radio, CheckboxGroup, Checkbox } from "rsuite";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { v4 as uuidv4 } from "uuid"; // Import uuid
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
const Carousel = ({ candle, handleCloseForm, handleAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageEnlarged, setIsImageEnlarged] = useState(false); // State for enlarged image view
  const carouselRef = useRef(null);
  const sliderRef = useRef(null);
  const [selectedPrice, setSelectedPrice] = useState(candle.price);
  const [combinedImages, setCombinedImages] = useState([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  console.log(candle);
  const toggleDescription = () => {
    setIsDescriptionExpanded((prevState) => !prevState);
  };
  useEffect(() => {
    const productImages = Array.isArray(candle.image)
      ? candle.image
      : [candle.image];
    const variantImages =
      candle.variantTypeDropdowns?.flatMap((variant) =>
        variant.options
          ?.filter((option) => option.variantImg)
          .map((option) => option.variantImg)
      ) || [];
    const multipleImages =
      candle.multipleImges?.map((img) => img.imageUrl) || [];

    setCombinedImages([...productImages, ...multipleImages, ...variantImages]);
  }, [candle]);

  const images = Array.isArray(candle.image) ? candle.image : [candle.image];

  useEffect(() => {
    if (carouselRef.current) {
      const elementTop = carouselRef.current.getBoundingClientRect().top;
      const offset = -140;
      window.scrollTo({
        top: window.scrollY + elementTop + offset,
        behavior: "smooth",
      });
    }
  }, []);

  const handleVariantChange = (variantTypeId, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantTypeId]: value,
    }));

    const variant = candle.variantTypeDropdowns.find(
      (variant) => variant.variantTypeId === variantTypeId
    );
    const selectedOption = variant?.options.find(
      (option) => option.value === value
    );

    // Update price if variantPrice is available, otherwise retain the previously set price
    if (selectedOption?.variantPrice) {
      setSelectedPrice((prevPrice) => {
        // Only update price if it's not already set by a previous variant selection
        if (selectedOption.variantPrice !== prevPrice) {
          return selectedOption.variantPrice;
        }
        return prevPrice;
      });
    }

    // Update selected image index if there's an associated image
    if (selectedOption?.variantImg) {
      const imageIndex = combinedImages.findIndex(
        (image) => image === selectedOption.variantImg
      );
      if (imageIndex !== -1) {
        setSelectedImageIndex(imageIndex);
      }
    }

    setOpenPanel(null); // Close the panel

    // Check if all variants are selected and clear the error message if so
    const allVariantsSelected =
      candle.variantTypeDropdowns?.every(
        (variant) =>
          selectedVariants[variant.variantTypeId] ||
          variant.variantTypeId === variantTypeId
      ) || false;

    if (allVariantsSelected) {
      setErrorMessage("");
    }
  };

  const [openPanel, setOpenPanel] = useState(null); // Track open panel
  const [selectedVariants, setSelectedVariants] = useState({});
  const [selectedAddons, setSelectedAddons] = useState({});

  const isMediumScreen = () => window.innerWidth >= 768;

  const handleImageClick = (index) => {
    setSelectedImageIndex(index);
    setIsImageEnlarged(true); // Show the enlarged view
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(index);
    }
  };

  const incrementQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    setQuantity((prevQuantity) =>
      prevQuantity > 1 ? prevQuantity - 1 : prevQuantity
    );
  };
  const handleAddonChange = (addonTitle, selectedProducts) => {
    setSelectedAddons((prevAddons) => ({
      ...prevAddons,
      [addonTitle]: selectedProducts.map((product) => ({
        ...product,
        quantity: 1, // Always set quantity to 1
      })),
    }));
  };

  const handleAddToCartClick = () => {
    const allVariantsSelected =
      candle.variantTypeDropdowns?.every(
        (variant) => selectedVariants[variant.variantTypeId]
      ) || false;

    if (!allVariantsSelected) {
      setErrorMessage("Please select variants.");
      return;
    }

    if (quantity < 1) {
      setErrorMessage("Please select a valid quantity.");
      return;
    }

    // Main product item
    const cart = {
      id: uuidv4(),
      productId: candle.productId,
      name: candle.name,
      description: candle.description,
      quantity: quantity,
      price: selectedPrice,
      weightId: candle.weightId,
      weightRange: candle.weightRange,
      image: combinedImages[selectedImageIndex],
      selectedVariants: selectedVariants,
      categoryId: candle.categoryId,
      categoryName: candle.categoryName,
    };

    // Add-ons as separate cart items
    const addonItems = Object.values(selectedAddons)
      .flat()
      .map((addon) => ({
        id: uuidv4(),
        productId: addon.productId,
        name: addon.productName,
        description: addon.description || "",
        quantity: quantity,
        weightId: addon.weightId,
        weightRange: addon.weightRange,
        price: addon.productPrice || 0,
        image: addon.productImg || "",
        isAddon: true,
      }));

    // Combine product and addons
    const cartItem = [cart, ...addonItems];

    handleAddToCart(cartItem); // Pass all items to the cart handler
    handleCloseForm();
  };

  const settings = {
    dots: combinedImages.length > 1,
    infinite: combinedImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Disable arrows
    appendDots: (dots) => (
      <div
        style={{
          position: "absolute",
          bottom: "5px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <ul style={{ margin: "0px" }}>{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          backgroundColor: "#CEC1BC",
          margin: "0 3px",
        }}
      />
    ),
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(selectedImageIndex);
    }
  }, [selectedImageIndex]);

  const closeEnlargedView = () => {
    setIsImageEnlarged(false);
  };

  return (
    <div ref={carouselRef} className="bg-white w-full relative">
      {isImageEnlarged && (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)", // Apply blur effect here
          }}
          onClick={closeEnlargedView}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50 flex items-center justify-center"
        >
          <div
            style={{
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              position: "relative", // Ensure child elements can be positioned absolutely
            }}
            className="shadow-lg w-full max-w-[22rem]"
          >
            <img
              src={combinedImages[selectedImageIndex]}
              alt={`Enlarged Candle ${selectedImageIndex + 1}`}
              className="rounded-[14px] w-full h-full]"
            />
            <button
              className="absolute top-0 right-0 mt-2 mr-2 text-[#A8A39F] bg-white rounded-full p-0.5"
              onClick={closeEnlargedView}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      <Slider {...settings} ref={sliderRef}>
        {combinedImages.map((image, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-[14px] p-0.5"
          >
            <img
              src={image}
              alt={`Candle ${index + 1}`}
              className="w-full object-top small:h-[300px] sssm:h-[350px] object-cover rounded-[14px] cursor-pointer"
              onClick={isMediumScreen() ? null : () => handleImageClick(index)}
            />
            {isMediumScreen() && (
              <button
                className="absolute top-2 left-2 text-[#A8A39F] bg-white rounded-full p-1"
                onClick={() => handleImageClick(index)} // Pass the index of the image
              >
                <FaExpand size={14} />
              </button>
            )}

            <button
              className="absolute top-2 right-2 text-[#A8A39F] bg-white rounded-full p-1"
              onClick={handleCloseForm}
            >
              <FaTimes size={11} />
            </button>
          </div>
        ))}
      </Slider>

      <div className="text-left ml-2 mt-3">
        <div className="mr-3">
          <h3 className="uppercase font-bold lg:text-base text-sm pb-1">
            {candle.name}
          </h3>
          <div className="flex items-center pb-3">
            <p
              className={`text-[13px] ${
                isDescriptionExpanded ? "p-0" : "truncate"
              }`}
              style={{
                whiteSpace: isDescriptionExpanded ? "normal" : "nowrap",
                overflow: isDescriptionExpanded ? "visible" : "hidden",
                textOverflow: "ellipsis",
                marginRight: "10px",
                maxWidth: "95%",
              }}
            >
              {isDescriptionExpanded
                ? candle.description.split("\n").map((line, index) => (
                    <span
                      className="block"
                      key={index}
                      style={{ marginBottom: "0.1rem" }}
                    >
                      {line.trim()}
                    </span>
                  ))
                : candle.description.slice(0, 100)}
            </p>

            <button
              onClick={toggleDescription}
              className="text-[#A8A39F] text-sm ml-2"
              style={{ alignSelf: "flex-start" }}
            >
              {isDescriptionExpanded ? (
                <FaChevronUp className="inline-block" />
              ) : (
                <FaChevronDown className="inline-block" />
              )}
            </button>
          </div>
          <span className="bg-[#1A1A36]  px-2 rounded-[5px] text-[#D7FC51] py-2 text-[12px]  ">
            Price: {selectedPrice}
          </span>
        </div>

        <div className="accordion-container mt-3">
          <Accordion
            bordered
            activeKey={openPanel}
            onSelect={(key) => setOpenPanel(key === openPanel ? null : key)} // Toggle panel on explicit click
          >
            {/* Render variant dropdowns */}
            {candle.variantTypeDropdowns?.map((variant, index) => (
              <Accordion.Panel
                key={index}
                header={
                  <div className="text-[14px] font-medium">
                    <span>
                      {selectedVariants[variant.variantTypeId]
                        ? selectedVariants[variant.variantTypeId]
                        : `Select Any ${
                            variant.title.charAt(0).toUpperCase() +
                            variant.title.slice(1)
                          }`}
                    </span>
                  </div>
                }
                eventKey={index}
              >
                <div className="mt-2">
                  <RadioGroup
                    name={variant.title}
                    onChange={(value) =>
                      handleVariantChange(variant.variantTypeId, value)
                    }
                  >
                    {variant.options.map((option) => (
                      <Radio key={option.variantValueId} value={option.value}>
                        {option.value}
                      </Radio>
                    ))}
                  </RadioGroup>
                </div>
              </Accordion.Panel>
            ))}
            {/* Render Addons if available */}
            {candle.addons?.length > 0 && (
              <Accordion.Panel
                header={
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium text-[14px] w-[50%]">
                      Add Extra Options
                    </span>
                    {Object.keys(selectedAddons).length > 0 && (
                      <span
                        className=" overflow-hidden whitespace-nowrap text-ellipsis"
                        style={{ maxWidth: "100%" }}
                      >
                        {Object.values(selectedAddons)
                          .flat()
                          .map((addon) => addon.name)
                          .join("")}
                      </span>
                    )}
                  </div>
                }
                eventKey="addons"
              >
                <div className="mt-2">
                  {candle.addons.map((addon, index) => (
                    <div key={index} className="mt-3">
                      <CheckboxGroup
                        name={addon.title}
                        onChange={(values) => {
                          const selected = addon.products.filter((product) =>
                            values.includes(product.productName)
                          );
                          handleAddonChange(addon.title, selected);
                        }}
                      >
                        {addon.products.map((product) => (
                          <Checkbox
                            key={product.productId}
                            value={product.productName}
                          >
                            <div className="flex justify-between w-full">
                              <span>{product.productName}</span>
                              {product.productPrice && (
                                <span className="text-gray-500 ml-2">
                                  {product.productPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </div>
                  ))}
                </div>
              </Accordion.Panel>
            )}
          </Accordion>
        </div>

        {errorMessage && (
          <div className="mt-3 text-red-500 text-sm">{errorMessage}</div>
        )}

        <div className="flex items-center justify-between mt-4 w-full">
          <div className="flex items-center bg-[#090916] py-3 px-4 mb-3 rounded-[4px]">
            <button
              onClick={decrementQuantity}
              className={`text-[#D7FC51] mx-1 text-xl ${
                quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={quantity === 1}
            >
              <FaCircleMinus />
            </button>

            <span className="text-[#D7FC51] mx-2 w-11 text-center">
              {quantity.toString().padStart(2, "0")}
            </span>

            <button
              onClick={incrementQuantity}
              className="text-[#D7FC51] mx-1 text-xl"
            >
              <FaCirclePlus />
            </button>
          </div>

          <button
            className="w-full px-4 py-3 rounded-[4px] bg-[#090916] mb-3 ml-4 text-white"
            onClick={handleAddToCartClick}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
