import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "rsuite/dist/rsuite.min.css";
import { Accordion, RadioGroup, Radio } from "rsuite";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaCirclePlus,
  FaCircleMinus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";

const ProductModal = ({ item, handleClose, allproducts, onUpdateCart }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [selectedVariants, setSelectedVariants] = useState(
    item.selectedVariants || {}
  );

  const handleUpdateButtonClick = () => {
    const updatedItem = {
      ...item,
      quantity, // Updated quantity
      selectedVariants, // Updated variants
      price: currentPrice, // Pass the current price
    };

    // Check if there are changes
    const hasChanges =
      item.quantity !== quantity ||
      JSON.stringify(item.selectedVariants) !==
        JSON.stringify(selectedVariants) ||
      item.price !== currentPrice; // Check if price has changed

    if (hasChanges) {
      onUpdateCart(updatedItem); // Update cart only if there are changes
    }

    handleClose(); // Close the modal
  };

  console.log(allproducts);
  const matchingProduct = Object.values(allproducts)
    .flat()
    .find((product) => product.productId === item.productId);

  // Check for matches in addons
  const addonMatches = item.addons
    ? item.addons
        .map((addonId) =>
          Object.values(allproducts)
            .flat()
            .find((product) => product.productId === addonId)
        )
        .filter(Boolean) // Remove undefined matches
    : [];

  // Combine parent and addons
  const displayedProducts = [matchingProduct, ...addonMatches].filter(Boolean);

  const productImages = [
    ...(matchingProduct?.image ? [matchingProduct.image] : [item.image]),
    ...(matchingProduct?.variantTypeDropdowns?.flatMap((variant) =>
      variant.options
        .filter((option) => option.variantImg)
        .map((option) => option.variantImg)
    ) || []),
  ];

  const toggleDescription = () => {
    setIsDescriptionExpanded((prevState) => !prevState);
  };

  useEffect(() => {
    setIsModalVisible(true);

    // Find the index of the item's image in the productImages array
    const initialImageIndex = productImages.findIndex(
      (img) => img === item.image
    );

    if (initialImageIndex !== -1) {
      setCurrentSlide(initialImageIndex);
    }
  }, [item.image, productImages]);

  const closeWithAnimation = () => {
    setIsModalVisible(false);
    setTimeout(handleClose, 300);
  };

  const settings = {
    infinite: productImages.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: productImages.length > 1,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  if (!item) return null;

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const [basePrice, setBasePrice] = useState(Number(item.price)); // Track base price
  const [currentPrice, setCurrentPrice] = useState(Number(item.price)); // Displayed price

  const handleVariantChange = (variantTypeId, value) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantTypeId]: value,
    }));

    // Find the variant's option
    const variantOption = matchingProduct?.variantTypeDropdowns
      ?.flatMap((variant) => variant.options)
      ?.find((option) => option.value === value);

    // Update the image if the variant has one
    if (variantOption?.variantImg) {
      item.image = variantOption.variantImg;

      const variantImageIndex = productImages.findIndex(
        (img) => img === variantOption.variantImg
      );
      if (variantImageIndex !== -1) {
        setCurrentSlide(variantImageIndex);
        sliderRef.current.slickGoTo(variantImageIndex); // Update slider position
      }
    }

    // Update the price only if the variant has a price
    if (variantOption?.variantPrice) {
      setCurrentPrice(variantOption.variantPrice);
      setBasePrice(variantOption.variantPrice); // Update base price
    } else {
      setCurrentPrice(basePrice); // Use the existing base price
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const sliderRef = useRef(null);

  console.log(item);

  const modalContentRef = useRef(null);

  useEffect(() => {
    setIsModalVisible(true);

    // Find the index of the item's image in the productImages array
    const initialImageIndex = productImages.findIndex(
      (img) => img === item.image
    );

    if (initialImageIndex !== -1) {
      setCurrentSlide(initialImageIndex);
      sliderRef.current?.slickGoTo(initialImageIndex); // Navigate the slider to the initial image
    }

    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({
        top: modalContentRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [item.image, productImages]);

  return (
    <div
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(10px)",
      }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={closeWithAnimation}
      ></div>

      <div
        ref={modalContentRef} // Reference the modal content div
        className={`bg-[#f6f8fc] rounded-lg shadow-lg z-10 max-w-md w-full transition-all duration-300 ease-in-out transform ${
          isModalVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{ maxHeight: "90vh", overflowY: "auto", scrollbarWidth: "none" }}
      >
        <style jsx>{`
          .overflow-y-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div
          className=""
          style={{
            position: "sticky",
            zIndex: 50,
            top: "12px",
          }}
        >
          <button
            onClick={closeWithAnimation}
            className="text-black bg-white rounded-full  p-1 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
            style={{
              position: "absolute", // Positioning the button absolutely
              right: "14px", // Adjust the right spacing to place it at the top right
            }}
          >
            <FaTimes size={12} />
          </button>
        </div>

        <div className="relative pl-1 pr-1 pt-1 overflow-hidden rounded-[14px]">
          <Slider ref={sliderRef} {...settings}>
            {productImages.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-[14px] p-0.5"
              >
                <img
                  src={image}
                  alt={`Product Image ${index + 1}`}
                  className="w-full small:h-[300px] sssm:h-[350px] object-cover object-top rounded-[14px] cursor-pointer"
                />
              </div>
            ))}
          </Slider>
          <div className="flex justify-center mt-2 space-x-2">
            {productImages.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-1 rounded transition-all duration-300 ${
                  index === currentSlide ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-left p-2">
          {displayedProducts.map((product, index) => (
            <div key={index} className="mb-1">
              <h3 className="uppercase font-bold lg:text-base text-sm pt-6 pb-1">
                {product.name}
              </h3>
              <div className="flex items-center">
                <p
                  className={`text-sm ${
                    isDescriptionExpanded ? "p-0" : "truncate"
                  }`}
                  style={{
                    whiteSpace: isDescriptionExpanded ? "normal" : "nowrap",
                    overflow: isDescriptionExpanded ? "visible" : "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "85%",
                  }}
                >
                  {isDescriptionExpanded
                    ? product.description.split("\n").map((line, index) => (
                        <span
                          className="block"
                          key={index}
                          style={{ marginBottom: "0.3rem" }}
                        >
                          {line.trim()}
                        </span>
                      ))
                    : product.description.slice(0, 100)}
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
            </div>
          ))}
          <div className="flex  items-center gap-1">
            <span className="bg-[#1A1A36]  px-2 rounded-[5px] text-[#D7FC51] py-2 text-[12px]  ">
            Price{currentPrice ? ` ${currentPrice}` : "N/A"}
            </span>
          </div>
          <div className="accordion-container mt-2">
            <Accordion bordered>
              {!item.isAddon &&
                matchingProduct?.variantTypeDropdowns?.map((variant, index) => (
                  <Accordion.Panel
                    key={index}
                    header={
                      <div className="text-[14px] font-medium flex justify-between">
                        <span>
                          Selected{" "}
                          {variant.title.charAt(0).toUpperCase() +
                            variant.title.slice(1)}
                        </span>
                        {selectedVariants[variant.variantTypeId] ||
                        item.selectedVariants[variant.variantTypeId] ? (
                          <span className="text-[#1A1A36] font-semibold text-[14px] mr-3">
                            {selectedVariants[variant.variantTypeId] ||
                              item.selectedVariants[variant.variantTypeId]}
                          </span>
                        ) : (
                          <span className="text-[#A8A39F] text-[14px]">
                            None
                          </span>
                        )}
                      </div>
                    }
                  >
                    <RadioGroup
                      name={variant.title}
                      value={
                        selectedVariants[variant.variantTypeId] ||
                        item.selectedVariants[variant.variantTypeId]
                      }
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
                  </Accordion.Panel>
                ))}
            </Accordion>
          </div>

          <div className="flex items-center justify-between mt-4 w-full">
            <div className="flex items-center bg-[#090916] py-3 px-4 mb-3 rounded-[4px]">
              <button
                onClick={decrementQuantity}
                className="text-[#D7FC51] button-effect mx-1 text-xl"
              >
                <FaCircleMinus />
              </button>
              <span className="text-[#D7FC51] mx-2 w-11 text-center">
                {quantity.toString().padStart(2, "0")}
              </span>
              <button
                onClick={incrementQuantity}
                className="text-[#D7FC51] button-effect mx-1 text-xl"
              >
                <FaCirclePlus />
              </button>
            </div>

            <button
              className="w-full px-4 py-3 rounded-[4px] bg-[#090916] mb-3 ml-4 text-white"
              onClick={handleUpdateButtonClick}
            >
              Update cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
