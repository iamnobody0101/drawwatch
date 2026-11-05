const select = document.getElementById("game")
const container = document.getElementById("draws")
let draws = [];

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

async function loadDraws() {
    container.textContent = "Loading draws...";
    try {
        const response = await fetch("draws.json");
        if (!response.ok) {
            throw new Error("Server answered " + response.status);
        }
        draws = await response.json();
        render();
    } catch (error) {
        container.textContent = "Sorry, the draws could not be loaded. Please try again later.";
        console.error(error);
    }
}

select.addEventListener("change", render);
loadDraws();