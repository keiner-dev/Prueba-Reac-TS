
export function formatPrice(price: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency }).format(price);
}


export function safeImages(images?: string[]): string[] {
  return images ?? [];
}


export function firstImage(images?: string[]): string | undefined {
  return safeImages(images)[0];
}
