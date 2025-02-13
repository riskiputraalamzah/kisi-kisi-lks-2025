document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("line-chart");
  const ctx = canvas.getContext("2d");

  // Dummy data
  const data = [10, 20, 15, 25, 30, 35, 40, 45, 50, 55];
  const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
  ];

  // Chart dimensions
  const chartWidth = canvas.width - 100;
  const chartHeight = canvas.height - 100;
  const chartX = 50;
  const chartY = 50;

  // Draw axes
  ctx.beginPath();
  ctx.moveTo(chartX, chartY);
  ctx.lineTo(chartX, chartY + chartHeight);
  ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
  ctx.stroke();

  // Draw labels
  ctx.font = "12px Arial";
  ctx.textAlign = "center";
  labels.forEach((label, index) => {
    const x = chartX + (index * chartWidth) / (labels.length - 1);
    const y = chartY + chartHeight + 20;
    ctx.fillText(label, x, y);
  });

  ctx.textAlign = "right";
  data.forEach((value, index) => {
    const x = chartX - 10;
    const y = chartY + chartHeight - (index * chartHeight) / (data.length - 1);
    ctx.fillText(value, x, y);
  });

  // Draw line
  ctx.beginPath();
  ctx.strokeStyle = "red"; // Set line color to red
  data.forEach((value, index) => {
    const x = chartX + (index * chartWidth) / (data.length - 1);
    const y = chartY + chartHeight - (value * chartHeight) / Math.max(...data);
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
});
