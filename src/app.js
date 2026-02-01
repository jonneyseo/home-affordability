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

  // 월/금리/기간 (기존 입력값 다시 읽기)
  const monthly_budget = num("#monthly_budget");
  const annual_interest_rate = num("#interest_rate");
  const amortization_years = num("#amort_years");
  const monthly_non_mortgage_cost = num("#non_mortgage_cost");
  const loan_mode = document.querySelector('input[name="loan_mode"]:checked')?.value || "auto";
  const manual_loan_amount = num("#manual_loan_amount");

  // A, B, C
  const sale_price_current_home = num("#sale_price_current_home");
  const debt_to_payoff = num("#debt_to_payoff");
  const cash_on_hand = num("#cash_on_hand");

  // E, F, G
  const purchase_tax = num("#purchase_tax");
  const realtor_fee_pct = num("#realtor_fee_pct");
  const other_costs = num("#other_costs");

  const result = calc_max_home_price({
    sale_price_current_home,
    debt_to_payoff,
    cash_on_hand,

    monthly_payment_budget: monthly_budget,
    annual_interest_rate,
    amortization_years,

    loan_mode,
    manual_loan_amount,

    monthly_non_mortgage_cost,
    purchase_tax,
    realtor_fee_pct,
    other_costs,
  });

  const manualWrap = document.querySelector("#manual_loan_wrap");
  if (manualWrap) {
    manualWrap.style.display = loan_mode === "manual" ? "flex" : "none";
  }

  // A, B, (A-B), C
  document.querySelector("#out_A").textContent = fmt_cad.format(result.A);
  document.querySelector("#out_B").textContent = fmt_cad.format(result.B);
  document.querySelector("#out_equity").textContent = fmt_cad.format(result.equity_from_home);
  document.querySelector("#out_C").textContent = fmt_cad.format(result.C);

  // D
  document.querySelector("#out_D").textContent = fmt_cad.format(result.D);

  // 참고: B+C+D
  document.querySelector("#out_BCD").textContent = fmt_cad.format(result.B + result.C + result.D);

  // 최대 자산금액: (A-B)+C+D
  document.querySelector("#out_max_assets").textContent = fmt_cad.format(result.max_assets);

  // E, F, G
  document.querySelector("#out_E").textContent = fmt_cad.format(result.E);
  document.querySelector("#out_F").textContent = fmt_cad.format(result.F);
  document.querySelector("#out_G").textContent = fmt_cad.format(result.G);

  // 최종
  document.querySelector("#out_max_affordable").textContent =
    fmt_cad.format(result.max_affordable_property_price);


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
  el.addEventListener("change", render);
});

render();