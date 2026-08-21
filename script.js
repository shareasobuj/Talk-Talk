import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, collection } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase Config
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

const userId = "01300-123456";

// 1. Fetch User Data (Balance, Minutes, MB, SMS)
const userRef = doc(db, "users", userId);
onSnapshot(userRef, (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    
    const balEl = document.getElementById('mainBalance');
    if(balEl) balEl.innerText = `৳ ${(data.balance || 0).toFixed(2)}`;
    
    const mbEl = document.getElementById('internetMB');
    if(mbEl) {
      const mb = data.internetMB || 0;
      mbEl.innerText = mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`;
    }

    const minEl = document.getElementById('minutes');
    if(minEl) minEl.innerText = `${data.minutes || 0} Min`;

    const smsEl = document.getElementById('sms');
    if(smsEl) smsEl.innerText = `${data.sms || 0} SMS`;
  }
});

// 2. Fetch Live Offers from Firebase
const packContainer = document.getElementById('packContainer');

if (packContainer) {
  onSnapshot(collection(db, "special_offers"), (snapshot) => {
    packContainer.innerHTML = '';
    if (snapshot.empty) {
      packContainer.innerHTML = '<p style="text-align:center; padding:15px; color:#888;">কোনো স্পেশাল অফার পাওয়া যায়নি</p>';
      return;
    }

    snapshot.forEach(docSnap => {
      const offer = docSnap.data();
      packContainer.innerHTML += `
        <div class="pack-card" style="background:#fff; padding:15px; border-radius:12px; margin-bottom:10px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 8px rgba(0,0,0,0.05);">
          <div>
            <h4 style="margin:0; font-size:16px; color:#222; font-weight:bold;">${offer.title}</h4>
            <p style="margin:4px 0 0; font-size:12px; color:#666;">মেয়াদ: ${offer.validity}</p>
          </div>
          <button style="background:#ff416c; color:#fff; border:none; padding:8px 18px; border-radius:20px; font-weight:bold; cursor:pointer; font-size:14px;">৳ ${offer.price}</button>
        </div>
      `;
    });
  });
}

// Modal Toggle Logic
window.openModal = function() {
  const modal = document.getElementById('rechargeModal');
  if(modal) modal.style.display = 'flex';
};

window.closeModal = function() {
  const modal = document.getElementById('rechargeModal');
  if(modal) modal.style.display = 'none';
};
