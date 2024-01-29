console.log("It is working");

const adviceId = document.querySelector(".id");
const advice = document.querySelector(".advice");
const button = document.querySelector(".btn");

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function setWordBreak(value) {
    advice.style.wordBreak = value;
}

function scrambledText(data) {
    setWordBreak("break-all");
    let iterations = 0;

    const interval = setInterval(() => {
        advice.textContent = data.split("")
            .map((letter, index) => {
                if (index < iterations) {
                    return advice.dataset.value[index];
                }
                return letters[Math.floor(Math.random() * 26)];
            })
            .join("");

        if (iterations >= data.length) {
            clearInterval(interval);
            setWordBreak("normal"); // Restore the original word-break setting
        }

        iterations += 3;
    }, 50);
}

async function fetchAdvice() {
    button.classList.add("rotate");

    try {
        const response = await fetch("https://api.adviceslip.com/advice");
        const data = await response.json();

        if (response.ok) {
            adviceId.textContent = data.slip.id;
            advice.dataset.value = data.slip.advice;

            scrambledText(data.slip.advice);
            button.classList.remove("rotate");
        } else {
            adviceId.textContent = "undefined";
            advice.textContent = "An error occurred";
        }
    } catch (error) {
        button.classList.remove("rotate");
        if (!navigator.onLine || error instanceof TypeError) {
            adviceId.textContent = "...";
            advice.textContent = "Network error: You are offline or the server is unreachable";
            console.error("Network error: You are offline or the server is unreachable.");
        } else {
            console.error("An error occurred:", error.message);
        }
    }
}

fetchAdvice();

button.addEventListener("click", fetchAdvice);
