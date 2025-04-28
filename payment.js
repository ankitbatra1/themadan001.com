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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let selectedAmount = 0;

// Update amount on course change
function updateAmount() {
  const course = document.getElementById('course').value;
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

// Submit Details Button
document.getElementById('submitDetailsButton').addEventListener('click', async function () {
  const btn = document.getElementById('submitDetailsButton');

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
  document.getElementById('loadingSpinner').style.display = 'block';

  try {
    const docRef = db.collection("registrations").doc(collegeId);
    const doc = await docRef.get();

    if (doc.exists) {
      const data = doc.data();
      if (data && data.paymentStatus === "paid") {
        showPopup("You have already registered and paid. Please contact support if needed.");
        btn.innerText = "Already Registered";
        btn.disabled = true;
        document.getElementById('loadingSpinner').style.display = 'none';
        return;
      }
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

    showPopup("Details submitted successfully! Please proceed to payment.");

    // Hide the submit button and show Razorpay
    btn.style.display = 'none';
    document.getElementById('loadingSpinner').style.display = 'none';

    if (course === 'webdev') {
      document.getElementById('webdevButton').style.display = 'block';
    } else if (course === 'appdev') {
      document.getElementById('appdevButton').style.display = 'block';
    }

  } catch (error) {
    console.error(error);
    showPopup("Error saving details. Please try again.");
    btn.innerText = "Submit Details";
    btn.disabled = false;
    document.getElementById('loadingSpinner').style.display = 'none';
  }
});

// Nice Popup
function showPopup(message) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  const popup = document.createElement('div');
  popup.className = 'popup-box';
  popup.innerText = message;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('show');
  }, 100);

  setTimeout(() => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 300);
  }, 2000);
}
