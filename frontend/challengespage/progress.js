const progress = 65;

const circle = document.querySelector(".progress");

const radius = 70;
const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;

circle.style.strokeDashoffset =
    circumference - (progress / 100) * circumference;