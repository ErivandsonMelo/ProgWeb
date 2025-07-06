document.getElementById("calculate").onclick = function() {
    const radiusInput = document.getElementById("radius").value;
    const radius = parseFloat(radiusInput);

    if (isNaN(radius) || radius < 0) {
        alert("Por favor, informe um valor de raio válido (um número positivo).");
        document.getElementById("resultArea").textContent = '';
        document.getElementById("resultCircumference").textContent = '';
        return;
    }

    const pi = Math.PI;
    const area = pi * radius * radius;
    const circumference = 2 * pi * radius;

    document.getElementById("resultArea").textContent = area.toFixed(2);
    document.getElementById("resultCircumference").textContent = circumference.toFixed(2);
};
