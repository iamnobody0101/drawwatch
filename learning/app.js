const draws = [
    { game: "Lotto 6/49", date: "2026-01-07", numbers: [3, 12, 19, 27, 33, 41], bonus: 8 },
    { game: "Lotto Max", date: "2026-01-09", numbers: [2, 9, 17, 24, 31, 38, 45], bonus: 11 },
    { game: "Lotto 6/49", date: "2026-01-03", numbers: [5, 14, 22, 28, 36, 47], bonus: 19},
];

const select = document.getElementById("game");
const container = document.getElementById("draws");

function render() {
    const chosen = select.value;
    const shown = chosen === "all" ? draws : draws.filter((d) => d.game === chosen);

    container.innerHTML = shown.map(
        (d) => `
        <section>
            <h3>${d.game}</h3>
            <p>Date: ${d.date}</p>
            <ul>${d.numbers.map((n) => `<li>${n}</li>`).join("")}</ul>
            <p>Bonus number: ${d.bonus}</p>
        </section>`
    ).join("");
}

select.addEventListener("change", render);
render();