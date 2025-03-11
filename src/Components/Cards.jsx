import React, { useState, useEffect, useRef } from "react";
import Carousel from "./Carousel.jsx";
import CartModal from "./CartModal.jsx";
import Checkout from "./CartComponents/Checkout.jsx";
import { fetchCategories, fetchProducts } from "../Apis/Handlers.jsx";
import { FaPlus } from "react-icons/fa";
import { FaCirclePlus, FaCircleMinus, FaExpand } from "react-icons/fa6";

const Cards = ({
  handleItemClick,
  isUserScroll,
  searchQuery,
  onModalVisibleChange,
}) => {
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [products, setProducts] = useState({}); // Store products keyed by categoryId
  const [selectedCandle, setSelectedCandle] = useState({
    categoryId: null,
    candleId: null,
  });
  const [loading, setLoading] = useState(true); // Loading state

  const [modalVisible, setModalVisible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const categoryRefs = useRef([]);

  const [formData, setFormData] = useState({
    firstName: "",
    address: "",
    city: "",
    contact: "",
  });

  console.log(cartItems);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isUserScroll) return; // Prevent conflicts during manual scrolling

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const categoryId = entry.target.getAttribute("data-category-id");
            const category = categories.find(
              (item) => item.categoryId === Number(categoryId)
            );

            if (category) {
              handleItemClick(category, false); // Auto-select the visible category
            }
          }
        });
      },
      {
        root: null,
        threshold: 0.4, // Adjust based on your UI design
      }
    );

    categoryRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      categoryRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [categories, handleItemClick, isUserScroll]);

  const handleCloseForm = () => {
    setSelectedCandle({ categoryId: null, candleId: null });
  };
  // Fetch categories from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeId = localStorage.getItem("storeId");
        if (!storeId) {
          console.error("Store ID not found in localStorage");
          setLoading(false);
          return;
        }

        const fetchedCategories = await fetchCategories(storeId);
        const fetchedProducts = await fetchProducts(storeId);

        const filteredCategories = fetchedCategories.filter(
          (category) => fetchedProducts[category.categoryId]?.length > 0
        );

        setCategories(filteredCategories);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products by category and search query
  const filteredProducts = (categoryId) => {
    const categoryProducts = products[categoryId] || [];
    if (!searchQuery.trim()) return categoryProducts;

    return categoryProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) => filteredProducts(category.categoryId).length > 0
  );

  const handleAddToCart = (newItems) => {
    setCartItems((prevItems) => {
      const updatedItems = [...prevItems];

      newItems.forEach((newItem) => {
        // Check if the new item is already in the cart
        const existingItemIndex = updatedItems.findIndex(
          (item) =>
            item.productId === newItem.productId &&
            JSON.stringify(item.selectedVariants) ===
              JSON.stringify(newItem.selectedVariants) &&
            !!item.isAddon === !!newItem.isAddon
        );

        if (existingItemIndex > -1) {
          // Update the quantity of the existing item
          updatedItems[existingItemIndex].quantity += newItem.quantity;
        } else {
          // Add the new item to the cart
          updatedItems.push(newItem);
        }
      });

      return updatedItems;
    });

    setModalVisible(true);
    onModalVisibleChange(true);
  };

  const handleCheckoutClick = () => {
    setModalVisible(false);
    setIsCheckout(true);
    const firstCategory = categories[0];
    if (firstCategory) handleItemClick(firstCategory);
  };

  return (
    <div className="flex justify-center bg-[#F4F5F8]" id="cards-container">
      <div className="relative w-full max-w-screen-sm pl-4 pr-4 ">
        <div>
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category, index) => (
              <div
                key={category.categoryId}
                id={`category-${category.categoryId}`}
                data-category-id={category.categoryId}
                ref={(el) => (categoryRefs.current[index] = el)}
              >
                <h2 className="text-[#090916] mt-6 uppercase font-extrabold text-left text-[17px] leading-[2rem] ml-2">
                  {category.categoryName}
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {filteredProducts(category.categoryId).map((product) => (
                    <div
                      key={product.productId}
                      className="border rounded-[15px] p-2 pl-3 pt-3  pb-3 pr-4 bg-[#FFFFFF] flex  relative"
                      id={`product-${product.productId}`}
                    >
                      {selectedCandle.categoryId === category.categoryId &&
                      selectedCandle.candleId === product.productId ? (
                        <Carousel
                          candle={{
                            ...product,
                            image: Array.isArray(product.image)
                              ? product.image
                              : [product.image],
                            categoryId: category.categoryId, // Pass categoryId
                            categoryName: category.categoryName, // Pass categoryName
                          }}
                          handleCloseForm={handleCloseForm}
                          handleAddToCart={handleAddToCart}
                        />
                      ) : (
                        <form
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCandle({
                              categoryId: category.categoryId,
                              candleId: product.productId,
                            });
                          }}
                          className="flex w-full cursor-pointer duration-300"
                        >
                          {/* Image Section */}
                          <div className="flex-shrink-0 h-32 small:w-[130px] ssssm:w-[125px] object-contain rounded-lg">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover object-top rounded-lg"
                            />
                          </div>

                          {/* Content Section */}

                          <div className="flex w-full">
                            <div className="text-left ml-2 mr-2  ">
                              <div className="flex justify-between  h-8 items-center ">
                                <h3 className="  pl-1 font-extrabold uppercase text-[14px] line-clamp-1 break-words mr-3 ">
                                  {product.name}
                                </h3>
                              </div>
                              <p className="line-clamp-3 ssm:pt-1 small:pt-[2px] small:text-[11px] ssm:text-[11px] xssmall:text-[12px] pl-1 ssm:pr-[2rem] small:pr-[0.5rem]">
                                {product.description}
                              </p>
                              <div className="small:mt-3 ssm:mt-4 flex items-center">
                                <button
                                  className="bg-[#1A1A36] gap-2 rounded-[5px] text-[#D7FC51] py-1 text-[12px] px-2 flex items-center gap-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedCandle({
                                      categoryId: category.categoryId,
                                      candleId: product.productId,
                                    });
                                  }}
                                >
                                  PKR {product.price}
                                  <FaCirclePlus size={12} className="" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div
              className={`text-center text-gray-600 font-medium mt-8 ${
                searchQuery.trim() ? "sssm:mb-[7rem] small:mb-[23rem]" : ""
              }`}
            >
              {searchQuery.trim() && <p>Product Not Found</p>}
            </div>
          )}
        </div>
        {!isCheckout ? (
          <CartModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            cartItems={cartItems}
            handleCheckoutClick={handleCheckoutClick}
          />
        ) : (
          <Checkout
            cartItems={cartItems}
            setIsCheckout={setIsCheckout}
            setModalVisible={setModalVisible}
            setCartItems={setCartItems}
            allproducts={products}
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </div>
    </div>
  );
};

export default Cards;
