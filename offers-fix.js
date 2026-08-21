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

const app = initializeApp(firebaseConfig, "offersAppFix");
const db = getFirestore(app);

// অটোমেটিক পুরনো অফার সরিয়ে ফায়ারবেসের অফার বসানোর লজিক
window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('packContainer') || document.querySelector('.pack-list');
  
  if (container) {
    onSnapshot(collection(db, "special_offers"), (snapshot) => {
      if (!snapshot.empty) {
        container.innerHTML = '';
        snapshot.forEach(docSnap => {
          const offer = docSnap.data();
          container.innerHTML += `
            <div class="pack-card" style="background:#fff; padding:15px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
              <div>
                <h4 style="margin:0; font-size:16px; color:#222; font-weight:bold;">${offer.title}</h4>
                <p style="margin:4px 0 0; font-size:12px; color:#666;">মেয়াদ: ${offer.validity}</p>
              </div>
              <button style="background:#ff416c; color:#fff; border:none; padding:8px 18px; border-radius:20px; font-weight:bold; cursor:pointer; font-size:14px;">৳ ${offer.price}</button>
            </div>
          `;
        });
      }
    });
  }
});
