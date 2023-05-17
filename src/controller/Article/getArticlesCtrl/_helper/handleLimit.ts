const handleLimit = (limit: number | undefined) => {
  const maxLimit = 20;
  const deliverLimit = Number(
    limit ? (limit <= maxLimit ? limit : maxLimit) : maxLimit
  );
  return { limit: deliverLimit, maxLimit };
};

export { handleLimit };
