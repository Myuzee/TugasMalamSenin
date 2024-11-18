import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import formatToIDRCurrency from "../../utils/formatToIDRCurrency";
import Button from "../Button/Button";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";
import { toast } from 'react-hot-toast';

export default function ProductCard({product}) {
  const { addToCart } = useCart();
  const { isLoggedIn } = useUser();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Mencegah navigasi dari Link
    
    if (!isLoggedIn) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <Link 
      to={`/products/${product.slug}` ?? ''} 
      className="flex flex-col max-w-[370px] flex-wrap p-[16px] bg-[#081116] hover:ring-opacity-40 active:ring-5 active:ring-[#6247eb] hover:ring-4 active:ring-2 active:ring-opacity-90" 
    >
      <img 
        src={product?.imageUrl ?? ''} 
        alt={product?.name ?? 'No Title'} 
        className="block max-h-[300px] mb-4 object-cover" 
      />
      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-[20px] text-white">
          {product?.name ?? 'No Title'}
        </h4>
        <span className="block font-medium text-[14px] text-[#eaeaea]">
          {product?.category ?? "Uncategorized"}
        </span>
        <span className="block font-medium text-[20px] text-white">
          {product?.price > 0 ? formatToIDRCurrency(product.price) : 'Not For Sale'}
        </span>
        <div>
          {product.stock <= 0 ? (
            <p className="text-xl font-semibold text-center text-red-500">
              Out of Stock
            </p>
          ) : (product.stock <= 25 && product.stock !== 0) ? (
            <>
              <p className="text-xl font-semibold text-center text-yellow-500">
                Almost Sold Out
              </p>
              <Button 
                type="button" 
                onClick={handleAddToCart}
                className="inline-flex items-center justify-center gap-2 p-4 bg-[#6173E6] text-center hover:bg-[#5969cf] text-white active:bg-[#4956ab]"
              >
                <FontAwesomeIcon icon={faCartShopping} className="mb-0" />
                <span>Add to cart</span>
              </Button>
            </>
          ) : (
            <Button 
              type="button" 
              onClick={handleAddToCart}
              className="inline-flex items-center justify-center gap-2 p-4 bg-[#6173E6] text-center hover:bg-[#5969cf] text-white active:bg-[#4956ab] mt-[28px]"
            >
              <FontAwesomeIcon icon={faCartShopping} className="mb-0" />
              <span>Add to cart</span>
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string,
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number.isRequired
  }).isRequired
};