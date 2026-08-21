// LocalStorage Persistence - রিফ্রেশ দিলেও ডাটা সেভ থাকবে
const appState = JSON.parse(localStorage.getItem('talktalk_user')) || {
  balance: 125.50,
  internetMB: 2560,
  minutes: 85,
  sms: 50
};

const packs = [
  { id: 1, type: 'internet', title: '3 GB ইন্টারনেট', validity: '7 দিন', price: 69, mb: 3072, mins: 0 },
  { id: 2, type: 'internet', title: '10 GB ইন্টারনেট', validity: '30 দিন', price: 199, mb: 10240, mins: 0 },
  { id: 3, type: 'minute', title: '100 মিনিট', validity: '7 দিন', price: 64, mb: 0, mins: 100 },
  { id: 4, type: 'minute', title: '300 মিনিট', validity: '30 দিন', price: 187, mb: 0, mins: 300 },
  { id: 5, type: 'bundle', title: '15 GB + 300 মিনিট', validity: '30 দিন', price: 349, mb: 15360, mins: 300 }
];

document.addEventListener('DOMContentLoaded', () => {
  updateUI();
  renderPacks(packs);
});

function saveState() {
  localStorage.setItem('talktalk_user', JSON.stringify(appState));
  updateUI();
}

function updateUI() {
  document.getElementById('balanceVal').innerText = `৳ ${appState.balance.toFixed(2)}`;
  
  const mb = appState.internetMB;
  document.getElementById('internetVal').innerText = mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`;
  document.getElementById('minuteVal').innerText = `${appState.minutes} Min`;
  document.getElementById('smsVal').innerText = `${appState.sms} SMS`;
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
        <button class="buy-btn" onclick="buyPack(${pack.id})">৳ ${pack.price}</button>
      </div>
    `;
  });
}

function filterPacks(category, btn = null) {
  if (btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  if (category === 'all') {
    renderPacks(packs);
  } else {
    renderPacks(packs.filter(p => p.type === category));
  }
}

function buyPack(id) {
  const pack = packs.find(p => p.id === id);
  if (appState.balance >= pack.price) {
    appState.balance -= pack.price;
    appState.internetMB += pack.mb;
    appState.minutes += pack.mins;
    saveState();
    alert(`সফল হয়েছে! আপনি ${pack.title} কিনেছেন।`);
  } else {
    alert('পর্যাপ্ত ব্যালেন্স নেই! রিচার্জ করুন।');
    openModal();
  }
}

function getLoan() {
  if (confirm('৳ ২৫ টাকা ইমার্জেন্সি ব্যালেন্স নিতে চান?')) {
    appState.balance += 25;
    saveState();
    alert('৳ ২৫ টাকা যোগ করা হয়েছে।');
  }
}

function openModal() { document.getElementById('rechargeModal').style.display = 'flex'; }
function closeModal() { document.getElementById('rechargeModal').style.display = 'none'; }

function processRecharge() {
  const amount = parseFloat(document.getElementById('rechargeAmount').value);
  if (isNaN(amount) || amount < 10) {
    alert('সর্বনিম্ন ১০ টাকা রিচার্জ করুন!');
    return;
  }
  appState.balance += amount;
  saveState();
  document.getElementById('rechargeAmount').value = '';
  closeModal();
  alert(`৳ ${amount} টাকা রিচার্জ সম্পন্ন হয়েছে!`);
      }
