function extractTotal(text) {
  // 1️⃣ มองหาคำที่สื่อว่าเป็นยอดรวม
  const keywords = [
    "รวม", "รวมเงิน", "รวมทั้งสิ้น", "ยอดรวม",
    "total", "amount", "grand total"
  ];

  const lines = text.split("\n");

  for (const line of lines) {
    const lower = line.toLowerCase();

    if (keywords.some(k => lower.includes(k))) {
      const match = line.match(/(\d+[.,]\d{2})/);
      if (match) {
        return parseFloat(match[1].replace(",", ""));
      }
    }
  }

  // 2️⃣ ถ้าไม่เจอคำ → เลือก "ตัวเลขที่มากที่สุด"
  const matches = text.match(/\d+[.,]\d{2}/g);
  if (!matches) return 0;

  const numbers = matches
    .map(n => parseFloat(n.replace(",", "")))
    .filter(n => n >= 1); // ตัดเศษเล็ก ๆ

  return Math.max(...numbers);
}
