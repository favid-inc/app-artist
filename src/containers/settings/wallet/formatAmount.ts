export function formatAmount(amount: number) {
  if (!amount || isNaN(amount)) {
    return 'R$ 0,00';
  }

  const [reais, centavos] = splitAmount(Math.abs(amount));

  const reaisFormatted = formatReais(reais);

  const minus = amount < 0 ? '-' : '';

  return `R$ ${minus}${reaisFormatted}${reaisFormatted ? ',' : ''}${centavos}`;
}

function splitAmount(amount: number) {
  const amountText = String(amount);

  const centavos = amountText.substr(-2);
  const reais = amountText.substr(0, amountText.length - centavos.length);
  return [reais, centavos];
}

function formatReais(reais: string) {
  const groups = invert(reais).match(/(?:\d{1,3})/g) || [];
  const withSeparator = groups.join('.');
  return invert(withSeparator);
}

function invert(text: string) {
  return text.split('').reverse().join('');
}
