export const normalizePlan = (plan) => ({
  id: plan.id,
  name: plan.name,
  description: plan.description,

  monthlyPrice: plan.monthlyPrice,
  annualPrice: plan.annualPrice,

  discount: plan.hasDiscount && plan.discountPercentage
    ? `${plan.discountPercentage}% OFF`
    : null,

  originalPrice: plan.originalAnnualPrice
    ? `$${plan.originalAnnualPrice.toLocaleString("es-CO")}`
    : null,

  featured: plan.featured,
  tag: plan.tag,

  features: (plan.features || []).map(f => ({
    text: f.texto ?? f.text,
    tooltip: f.tooltip
  }))
});
