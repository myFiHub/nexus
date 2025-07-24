export const fetchMovePrice = async (): Promise<number> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=movement&vs_currencies=usd"
  );
  const data = await response.json();
  return Number(data.movement.usd);
};
