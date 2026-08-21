import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEwjNAzT6WlflPZO1-FWT93aC9-9sE8ps",
  authDomain: "talktalk-ccff1.firebaseapp.com",
  projectId: "talktalk-ccff1",
  storageBucket: "talktalk-ccff1.firebasestorage.app",
  messagingSenderId: "918217516258",
  appId: "1:918217516258:web:c06d08073b22c1cc726abb"
};

const app = initializeApp(firebaseConfig, "offersAppFixNew");
const db = getFirestore(app);

async function fetchOffers() {
  const container = document.getElementById('packContainer');
  if (!container) return;

  try {
    const querySnapshot = await getDocs(collection(db, "special_offers"));
    
    if (querySnapshot.empty) {
      container.innerHTML = '<p style="text-align:center; padding:15px; color:#888;">কোনো অফার পাওয়া যায়নি</p>';
      return;
    }

    container.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const offer = doc.data();
      container.innerHTML += `
        <div style="background:#fff; padding:15px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.08); font-family:sans-serif;">
          <div>
            <h4 style="margin:0; font-size:16px; color:#222; font-weight:bold;">${offer.title}</h4>
            <p style="margin:4px 0 0; font-size:12px; color:#666;">মেয়াদ: ${offer.validity}</p>
          </div>
          <button style="background:#ff416c; color:#fff; border:none; padding:8px 18px; border-radius:20px; font-weight:bold; cursor:pointer; font-size:14px;">৳ ${offer.price}</button>
        </div>
      `;
    });
  } catch (error) {
    container.innerHTML = '<p style="color:red; text-align:center;">অফার লোড করতে সমস্যা হয়েছে</p>';
  }
}

fetchOffers();
