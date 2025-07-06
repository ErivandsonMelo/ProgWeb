document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;

  for (let i = 1; i <= 10; i++) {
    const tableContainer = document.createElement("div");
    tableContainer.classList.add("table-container");

    const tableTitle = document.createElement("div");
    tableTitle.classList.add("table-title");
    tableTitle.innerText = `Tabela de Multiplicação por ${i}`;
    tableContainer.appendChild(tableTitle);

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const headerRow = document.createElement("tr");
    const th1 = document.createElement("th");
    th1.innerText = "Multiplicando";
    headerRow.appendChild(th1);
    const th2 = document.createElement("th");
    th2.innerText = "Resultado";
    headerRow.appendChild(th2);
    thead.appendChild(headerRow);

    for (let j = 1; j <= 10; j++) {
      const row = document.createElement("tr");
      const cell1 = document.createElement("td");
      cell1.innerText = `${i} x ${j}`;
      const cell2 = document.createElement("td");
      cell2.innerText = i * j;
      row.appendChild(cell1);
      row.appendChild(cell2);
      tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
    body.appendChild(tableContainer);
  }
});
