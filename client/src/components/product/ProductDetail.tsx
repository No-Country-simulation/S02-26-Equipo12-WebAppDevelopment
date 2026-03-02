import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getProductPdpByHandle, getProductPdpById } from "../../utils/getProudcts";
import type { ProductPdpItem } from "../../utils/types";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const horzeProductId =
    (location.state as { horzeProductId?: string | null } | null)
      ?.horzeProductId ?? null;
  const [product, setProduct] = useState<ProductPdpItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdp = async () => {
      if (horzeProductId) {
        return getProductPdpById(horzeProductId);
      }

      if (handle) {
        return getProductPdpByHandle(handle);
      }

      return null;
    };

    fetchPdp()
        .then((productData) => {
          setProduct(productData);
          setSelectedSize(productData?.sizes[0] ?? null);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
          setProduct(null);
          setSelectedSize(null);
        })
        .finally(() => {
          setLoading(false);
        });
  }, [handle, horzeProductId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom color="#000">
          Producto no encontrado
        </Typography>
        <Button onClick={() => navigate("/")}>Volver</Button>
      </Box>
    );
  }

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.available,
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Box sx={{ maxWidth: 1200, width: "100%" }}>
        <Button onClick={() => navigate("/")} sx={{ mb: 3 }}>
          ← Volver
        </Button>

        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {product.image && (
              <Box
                component="img"
                src={product.image}
                alt={product.title}
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  height: "auto",
                  borderRadius: 3,
                  objectFit: "cover",
                }}
              />
            )}
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              marginBottom: "auto",
              gap: 2,
            }}
          >
            <Typography variant="body1" color="#000">
              {product.brand}
            </Typography>

            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="#000"
            >
              {product.title}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                color: "#b54b30",
              }}
            >
              {selectedVariant?.price
                ? `${selectedVariant.price} €`
                : product.variants[0]?.price
                  ? `${product.variants[0].price} €`
                  : "Precio no disponible"}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom color="#000">
                Selecciona una talla
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {product.sizes.map((size: string) => {
                  const isAvailable = product.variants.some(
                    (v) => v.size === size && v.available,
                  );
                  const isSelected = selectedSize === size;

                  return (
                    <Button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      variant={isSelected ? "contained" : "outlined"}
                      sx={{
                        minWidth: 60,
                        backgroundColor: isSelected ? "#b54b30" : "transparent",
                        borderColor: isSelected ? "#b54b30" : "#e0d6d1",
                        color: isSelected ? "#fff" : "#000",
                        "&:hover": {
                          backgroundColor: isSelected ? "#a04020" : "#e0d6d1",
                          borderColor: isSelected ? "#a04020" : "#d0c6c1",
                        },
                        "&:disabled": {
                          borderColor: "#f0f0f0",
                          color: "#999",
                        },
                      }}
                    >
                      {size}
                    </Button>
                  );
                })}
              </Box>
            </Box>

            {selectedVariant && (
              <Typography variant="body2" color="#000" sx={{ mt: 1 }}>
                SKU: {selectedVariant.sku}
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProductDetail;
