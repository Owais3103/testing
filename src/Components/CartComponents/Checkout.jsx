import React, { useRef, useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTimes } from "react-icons/fa";
import Details from "./Details";
import Checkoutbutton from "./Checkoutbutton";
import ProductModal from "./ProductModal";
const Checkout = ({
  cartItems,
  setIsCheckout,
  setModalVisible,
  setCartItems,
  allproducts,
  formData,
  setFormData,
}) => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [isOpen, setIsOpen] = useState(true);
  const [isCheckoutFormVisible, setIsCheckoutFormVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  console.log(cartItems);

  // const [formData, setFormData] = useState({
  //   firstName: "",
  //   address: "",
  //   city: "",
  //   contact: "",
  // });

  const incrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCartItems(
      (prevItems) =>
        prevItems
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0) // Remove items with quantity 0
    );
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.pageY - scrollContainerRef.current.offsetTop);
    setScrollTop(scrollContainerRef.current.scrollTop);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const y = e.pageY - scrollContainerRef.current.offsetTop;
    const walk = (y - startY) * 2;
    scrollContainerRef.current.scrollTop = scrollTop - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const toggleCheckout = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsCheckout(false);
        setModalVisible(true);
        setIsAnimating(false);
      }, 300);
    }
    setIsOpen(!isOpen);
  };

  const cartData = {
    items: cartItems.map((item) => ({
      id: item.id,
      productId: item.productId,
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      weightId: item.weightId,
      weight_range: item.weightRange,
      price: parseFloat(item.price), // Convert price to a number
      total: parseFloat(item.price) * item.quantity, // Calculate total for the item
      image: item.image,
      selectedVariants: item.selectedVariants || null, // Include variants if available
      category: item.categoryId,
      isAddon: item.isAddon || false,
      // Flag for addons
    })),
    totalWeightRange: cartItems.reduce(
      (totalWeight, item) => totalWeight + item.weightRange * item.quantity,
      0
    ), // Add total weight range
  };

  console.log(cartData);
  const updateCartItem = (updatedItem) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      )
    );
  };

  const handleCheckoutClick = () => {
    console.log("Cart Data:", cartData);
    setIsCheckoutFormVisible(true);
  };
  const [selectedItem, setSelectedItem] = useState(null); // Track selected item for modal
  const closeProductModal = () => setSelectedItem(null);

  const handleBackClick = () => {
    setIsCheckoutFormVisible(false);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {selectedItem ? (
        <ProductModal
          item={selectedItem}
          handleClose={closeProductModal}
          allproducts={allproducts}
          onUpdateCart={updateCartItem} // Pass the handler here
        />
      ) : (
        <>
          <div
            className="fixed inset-0 bg-black"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)", // Apply blur effect here
            }}
            onClick={toggleCheckout}
          ></div>
          <div
            className={`fixed checkout-modal bottom-0 left-0 right-0 flex pt-4  justify-center transition-transform duration-700 xs:py-2 ${
              isOpen ? "translate-y-0" : "translate-y-full"
            } ${isAnimating ? "sliding-down" : ""}`} // Apply sliding down class during animation
          >
            <div
              style={{
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
              }}
              className="bg-[#f6f8fc] shadow-lg w-full small:h-[545px] sssm:h-[535px] lg:h-[630px] max-w-[35rem]  "
            >
              {!isCheckoutFormVisible ? (
                <>
                  <div className="pl-6 pr-6">
                    <div className="flex small:mb-4 sssm:mt-2 sssm:mb-2 small:mt-4 justify-between items-center">
                      <h2 className="text-[19px] font-bold  flex-grow text-center">
                        Cart
                      </h2>
                      <button
                        onClick={toggleCheckout}
                        className="text-black bg-white rounded-full p-1"
                      >
                        <FaTimes size={16} />
                      </button>
                    </div>

                    <div className="pb-2">
                      <div
                        ref={scrollContainerRef}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        className="small:h-[345px] sssm:h-[350px] lg:h-[426px] overflow-y-scroll"
                        style={{
                          scrollbarWidth: "none", // For Firefox
                          msOverflowStyle: "none", // For Internet Explorer and Edge
                          cursor: isDragging ? "grabbing" : "grab",
                        }}
                      >
                        <style>
                          {`
                /* Hide scrollbar for WebKit browsers like Chrome and Safari */
                .h-[250px]::-webkit-scrollbar {
                  display: none;
                }
              `}
                        </style>
                        {cartItems.map((item) => (
                          <div
                            className="flex  items-center mb-4"
                            key={item.id}
                          >
                            <div className="flex overflow-hidden items-center ">
                              <img
                                src={item.image}
                                alt={item.name}
                                onClick={() => setSelectedItem(item)} // Set the selected item for the modal
                                className="w-[100px] flex-shrink-0  object-top h-[85px] object-cover rounded-[10px]"
                              />
                              <div className="ml-2 ssm:mr-8 text-left overflow-hidden">
                                <h6 className="font-bold  capitalize  truncate pr-5  ssm:w-full">
                                  {item.name}
                                </h6>

                                {item.selectedVariants && (
                                  <p className="text-[12px] text-gray-600">
                                    {Object.values(item.selectedVariants).join(
                                      ", "
                                    )}
                                  </p>
                                )}
                                <h6 className="font-extrabold">
                                  PKR {item.price}
                                </h6>
                              </div>
                            </div>

                            <div className="flex ml-auto items-center">
                              <button
                                type="button"
                                onClick={() => decrementQuantity(item.id)} // Decrement item quantity
                                className="bg-[#1A1A36] text-[#D7FC51] p-[5px] rounded-full"
                              >
                                <FaMinus />
                              </button>
                              <p className="mx-1 text-[12px] font-bold w-6 text-center">
                                {item.quantity}
                              </p>
                              <button
                                type="button"
                                onClick={() => incrementQuantity(item.id)} // Increment item quantity
                                className="bg-[#1A1A36] text-[#D7FC51] p-[5px] rounded-full"
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <hr className="border-t border-gray-300 mt-2 mb-[6px]" />

                      <div className="flex justify-between">
                        <span
                          style={{
                            fontWeight: "650",
                            fontFamily: "Poppins, sans-serif",
                          }}
                          className=""
                        >
                          Total Payment
                        </span>
                        <span className=" font-extrabold">
                          PKR {calculateTotalPrice().toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Checkoutbutton
                    buttonLbel={"Checkout"}
                    onClick={handleCheckoutClick}
                  />
                </>
              ) : (
                <>
                  <Details
                    cartItems={cartItems}
                    handleBackClick={handleBackClick}
                    toggleCheckout={toggleCheckout}
                    cartData={cartData}
                    formData={formData}
                    setFormData={setFormData}
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Checkout;
