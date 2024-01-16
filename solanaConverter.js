async function queryApi() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "solana",
          vs_currencies: "usd",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return null;
  }
}

async function convertSolToDollars(value) {
  try {
    const response = await queryApi();
    const solToUsdRate = response.data.solana.usd;

    const dollarsValue = value * solToUsdRate;

    return dollarsValue;
  } catch (error) {
    console.error("Error converting sol to dollars:", error);
    return null;
  }
}

async function convertDollarsToSol(value) {
  try {
    const response = await queryApi();
    const solToUsdRate = response.data.solana.usd;

    const solValue = value / solToUsdRate;

    return solValue;
  } catch (error) {
    console.error("Error converting sol to dollars:", error);
    return null;
  }
}

function removeCurrencyAndNonNumeric(inputString) {
  // Use a regular expression to match numbers (including negative) and decimal points
  const pattern = /[-+]?([0-9]*\.[0-9]+|[0-9]+)/g;

  const cleanedArray = inputString.match(pattern);
  const cleanedString = cleanedArray ? cleanedArray.join("") : "";

  return cleanedString;
}

let sol = document.getElementById("sol-input");
let dollars = document.getElementById("usd-input");

function convertSolToUsd() {
  let solValue = removeCurrencyAndNonNumeric(sol.value);
  if (!solValue) {
    sol.focus();
    return;
  }
  convertSolToDollars(solValue).then((dollar) => {
    dollars.value = dollar.toFixed(2);
  });
}
sol.addEventListener("input", convertSolToUsd);

function convertUsdToSol() {
  let dollarsValue = removeCurrencyAndNonNumeric(dollars.value);
  if (!dollarsValue) {
    dollars.focus();
    return;
  }
  convertDollarsToSol(dollarsValue).then((solana) => {
    sol.value = solana.toFixed(4);
  });
}
dollars.addEventListener("input", convertUsdToSol);

function isMobileDevice() {
  return window.innerWidth < 768;
}

const arrows = document.getElementById("arrows");
let isClicked = false;
if (isMobileDevice()) {
  arrows.innerHTML = `<i class="fa-solid fa-arrows-up-down"></i>`;
  const mobileDropdowns = document.querySelectorAll(".mobile-dropdown");
  mobileDropdowns.forEach(function (dropdown) {
    const trigger = dropdown.querySelector("a");
    const menu = dropdown.querySelector(".mobile-dropdown-menu");

    trigger.addEventListener("click", function (event) {
      event.preventDefault();

      if (isClicked) {
        menu.style.display = "none";
      } else {
        menu.style.display = "block";
      }

      isClicked = !isClicked;
    });
  });
} else {
  arrows.innerHTML = `<i class="fa-solid fa-arrow-right-arrow-left"></i>`;
}

window.addEventListener("DOMContentLoaded", convertSolToUsd);
document.getElementById("convert-button").addEventListener("click", () => {
  if (sol.value) {
    convertSolToUsd();
  } else if (dollars.value) {
    convertUsdToSol();
  } else {
    alert("Enter Solana or Dollars to convert");
  }
});
