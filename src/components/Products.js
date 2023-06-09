import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart  , {generateCartItemsFrom} from "./Cart";




/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [productList, setProductList] = useState([]);
  const [loading, SetLoading] = useState(false);
  const [Empty, setEmpty] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  let debounceTimer;
  let token = localStorage.getItem("token");
  let [cartData , setCartData] = useState([]);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall = async () => {
    SetLoading(true);
    try {
      const res = await axios.get(config.endpoint + "/products");
      setProductList(res.data);
      SetLoading(false);
    } catch (e) {
      SetLoading(false);
      console.log(
        "Something went wrong. Check the backend console for more details"
      );
    }
  };

  useEffect(() => {
    performAPICall();
    fetchCart(token);
  }, []);

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      const res = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      // console.log("fetched", res.data);
      setProductList(res.data);
      //  setLoading(false);
      setEmpty(false);
      //return res.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        setEmpty(true);
      }
      //window.alert(e);
      // setLoading(false);
    }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */

   const debounceSearch = (event, debounceTimeout) => {

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(
          () => performSearch(event.target.value),
          debounceTimeout
        );
        //perfor
      };  


      

  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;

    try {
      let fetchedData = await axios.get(`${config.endpoint}/cart`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(fetchedData.data);
      setCartData(fetchedData.data);
        
      
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    for(let i=0;i<items.length;i++){
      if(items[i].productId == productId){
        console.log("Matched");
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
   const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log(token+" "+items+" "+products+" "+productId+" "+qty);
    if(!token){
      enqueueSnackbar("Login to add an item to the Cart",{variant:'warning'});
    }else if(isItemInCart(items,productId)){
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item",{variant:'warning'})
    }else{
      try {
        // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
        let sentData = await axios.post(`${config.endpoint}/cart`,{"productId":productId,"qty":qty},
          {headers: {
            'Authorization': `Bearer ${token}`
          }
        })
       ;

       
       //fetchCart();
       setCartData(sentData.data);
  
      //  return fetchedData
  
      } catch (e) {
          console.log(e);
      }
    }
  };


  return (
    <div>
      <Header
        children={
          <TextField
            className="search-desktop"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange={(e) => debounceSearch(e, 500)}
          />
        }
      >
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
      </Header>

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      <Grid container>

        

        <Grid item md className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>


          
          {Empty? <h1>No Products Found</h1>:<>
          {loading ? (
            <>
               <Box 
           display = "flex"
           justifyContent = "center"
           alignItems = "center"> <CircularProgress/>
           Loading Products
           </Box>
            </>
          ) : (  
            <div>
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
              >
                {productList.map((content,id) => (
                  <Grid item xs={2} md={3} key={id}>
                    <ProductCard product={content}  handleAddToCart={()=>{addToCart(token,cartData,productList,content._id,1)}}/>
                  </Grid>
                ))}
              </Grid>
            </div>
          )}</>}
        </Grid>

        <Grid item md={3} sx={{backgroundColor : "#E9F5E1"}}>
          <Cart  
          items = {generateCartItemsFrom(cartData, productList)}
          isReadOnly = {false}
          handleQuantity={addToCart}
          />
        </Grid>



      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
