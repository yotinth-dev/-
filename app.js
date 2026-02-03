const today = new Date().toISOString().slice(0, 10);
document.getElementById("today").innerText =
  new Date().toLocaleDateString("th-TH");

let receipts = JSON.parse(localStorage.getItem(today)) || [];

function addReceipt() {
  const file = document.getElementById("imageInput").files[0];
  if (!file) return alert("กรุณาเลือกภาพบิล");

  Tesseract.recognize(file, "tha+eng").then(({ data }) => {
    const text = data.text;
    const total = extractTotal(text);

    receipts.push({
      time: new Date().toLocaleTimeString("th-TH"),
      total: total,
      text: text
    });

    localStorage.setItem(today, JSON.stringify(receipts));
    render();
  });
}

function extractTotal(text) {
  const match = text.match(/(\d+[.,]\d{2})/g);
  if (!match) return 0;
  return parseFloat(match.pop().replace(",", ""));
}

function render() {
  const list = document.getElementById("receiptList");
  list.innerHTML = "";

  let sum = 0;

  receipts.forEach(r => {
    sum += r.total;
    list.innerHTML += `
      <div class="card">
        <div>🧾 ${r.time}</div>
        <div>${r.total.toFixed(2)} ฿</div>
      </div>
    `;
  });

  document.getElementById("total").innerText =
    sum.toFixed(2) + " บาท";
}

render();
