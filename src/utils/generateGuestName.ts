export function generateGuestName(): string {
  const randomNumber = Math.floor(10000 + Math.random() * 90000); // Generates a 5-digit random number
  return `Guest-${randomNumber}`;
}
