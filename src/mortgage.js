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
    // A, B, C
    sale_price_current_home = 0,     // A
    debt_to_payoff = 0,              // B
    cash_on_hand = 0,                // C

    // D 관련 (월 예산 기반)
    monthly_payment_budget = 0,
    annual_interest_rate = 0,
    amortization_years = 30,
    monthly_non_mortgage_cost = 0,
    loan_mode = "auto",          // "auto" | "manual"
    manual_loan_amount = 0,      // loan_mode가 manual일 때 사용

    // E, F, G
    purchase_tax = 0,                // E (취득세)
    realtor_fee_pct = 0,             // F (%로 입력)
    other_costs = 0,                 // G (기타비용)
  }) {
    const A = Number(sale_price_current_home) || 0;
    const B = Number(debt_to_payoff) || 0;
    const C = Number(cash_on_hand) || 0;

    const budget = Number(monthly_payment_budget) || 0;
    const non_mortgage = Number(monthly_non_mortgage_cost) || 0;

    const E = Number(purchase_tax) || 0;
    const realtor_pct = Number(realtor_fee_pct) || 0;
    const G = Number(other_costs) || 0;

    // A - B
    const equity_from_home = Math.max(0, A - B);

    // F (리얼터 수수료는 A 기준 %로 계산)
    const F = Math.max(0, A * (realtor_pct / 100));

    // 실제 모기지에 쓸 수 있는 월액
    const mortgage_payment = Math.max(0, budget - non_mortgage);

    // D: 자동 계산 or 직접 입력
    let D = 0;

    if (loan_mode === "manual") {
      D = Math.max(0, Number(manual_loan_amount) || 0);
    } else {
      D = calc_max_principal_from_monthly_payment({
        monthly_payment: mortgage_payment,
        annual_interest_rate,
        amortization_years,
      });
    }

    // B + C + D 라고 쓰셨는데, 문맥상 "현재집 자본(A-B) + 현금(C) + 대출(D)"를
    // '최대 자산금액'으로 보고 싶으신 거라 여기서는 equity_from_home + C + D로 계산
    const max_assets = Math.max(0, equity_from_home + C + D);

    // 최대 가용 부동산금액 = 최대 자산금액 - (E + F + G)
    const max_affordable_property_price = Math.max(0, max_assets - (E + F + G));

    return {
      // A~G
      A,
      B,
      equity_from_home,
      C,
      D,
      E,
      F,
      G,

      // 월 관련
      mortgage_payment,

      // 핵심 요약
      max_assets,
      max_affordable_property_price,
      loan_mode,
      manual_loan_amount,
    };
  }
