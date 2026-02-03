function extractTotal(text) {
  const keywords = [
    "รวม", "รวมเงิน", "รวมทั้งสิ้น", "ยอดรวม",
    "total", "amount", "grand total"
  ];

  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // 🥇 1) หาคำว่า "รวม"
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (keywords.some(k => lower.includes(k))) {
      const match = line.match(/(\d{1,3}(?:,\d{3})*\.\d{2})/);
      if (match) {
        return parseFloat(match[1].replace(/,/g, ""));
      }
    }
  }

  // 🥈 2) ดูเลขในช่วงท้ายบิล (3–5 บรรทัดสุดท้าย)
  const tailLines = lines.slice(-5);
  const tailNumbers = tailLines
    .flatMap(l => l.match(/\d{1,3}(?:,\d{3})*\.\d{2}/g) || [])
    .map(n => parseFloat(n.replace(/,/g, "")))
    .filter(n => n >= 1);

  if (tailNumbers.length === 1) {
    return tailNumbers[0];
  }

  // 🥉 3) fallback: รวมเลขที่ "สมเหตุสมผล"
  const allNumbers = lines
    .flatMap(l => l.match(/\d{1,3}(?:,\d{3})*\.\d{2}/g) || [])
    .map(n => parseFloat(n.replace(/,/g, "")))
    .filter(n => n >= 1 && n < 100000); // กันเลขมั่ว

  if (allNumbers.length > 1) {
    const sum = allNumbers.reduce((a, b) => a + b, 0);
    return parseFloat(sum.toFixed(2));
  }

  return allNumbers[0] || 0;
}
