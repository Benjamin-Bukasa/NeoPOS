export const filterArticles = ({
  category = null,
  minPrice = null,
  maxPrice = null,
  color = null
}) => {
  return saleItems.filter((item) => {
    const matchCategory = category ? item.articleCategory === category : true;
    const matchPriceMin = minPrice !== null ? item.articlePrice >= minPrice : true;
    const matchPriceMax = maxPrice !== null ? item.articlePrice <= maxPrice : true;
    const matchColor = color
      ? item.articleColor.some((clr) =>
          clr.colorName.toLowerCase() === color.toLowerCase()
        )
      : true;

    return matchCategory && matchPriceMin && matchPriceMax && matchColor;
  });
};
