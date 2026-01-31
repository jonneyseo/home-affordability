// mortgage.js
export function calc_max_principal_from_monthly_payment({
    monthly_payment,
    annual_interest_rate,
    amortization_years,
  }) {
    const m = Number(monthly_payment);
    const rate = Number(annual_interest_rate);
    const years = Number(amortization_years);

    if (!isFinite(m) || !isFinite(rate) || !isFinite(years)) return 0;
    if (m <= 0 || years <= 0) return 0;

    const n = years * 12;

    // 0% 이율 처리
    if (rate === 0) return m * n;

    const r = rate / 100 / 12;
    const principal = m * (1 - Math.pow(1 + r, -n)) / r;

    return principal > 0 && isFinite(principal) ? principal : 0;
  }

  export function calc_max_home_price({
    down_payment,
    monthly_payment_budget,
    annual_interest_rate,
    amortization_years,
    monthly_non_mortgage_cost = 0, // tax/strata/insurance 등
    closing_cost = 0,
  }) {
    const dp = Number(down_payment) || 0;
    const budget = Number(monthly_payment_budget) || 0;
    const non_mortgage = Number(monthly_non_mortgage_cost) || 0;
    const closing = Number(closing_cost) || 0;

    const mortgage_payment = Math.max(0, budget - non_mortgage);

    const max_mortgage = calc_max_principal_from_monthly_payment({
      monthly_payment: mortgage_payment,
      annual_interest_rate,
      amortization_years,
    });

    const max_home_price = Math.max(0, max_mortgage + dp - closing);

    return { mortgage_payment, max_mortgage, max_home_price };
  }
