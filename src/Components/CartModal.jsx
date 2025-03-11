import { FaCartArrowDown } from "react-icons/fa6";

const CartModal = ({ visible, handleCheckoutClick, cartItems }) => {
  if (!visible) return null; // Don't render if not visible

  // Calculate the total quantity of items in the cart
  const totalQuantity = (cartItems || []).reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Calculate the total price of items in the cart including add-ons
  const totalPrice = (cartItems || []).reduce((total, item) => {
    const itemBasePrice = item.quantity * parseFloat(item.price || 0);
    const addOnsPrice = Object.values(item.selectedAddons || {})
      .flat()
      .reduce(
        (addOnsTotal, addOn) => addOnsTotal + parseFloat(addOn.price || 0),
        0
      );
    return total + itemBasePrice + addOnsPrice * item.quantity;
  }, 0);

  console.log(cartItems);

  let displayMessage;
  if (cartItems.length === 1) {
    if (cartItems[0].quantity === 1) {
      displayMessage = cartItems[0].name; // Show the name of the first product
    } else {
      displayMessage = `${cartItems[0].quantity} items added`; // Show total quantity
    }
  } else if (cartItems.length > 1) {
    displayMessage = `Total Items: ${totalQuantity}`; // Show total items for multiple products
  }

  return (
    <div className="fixed bottom-0  left-0 right-0 flex justify-center">
      <div
        style={{
          borderTopLeftRadius: "24px",
          borderTopRightRadius: "24px",
        }}
        className="bg-[rgba(235,235,244,0.93)] max-w-[38rem] w-full px-4 py-4"
      >
        <button
          className="flex justify-center w-full"
          onClick={handleCheckoutClick}
        >
          <div className="bg-[#090916] text-white rounded-[40px] px-6 py-3 flex  items-center w-full">
            <FaCartArrowDown className="mr-2" />
            <h3 className=" small:text-[14px] ssm:text-[16px] overflow-hidden truncate small:w-[52%]  ssm:w-[62%]  capitalize font-bold text-left">
              {displayMessage}
            </h3>
            <span className="ml-auto text-[#D7FC51]  font-bold">
              <h3 className="font-extrabold small:text-[12px] ssm:text-[16px] small:w-[100%] ssm:w-[100%] ">
                PKR {totalPrice.toFixed(2)}
              </h3>
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CartModal;
