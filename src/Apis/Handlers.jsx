// handlers.jsx
// export const fetchCategories = async () => {
//     try {
//       const response = await fetch("http://tapppp.il-solution.com/api/Stores/get_categories", {
//         method: "POST",
//         headers: {
//           accept: "*/*",
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch categories");
//       }

//       const data = await response.json();
//       return data;
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   };

// handler.jsx
// handlers.jsx

// const baseURL = "https://tapppp.il-solution.com/api/Stores"; // Define the base URL

// const baseURL = "https://api.tapppp.com/api/Stores"; // Define the base URL
const baseURL = "https://api.tapppp.com/api/Stores"; // Define the base URL

export const fetchCategories = async (storeId) => {
  try {
    const response = await fetch(
      `${baseURL}/get_categories?storeid=${storeId}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const fetchProducts = async (storeId) => {
  try {
    const response = await fetch(
      `${baseURL}/fetch_product?storeid=${storeId}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchStoreData = async (storeLink) => {
  try {
    const response = await fetch(
      `${baseURL}/checkstore?storelink=${storeLink}`,
      {
        method: "POST",
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching store data:", error);
    throw error;
  }
};

// export const fetchMethods = async () => {
//   try {
//     const response = await fetch(`${baseURL}/methods`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "*/*",
//       },
//       body: JSON.stringify({}),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching methods:", error);
//     throw error;
//   }
// };

// export const submitCheckout = async (combinedData) => {
//   try {
//     const response = await fetch(`${baseURL}/checkout`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "*/*",
//       },
//       body: JSON.stringify(combinedData),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error("Error during checkout:", error);
//     throw error;
//   }
// };
