(function () {
  const maxPoints = 8;
  const points = [];

  window.addEventListener("mousemove", (e) => {
    const ponto = document.createElement("div");
    ponto.className = "ponto";
    ponto.style.left = `${e.pageX - 5}px`;
    ponto.style.top = `${e.pageY - 8}px`;
    document.body.appendChild(ponto);
    points.push(ponto);

    if (points.length > maxPoints) {
      const oldPoint = points.shift();
      document.body.removeChild(oldPoint);
    }
  });
})();
