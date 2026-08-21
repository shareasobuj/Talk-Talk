import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

window.switchTab = function(tab) {
  const loginForm = document.getElementById('loginForm');
  const regForm = document.getElementById('registerForm');
  const loginBtn = document.getElementById('loginTabBtn');
  const regBtn = document.getElementById('registerTabBtn');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
    loginBtn.classList.add('active');
    regBtn.classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
    loginBtn.classList.remove('active');
    regBtn.classList.add('active');
  }
};

// Handle Registration
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const phone = document.getElementById('regPhone').value.trim();
  const pin = document.getElementById('regPin').value;

  const userRef = doc(db, "users", phone);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    alert('এই নম্বরে ইতিমধ্যে একটি অ্যাকাউন্ট খোলা রয়েছে!');
  } else {
    await setDoc(userRef, {
      name: name,
      pin: pin,
      balance: 0,
      internetMB: 0,
      minutes: 0,
      sms: 0
    });
    localStorage.setItem('activeTalkTalkUser', phone);
    alert('রেজিস্ট্রেশন সফল হয়েছে!');
    window.location.href = 'index.html';
  }
});

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const phone = document.getElementById('loginPhone').value.trim();
  const pin = document.getElementById('loginPin').value;

  const userRef = doc(db, "users", phone);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    const data = userSnap.data();
    if (data.pin === pin) {
      localStorage.setItem('activeTalkTalkUser', phone);
      alert('লগইন সফল হয়েছে!');
      window.location.href = 'index.html';
    } else {
      alert('ভুল পিন নম্বর দিয়েছেন!');
    }
  } else {
    alert('এই নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি! আগে রেজিস্ট্রেশন করুন।');
  }
});
