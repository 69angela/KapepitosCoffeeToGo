// Handle Payment Method Selection and Instructions
document.getElementById("paymentForm").addEventListener("change", function(e) {
  const selected = e.target.value;
  let instruction = "";

  // Display instructions based on the selected payment method
  if (selected === "gcash") {
      instruction = "Send payment to GCash #09XXXXXXXXX and upload a screenshot.";
  } else if (selected === "paymaya") {
      instruction = "Send to PayMaya #09XXXXXXXXX.";
  } else if (selected === "bank") {
      instruction = "Transfer to BPI Account 1234-5678-90.";
  } else {
      instruction = "You'll pay upon delivery. Have your payment ready.";
  }

  // Update the instructions on the page
  document.getElementById("payment-instructions").innerText = instruction;

  // Show upload proof for GCash/PayMaya/Bank Transfer
  const proofUpload = document.getElementById("proofUpload");
  proofUpload.style.display = (selected === "gcash" || selected === "paymaya" || selected === "bank") ? "block" : "none";
});

// Handle Form Submission
function submitOrder() {
  const name = document.getElementById("fullName").value;
  const address = document.getElementById("address").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const method = document.querySelector("input[name='paymentMethod']:checked").value;
  const termsChecked = document.getElementById("agreeTerms").checked;

  // Check if all fields are filled
  if (!name || !address || !email || !phone || !method) {
      alert("Please fill out all fields.");
      return;
  }

  // Check if the terms are agreed to
  if (!termsChecked) {
      alert("Please confirm that you agree to the terms and conditions.");
      return;
  }

  // Check for proof of payment if GCash or PayMaya is selected
  if ((method === "gcash" || method === "paymaya") && !document.getElementById("screenshot").files.length) {
      alert("Please upload proof of payment.");
      return;
  }

  // Example of retrieving cart details (for use in the checkout page or another part of the flow)
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  const totalPrice = localStorage.getItem("totalPrice");

  // If no items in the cart, prompt user
  if (!cartItems || cartItems.length === 0) {
      alert("No items in the cart.");
      return;
  }

  // Display the payment summary
  let paymentSummary = `
      <p><strong>Order Summary</strong></p>
      <p><strong>Total Price:</strong> ₱${totalPrice}</p>
      <p><strong>Payment Method:</strong> ${method}</p>
  `;

  // Inject the payment summary into the page
  document.getElementById("payment-summary").innerHTML = paymentSummary;

  // Show confirmation
  alert(`Thanks ${name}! Your order is placed via ${method.toUpperCase()}.`);

  // Store the order details in localStorage or send to backend (not implemented in this example)
  localStorage.setItem("orderDetails", JSON.stringify({
      name: name,
      address: address,
      email: email,
      phone: phone,
      paymentMethod: method,
      cartItems: cartItems,
      totalPrice: totalPrice
  }));

  // Redirect to success or payment cancellation page
  window.location.href = "success.html"; // Redirect to success page
}

// Handle Payment Cancellation
function cancelOrder() {
  // Redirect to the cancellation page if user cancels the payment
  window.location.href = "cancel.html"; // Redirect to cancellation page
}

// Add event listener for the cancel button (Assuming you have a cancel button with ID "cancel-btn")
document.getElementById("cancel-btn").addEventListener("click", cancelOrder);

// Example of retrieving cart details (for use in the checkout page or another part of the flow)
const cartItems = JSON.parse(localStorage.getItem("cartItems"));
const totalPrice = localStorage.getItem("totalPrice");

// Display cart items and total in the console (or use them in your checkout process)
console.log(cartItems);
console.log(totalPrice);
