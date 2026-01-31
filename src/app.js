// app.js
import { calc_max_home_price } from "./mortgage.js";

const fmt_cad = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

function num(id) {
  const v = document.querySelector(id)?.value ?? "";
  const n = Number(String(v).replace(/,/g, ""));
  return isFinite(n) ? n : 0;
}

function render() {
  const down_payment = num("#down_payment");
  const annual_interest_rate = num("#interest_rate");
  const amortization_years = num("#amort_years");
  const monthly_budget = num("#monthly_budget");

  const monthly_non_mortgage_cost = num("#non_mortgage_cost"); // optional
  const closing_cost = num("#closing_cost"); // optional

  const result = calc_max_home_price({
    down_payment,
    monthly_payment_budget: monthly_budget,
    annual_interest_rate,
    amortization_years,
    monthly_non_mortgage_cost,
    closing_cost,
  });

  document.querySelector("#out_mortgage_payment").textContent =
    fmt_cad.format(result.mortgage_payment);

  document.querySelector("#out_max_mortgage").textContent =
    fmt_cad.format(result.max_mortgage);

  document.querySelector("#out_max_home_price").textContent =
    fmt_cad.format(result.max_home_price);

  const warn = document.querySelector("#warning");
  if (monthly_budget - monthly_non_mortgage_cost <= 0) {
    warn.textContent = "월 예산이 비(非)모기지 비용보다 작아서 대출 계산이 0으로 나와요.";
    warn.style.display = "block";
  } else {
    warn.textContent = "";
    warn.style.display = "none";
  }
}

document.querySelectorAll("input, select").forEach((el) => {
  el.addEventListener("input", render);
});

render();