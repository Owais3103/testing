import React, { useState } from "react";
// import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer = ({ isModalVisible }) => {
  // console.log("Footer: Is modal visible?", isModalVisible); // Debug log

  // const [hoveredSocial, setHoveredSocial] = useState(null);

  // const handleMouseEnter = (icon) => {
  //   setHoveredSocial(icon);
  // };

  // const handleMouseLeave = () => {
  //   setHoveredSocial(null);
  // };

  // const socialIcons = [
  //   { icon: <FaFacebookF />, link: "https://www.facebook.com" },
  //   { icon: <FaInstagram />, link: "https://www.instagram.com/wearkiswa" },
  //   { icon: <FaWhatsapp />, link: "https://www.whatsapp.com" },
  // ];
  // const storeName = localStorage.getItem("storeName");

  return (
    <div className={` ${isModalVisible ? "mb-[90px]" : ""}`}>
      {/* <div  className="bg-[black] rounded-lg  max-w-[38rem] w-full px-4 py-2">
        <div className="sssm:justify-center small:justify-between" style={styles.container}>
          <div className="pt-5 pb-5">
            <h1 className="leading-[1rem] text-white uppercase font-extrabold">{storeName}</h1>
          </div>
          <div className="" style={styles.socialMedia}>
            {socialIcons.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-[18px]"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

// const styles = {
//   container: {
//     display: "flex",
//     alignItems: "center",
//     gap: "50px",
//     flexWrap: "wrap",
//   },
//   socialMedia: {
//     display: "flex",
//     gap: "20px",
//   },
// };

export default Footer;
