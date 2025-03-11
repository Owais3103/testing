import React from "react";

function Checkoutbutton({ onClick, buttonLbel, disabled }) {
  return (
    <div
      style={{ borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}
      className="bg-white px-3 pb-3"
    >
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-full mt-2 text-white py-4 rounded-[40px] ${
          disabled ? "bg-gray-500 cursor-not-allowed" : "bg-black"
        }`}
      >
        {buttonLbel}
      </button>
    </div>
  );
}

export default Checkoutbutton;
