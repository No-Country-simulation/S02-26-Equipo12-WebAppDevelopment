import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { getProduct } from "../../utils/getProudcts";
import type { ProductListItem } from "../../utils/types";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const ProductList = () => {
  const [products, setProducts] = useState<ProductListItem[]>([]);

  const menuItem = useSelector((state: RootState) => state.menu.menuItem);

  useEffect(() => {
    getProduct(menuItem.split("/collections/")[1]).then((products) => {
      setProducts(products);
    });
  }, [menuItem]);

  return (
    <>
      {products.length > 0 ? (
        <Box sx={{ flexGrow: 1, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            {products.map((product, index) => (
              <Box
                key={index}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                    md: "calc(33.333% - 11px)",
                    lg: "calc(25% - 12px)",
                  },
                  minWidth: 220,
                  maxWidth: 280,
                }}
              >
                <Link
                  to={`/product/${product.handle}`}
                  state={{ horzeProductId: product.horzeProductId }}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card
                    sx={{
                      borderRadius: 3,
                      overflow: "hidden",
                      transition: "transform 180ms ease, box-shadow 180ms ease",
                      transformOrigin: "center",
                      cursor: "pointer",
                      backgroundColor: "#e0d6d1",

                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 8,
                      },
                    }}
                  >
                    {product.image && (
                      <Box sx={{ p: 1, boxSizing: "border-box" }}>
                        <CardMedia
                          component="img"
                          image={product.image}
                          alt={product.name ?? "Product Image"}
                          sx={{
                            width: "100%",
                            height: 400,
                            display: "block",
                            objectFit: "cover",
                            borderRadius: "16px",
                          }}
                        />
                      </Box>
                    )}
                    <CardContent>
                      <Typography variant="h6" component="div" noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {product.brand}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          color: "#b54b30",
                        }}
                      >
                        {product.price
                          ? `${product.price} €`
                          : "Precio no disponible"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Typography variant="h6" component="div">
          No products available
        </Typography>
      )}
    </>
  );
};

export default ProductList;
