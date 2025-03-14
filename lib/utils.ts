export function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
  }

  export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
    }).format(amount);
}