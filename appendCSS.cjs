const fs = require('fs');
const css = `
.bestsellers-marquee-viewport {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 10px 0;
}

.bestsellers-marquee-track {
  display: flex;
  width: max-content;
  animation: bestsellersMarqueeLoop 30s linear infinite;
}

.bestsellers-marquee-track:hover {
  animation-play-state: paused;
}

.bestsellers-marquee-group {
  display: flex;
  gap: 32px;
  padding-right: 32px;
}

@keyframes bestsellersMarqueeLoop {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
`;
fs.appendFileSync('src/pages/Home/Home.module.css', css);
