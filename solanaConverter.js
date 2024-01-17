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

async function convertCryptoToDollars(value) {
  try {
    const response = await queryApi();
    const cryptoToUsdRate = response.data.solana.usd;

    const dollarsValue = value * cryptoToUsdRate;

    return dollarsValue;
  } catch (error) {
    console.error("Error converting crypto to dollars:", error);
    return null;
  }
}

async function convertDollarsToCrypto(value) {
  try {
    const response = await queryApi();
    const cryptoToUsdRate = response.data.solana.usd;

    const cryptoValue = value / cryptoToUsdRate;

    return cryptoValue;
  } catch (error) {
    console.error("Error converting crypto to dollars:", error);
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

let crypto = document.getElementById("crypto-input");
let dollars = document.getElementById("usd-input");

function convertCryptoToUsd() {
  let cryptoValue = removeCurrencyAndNonNumeric(crypto.value);
  if (!cryptoValue) {
    crypto.focus();
    return;
  }
  convertCryptoToDollars(cryptoValue).then((dollar) => {
    dollars.value = dollar.toFixed(2);
  });
}
crypto.addEventListener("input", convertCryptoToUsd);

function convertUsdToCrypto() {
  let dollarsValue = removeCurrencyAndNonNumeric(dollars.value);
  if (!dollarsValue) {
    dollars.focus();
    return;
  }
  convertDollarsToCrypto(dollarsValue).then((solana) => {
    crypto.value = solana.toFixed(4);
  });
}
dollars.addEventListener("input", convertUsdToCrypto);

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

window.addEventListener("DOMContentLoaded", convertCryptoToUsd);
document.getElementById("convert-button").addEventListener("click", () => {
  if (crypto.value) {
    convertCryptoToUsd();
  } else if (dollars.value) {
    convertUsdToCrypto();
  } else {
    alert("Enter Solana or Dollars to convert");
  }
});
