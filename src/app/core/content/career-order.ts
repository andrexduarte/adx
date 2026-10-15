const MONTHS = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

interface CareerPeriod {
  year?: string;
  period?: string;
  excerpt?: string;
}

function startMonth(moment: CareerPeriod): number {
  const firstWord = (moment.period || moment.excerpt || '').trim().split(/\s/)[0].toLowerCase();
  return MONTHS.indexOf(firstWord) + 1;
}

export function newestCareerFirst(a: CareerPeriod, b: CareerPeriod): number {
  const yearA = Number.parseInt(a.year || '') || 9999;
  const yearB = Number.parseInt(b.year || '') || 9999;
  return yearB - yearA || startMonth(b) - startMonth(a);
}
