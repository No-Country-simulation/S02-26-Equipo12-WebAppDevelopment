export const getCollection = async (slug: string) => {
  if (!slug) {
    throw new Error("El slug no puede estar vacío");
  }

  const res = await fetch(`https://horze.es/collections/${slug}.json`);
  const data = await res.json();
  return data.collection?.id;
};
