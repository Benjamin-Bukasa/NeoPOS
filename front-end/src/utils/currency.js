// Permet d'accéder à la devise choisie dans toute l'app
export function getCurrencySymbol() {
  return localStorage.getItem('currency') || '$';
}
