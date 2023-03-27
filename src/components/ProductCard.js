import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";


// {
//   "name":"Tan Leatherette Weekender Duffle",
//   "category":"Fashion",
//   "cost":150,
//   "rating":4,
//   "image":"https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png",
//   "_id":"PmInA797xJhMIPti"
//   }

const ProductCard = ({ product, handleAddToCart }) => {

  return (
    <Card className="card">
      
      <CardMedia
        component="img"
        sx={{ height: 140 }}
        image={product.image}
        alt={product._id}
      />
      <CardContent>
      <Typography variant="div"  color="text.secondary">
      {product.name}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
        ${product.cost}
        </Typography>
        <Rating
          value={product.rating}
          readOnly
        />
      </CardContent>
      <CardActions>
        <Button variant="contained" fullWidth onClick={handleAddToCart}><AddShoppingCartOutlined/> Add to cart</Button>
      </CardActions>
    </Card>
    
  );
};

export default ProductCard;
