import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEwjNAzT6WlflPZO1-FWT93aC9-9sE8ps",
  authDomain: "talktalk-ccff1.firebaseapp.com",
  projectId: "talktalk-ccff1",
  storageBucket: "talktalk-ccff1.firebasestorage.app",
  messagingSenderId: "918217516258",
  appId: "1:918217516258:web:c06d08073b22c1cc726abb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// অটোমেটিক অফার কন্টেইনার খুঁজে বের করার লজিক
window.addEventListener('DOMContentLoaded', () => {
  // স্পেশাল অফার সেকশন টার্গেট করা
  const offerSection = document.querySelector('.special-offers, .offers-list, div:has(> .offer-card)') || document.querySelectorAll('div')[document.querySelectorAll('div').length - 1];

  onSnapshot(collection(db, "special_offers"), (snapshot) => {
    if (snapshot.empty) return;

    // ডাটাবেজ থেকে অফার এলে আগের ডায়নামিক লিস্ট রিফ্রেশ করা
    let dynamicHTML = '';
    snapshot.forEach(docSnap => {
      const offer = docSnap.data();
      dynamicHTML += `
        <div style="background:#fff; padding:15px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 6px rgba(0,0,0,0.05); border-left:4px solid #ff416c;">
          <div>
            <h4 style="margin:0; font-size:15px; color:#222; font-weight:bold;">${offer.title}</h4>
            <p style="margin:4px 0 0; font-size:12px; color:#666;">মেয়াদ: ${offer.validity}</p>
          </div>
          <button style="background:#ff416c; color:#fff; border:none; padding:8px 16px; border-radius:20px; font-weight:bold; cursor:pointer;">৳ ${offer.price}</button>
        </div>
      `;
    });

    // সরাসরি অ্যাপের স্পেশাল অফার সেকশনের ওপরে যুক্ত করে দেওয়া
    const existingOffers = document.getElementById('dynamicOffersList');
    if (existingOffers) {
      existingOffers.innerHTML = dynamicHTML;
    } else {
      const newDiv = document.createElement('div');
      newDiv.id = 'dynamicOffersList';
      newDiv.innerHTML = dynamicHTML;
      document.body.appendChild(newDiv);
    }
  });
});
