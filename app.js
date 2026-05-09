const BASE_URL = "https://api.exchangerate-api.com/v4/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const form = document.querySelector("form");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = "selected";
    }
    if (select.name === "to" && currCode === "INR") {
      option.selected = "selected";
    }

    select.append(option);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  msg.innerText = "Getting exchange rate...";

  try {
    const URL = `${BASE_URL}/${fromCurr.value}`;

    let response = await fetch(URL);
    let data = await response.json();

    let rate = data.rates[toCurr.value];

    if (!rate) throw new Error("Invalid currency");

    let finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.log(error);
    msg.innerText = "Something went wrong ";
  }
};

// Update flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let img = element.parentElement.querySelector("img");

  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Swap feature
const swapBtn = document.querySelector(".dropdown i");

swapBtn.addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

// Form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Auto update
fromCurr.addEventListener("change", updateExchangeRate);
toCurr.addEventListener("change", updateExchangeRate);

// Initial load
window.addEventListener("load", () => {
  updateExchangeRate();
});
