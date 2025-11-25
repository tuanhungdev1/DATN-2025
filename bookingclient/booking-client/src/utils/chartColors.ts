// utils/chartColors.ts
export const chartColors = {
  primary: "rgba(54, 162, 235, 0.6)",
  success: "rgba(75, 192, 192, 0.6)",
  warning: "rgba(255, 206, 86, 0.6)",
  error: "rgba(255, 99, 132, 0.6)",
  info: "rgba(153, 102, 255, 0.6)",
  secondary: "rgba(255, 159, 64, 0.6)",
};

export const chartColorsBorder = {
  primary: "rgb(54, 162, 235)",
  success: "rgb(75, 192, 192)",
  warning: "rgb(255, 206, 86)",
  error: "rgb(255, 99, 132)",
  info: "rgb(153, 102, 255)",
  secondary: "rgb(255, 159, 64)",
};

export const getRandomColor = () => {
  const colors = Object.values(chartColors);
  return colors[Math.floor(Math.random() * colors.length)];
};
