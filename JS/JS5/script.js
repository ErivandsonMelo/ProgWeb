document.getElementById("drawGraph").onclick = function() {
    const heightsInput = document.getElementById("heights").value;
    const barWidth = parseInt(document.getElementById("width").value);
    const graphContainer = document.getElementById("graphContainer");

    graphContainer.innerHTML = '';

    const heights = heightsInput.split(',').map(Number);

    heights.forEach(height => {
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = height + "px";
        bar.style.width = barWidth + "px";
        graphContainer.appendChild(bar);
    });
};
