// transform 054dfc78-c174-49dc-a620-0f0da86d0400 to 054dfc78c17449dca6200f0da86d0400@gmail.com
export function transformIdToEmailLike(id: string): string {
  const rawId = id.replace(/-/g, "");
  return `${rawId}@gmail.com`;
}

// transform 054dfc78c17449dca6200f0da86d0400@gmail.com to 054dfc78-c174-49dc-a620-0f0da86d0400
export function transformEmailLikeToId(email: string): string {
  const parts = email.split("@");
  const id = parts[0];
  const idParts = id.split("");
  const idLength = idParts.length;
  const firstPart = idParts.slice(0, 8).join("");
  const secondPart = idParts.slice(8, 12).join("");
  const thirdPart = idParts.slice(12, 16).join("");
  const fourthPart = idParts.slice(16, 20).join("");
  const fifthPart = idParts.slice(20, idLength).join("");
  return `${firstPart}-${secondPart}-${thirdPart}-${fourthPart}-${fifthPart}`;
}
