document.addEventListener('DOMContentLoaded', () => {
  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyBrxscIdG0FESLbsMNyj1N_Og2iTf8CjRw",
    authDomain: "training-at-madan.firebaseapp.com",
    projectId: "training-at-madan",
    storageBucket: "training-at-madan.appspot.com",
    messagingSenderId: "18245722256",
    appId: "1:18245722256:web:b6dfb300c7780d99ef3815",
    measurementId: "G-HWS0BWD7NF"
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  let selectedAmount = 0;

  // Function to update amount
  function updateAmount() {
    const course = document.getElementById('course').value;
    console.log("course selected:", course);
    const amountDiv = document.getElementById('amount');

    if (course === 'webdev') {
      selectedAmount = 2999;
      amountDiv.innerText = 'Total: ₹2999';
    } else if (course === 'appdev') {
      selectedAmount = 4499;
      amountDiv.innerText = 'Total: ₹4499';
    } else {
      selectedAmount = 0;
      amountDiv.innerText = 'Total: ₹0';
    }
  }

  document.getElementById('course').addEventListener('change', updateAmount);
  updateAmount(); // To initialize on page load

  // Show popup
  function showPopup(message) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';

    const popup = document.createElement('div');
    popup.className = 'popup-box';
    popup.innerText = message;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    setTimeout(() => overlay.classList.add('show'), 100);
    setTimeout(() => {
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 300);
    }, 2000);
  }

  // Handle submit
  document.getElementById('submitDetailsButton').addEventListener('click', async function () {
    const btn = document.getElementById('submitDetailsButton');
    const spinner = document.getElementById('loadingSpinner');
    const razorpayForm = document.getElementById('razorpayForm');
    const buttonsContainer = document.getElementById('razorpayButtonsContainer');

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const college = document.getElementById('college').value.trim();
    const collegeId = document.getElementById('collegeId').value.trim();
    const course = document.getElementById('course').value;

    if (!name || !email || !mobile || !college || !collegeId || !course) {
      showPopup("Please fill all fields.");
      return;
    }

    if (!selectedAmount) {
      showPopup("Please select a valid course.");
      return;
    }

    btn.disabled = true;
    btn.innerText = "Checking...";
    spinner.style.display = 'block';

    try {
      const docRef = db.collection("registrations").doc(collegeId);
      const doc = await docRef.get();

      if (doc.exists && doc.data().paymentStatus === "paid") {
        showPopup("You have already registered and paid.");
        btn.innerText = "Already Registered";
        btn.disabled = true;
        spinner.style.display = 'none';
        return;
      }

      // Save details
      await docRef.set({
        name,
        email,
        mobile,
        college,
        collegeId,
        course,
        amount: selectedAmount,
        paymentStatus: "pending",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      console.log("Registration data saved to Firestore.");
      showPopup("Details submitted successfully! Please proceed to payment.");

      btn.style.display = 'none';
      spinner.style.display = 'none';

      // Razorpay
      razorpayForm.innerHTML = '';
      const script = document.createElement('script');
      script.src = "https://checkout.razorpay.com/v1/payment-button.js";
      script.setAttribute('data-payment_button_id', course === 'webdev' ? 'pl_QOMkVHtkD9nb1k' : 'pl_QOMsqjh5BjBHjt');
      script.async = true;
      razorpayForm.appendChild(script);

      buttonsContainer.style.display = 'block';
      razorpayForm.style.display = 'block';

    } catch (error) {
      console.error(error);
      showPopup("Error saving details. Please try again.");
      btn.innerText = "Submit Details";
      btn.disabled = false;
      spinner.style.display = 'none';
    }
  });
});
