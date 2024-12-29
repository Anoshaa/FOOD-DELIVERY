// import React, { useState } from "react";
// import Swal from "sweetalert2";
// import { db } from "./firebase"; // Assuming you have Firebase set up
// import { collection, addDoc } from "firebase/firestore"; // Importing Firebase Firestore functions

// function Cards({ image, rating, title, paragraph, price, renderRatingIcons }) {
//   const [orders, setOrders] = useState([]);

//   // Function to handle the "Buy" button click
//   const handleBuyClick = async () => {
//     let updatedOrders = [...orders];

//     // Ask for the quantity of the selected burger
//     const { value: quantity } = await Swal.fire({
//       title: `Enter quantity for ${title}`,
//       input: "number",
//       inputLabel: "Quantity",
//       inputPlaceholder: "Enter quantity here",
//       showCancelButton: true,
//       inputValidator: (value) => {
//         if (!value || value <= 0) {
//           return "Please enter a valid quantity!";
//         }
//       },
//     });

//     if (!quantity) return;

//     // Add the new order to the updated orders array (without flavor)
//     const newOrder = { title, price, quantity };
//     updatedOrders.push(newOrder);

//     // Update the orders state
//     setOrders(updatedOrders);

//     // Calculate total price
//     const totalPrice = updatedOrders.reduce((total, order) => total + (order.price * order.quantity), 0);

//     // Get user details in a single SweetAlert
//     const { value: userDetails } = await Swal.fire({
//       title: "Enter your details",
//       html: `
//         <input id="name" class="swal2-input" placeholder="Enter your name" />
//         <input id="phone" class="swal2-input" placeholder="Enter your phone number" />
//         <input id="location" class="swal2-input" placeholder="Enter your location" />
//       `,
//       focusConfirm: false,
//       preConfirm: () => {
//         const name = document.getElementById("name").value;
//         const phone = document.getElementById("phone").value;
//         const location = document.getElementById("location").value;
//         if (!name || !phone || !location) {
//           Swal.showValidationMessage("All fields are required!");
//         }
//         return { name, phone, location };
//       },
//     });

//     if (!userDetails) return;

//     // Save all accumulated orders to Firebase
//     try {
//       await addDoc(collection(db, "purchases"), {
//         ...userDetails,
//         orders: updatedOrders, // Include all accumulated orders
//         totalPrice, // Add total price
//         timestamp: new Date(),
//       });

//       // Clear the orders after successful save
//       setOrders([]);

//       Swal.fire({
//         icon: "success",
//         title: "Purchase successful!",
//         text: `Thank you, ${userDetails.name}. Your orders have been placed successfully! Total Price: $${totalPrice}`,
//       });
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Oops...",
//         text: "Something went wrong with the purchase!",
//       });
//     }
//   };

//   return (
//     <div className="col-sm-6 col-lg-4 col-xl-3 mb-4">
//       <div className="card overflow-hidden">
//         <div className="overflow-hidden">
//           <img src={image} alt={title} className="card-img-top" />
//         </div>
//         <div className="card-body">
//           <div className="d-flex align-items-center justify-content-between">
//             <div className="item_rating">{renderRatingIcons(rating)}</div>
//             <div className="wishlist">
//               <i className="bi bi-heart"></i>
//             </div>
//           </div>

//           <h5 className="card-title">{title}</h5>
//           <p className="card-text">{paragraph}</p>

//           <div className="d-flex align-items-center justify-content-between">
//             <div className="menu_price">
//               <h5 className="mb-0">${price}</h5>
//             </div>
//             <div className="buy_button">
//   <button onClick={handleBuyClick} className="btn custom-buy-button">
//     Buy
//   </button>
// </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Cards;


import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

function Cards({ image, rating, title, paragraph, price, renderRatingIcons }) {
  const [orders, setOrders] = useState([]);
  const [liked, setLiked] = useState(false); // State to track if the heart icon is clicked

  // Fetch the liked state from localStorage when the component mounts
  useEffect(() => {
    const savedLikedState = localStorage.getItem(`liked-${title}`);
    if (savedLikedState === "true") {
      setLiked(true);
    }
  }, [title]);

  // Function to toggle the liked state
  const toggleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);

    // Save the new liked state to localStorage
    localStorage.setItem(`liked-${title}`, newLikedState);
  };

  // Function to handle the "Buy" button click
  const handleBuyClick = async () => {
    let updatedOrders = [...orders];

    // Ask for quantity
    const { value: quantity } = await Swal.fire({
      title: `Enter quantity for ${title}`,
      input: "number",
      inputLabel: "Quantity",
      inputPlaceholder: "Enter quantity here",
      showCancelButton: true,
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
      buttonsStyling: false,
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return "Please enter a valid quantity!";
        }
      },
    });

    if (!quantity) return;

    const newOrder = { title, price, quantity };
    updatedOrders.push(newOrder);
    setOrders(updatedOrders);

    const totalPrice = updatedOrders.reduce(
      (total, order) => total + order.price * order.quantity,
      0
    );

    // Ask for user details
    const { value: userDetails } = await Swal.fire({
      title: "Enter your details",
      html: `
        <input id="name" class="swal2-input" placeholder="Enter your name" />
        <input id="phone" class="swal2-input" placeholder="Enter your phone number" />
        <input id="location" class="swal2-input" placeholder="Enter your location" />
      `,
      focusConfirm: false,
      customClass: {
        confirmButton: "swal-confirm-button",
        cancelButton: "swal-cancel-button",
      },
      buttonsStyling: false,
      preConfirm: () => {
        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const location = document.getElementById("location").value;
        if (!name || !phone || !location) {
          Swal.showValidationMessage("All fields are required!");
        }
        return { name, phone, location };
      },
    });

    if (!userDetails) return;

    try {
      await addDoc(collection(db, "purchases"), {
        ...userDetails,
        orders: updatedOrders,
        totalPrice,
        timestamp: new Date(),
      });

      setOrders([]);

      Swal.fire({
        icon: "success",
        title: "Purchase successful!",
        text: `Thank you, ${userDetails.name}. Your orders have been placed successfully! Total Price: $${totalPrice}`,
        customClass: {
          confirmButton: "swal-confirm-button",
        },
        buttonsStyling: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with the purchase!",
        customClass: {
          confirmButton: "swal-confirm-button",
        },
        buttonsStyling: false,
      });
    }
  };

  return (
    <div className="col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div className="card overflow-hidden">
        <div className="overflow-hidden">
          <img src={image} alt={title} className="card-img-top" />
        </div>
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <div className="item_rating">{renderRatingIcons(rating)}</div>
            <div className="wishlist" onClick={toggleLike}>
              <i
                className={`bi bi-heart${liked ? "-fill" : ""}`}
                style={{ color: liked ? "red" : "inherit", cursor: "pointer" }}
              ></i>
            </div>
          </div>

          <h5 className="card-title">{title}</h5>
          <p className="card-text">{paragraph}</p>

          <div className="d-flex align-items-center justify-content-between">
            <div className="menu_price">
              <h5 className="mb-0">${price}</h5>
            </div>
            <div className="buy_button">
              <button onClick={handleBuyClick} className="btn custom-buy-button">
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cards;



