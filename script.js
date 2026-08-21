import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAEwjNAzT6WlflPZO1-FWT93aC9-9sE8ps",
  authDomain: "talktalk-ccff1.firebaseapp.com",
  projectId: "talktalk-ccff1",
  storageBucket: "talktalk-ccff1.firebasestorage.app",
  messagingSenderId: "918217516258",
  appId: "1:918217516258:web:c06d08073b22c1cc726abb",
  measurementId: "G-G02XE68K8R"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userId = "01300-123456"; 
let userData = { balance: 0, internetMB: 0, minutes: 0, sms: 0 };

const packs = [
  { id: 1, type: 'internet', title: '3 GB ইন্টারনেট', validity: '7 দিন', price: 69, mb: 3072, mins: 0 },
  { id: 2, type: 'internet', title: '10 GB ইন্টারনেট', validity: '30 দিন', price: 199, mb: 10240, mins: 0 },
  { id: 3, type: 'minute', title: '100 মিনিট', validity: '7 দিন', price: 64, mb: 0, mins: 100 },
  { id: 4, type: 'minute', title: '300 মিনিট', validity: '30 দিন', price: 187, mb: 0, mins: 300 },
  { id: 5, type: 'bundle', title: '15 GB + 300 মিনিট', validity: '30 দিন', price: 349, mb: 15360, mins: 300 }
];

// Realtime Sync with Cloud Database
onSnapshot(doc(db, "users", userId), (docSnap) => {
  if (docSnap.exists()) {
    userData = docSnap.data();
    updateUI();
  }
});

function updateUI() {
  document.getElementById('balanceVal').innerText = `৳ ${(userData.balance || 0).toFixed(2)}`;
  const mb = userData.internetMB || 0;
  document.getElementById('internetVal').innerText = mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`;
  document.getElementById('minuteVal').innerText = `${userData.minutes || 0} Min`;
  document.getElementById('smsVal').innerText = `${userData.sms || 0} SMS`;
}

function renderPacks(list) {
  const container = document.getElementById('packContainer');
  container.innerHTML = '';
  list.forEach(pack => {
    container.innerHTML += `
      <div class="pack-card">
        <div>
          <h4>${pack.title}</h4>
          <small style="color:#666;">মেয়াদ: ${pack.validity}</small>
        </div>
        <button class="buy-btn" id="btn-${pack.id}">৳ ${pack.price}</button>
      </div>
    `;
  });

  list.forEach(pack => {
    document.getElementById(`btn-${pack.id}`)?.addEventListener('click', () => buyPack(pack));
  });
}

async function buyPack(pack) {
  if (userData.balance >= pack.price) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      balance: userData.balance - pack.price,
      internetMB: (userData.internetMB || 0) + pack.mb,
      minutes: (userData.minutes || 0) + pack.mins
    });
    alert(`সফল হয়েছে! আপনি ${pack.title} কিনেছেন।`);
  } else {
    alert('পর্যাপ্ত ব্যালেন্স নেই! রিচার্জ করুন।');
    window.openModal();
  }
}

window.filterPacks = function(category, btn = null) {
  if (btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  renderPacks(category === 'all' ? packs : packs.filter(p => p.type === category));
};

window.openModal = function() { document.getElementById('rechargeModal').style.display = 'flex'; };
window.closeModal = function() { document.getElementById('rechargeModal').style.display = 'none'; };

window.processRecharge = async function() {
  const amount = parseFloat(document.getElementById('rechargeAmount').value);
  if (isNaN(amount) || amount < 10) {
    alert('সর্বনিম্ন ১০ টাকা রিচার্জ করুন!');
    return;
  }
  await addDoc(collection(db, "requests"), {
    phone: userId,
    amount: amount,
    status: "pending",
    time: new Date().toLocaleString()
  });
  document.getElementById('rechargeAmount').value = '';
  window.closeModal();
  alert('রিচার্জের অনুরোধ এডমিনের কাছে পাঠানো হয়েছে!');
};

renderPacks(packs);
