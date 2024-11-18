import { useCart } from '../../context/CartContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import Button from '../../components/Button/Button';
import formatToIDRCurrency from '../../utils/formatToIDRCurrency';
import Navbar from '../../components/Navbar/Navbar';
import { toast } from 'react-hot-toast';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleUpdateQuantity = (item, change) => {
    const newQuantity = item.quantity + change;
    
    // Validasi stok
    if (newQuantity > item.stock) {
      toast.error('Cannot exceed available stock');
      return;
    }
    
    if (newQuantity < 1) {
      toast.error('Minimum quantity is 1');
      return;
    }

    updateQuantity(item.id, newQuantity);
  };

  const handleCheckout = () => {
    // Implementasi checkout akan ditambahkan nanti
    toast.success('Proceeding to checkout...');
  };

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="px-24 py-12 text-center">
          <h2 className="text-2xl font-medium mb-4">Your Cart is Empty</h2>
          <Button 
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#6173E6] text-white rounded-md hover:bg-[#5969cf]"
          >
            Continue Shopping
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="px-24 py-8">
        <h2 className="text-2xl font-medium mb-8">Shopping Cart</h2>
        
        <div className="grid grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="col-span-8">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 p-4 border-b"
              >
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  className="w-24 h-24 object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">{item.category}</p>
                  <p className="font-medium">{formatToIDRCurrency(item.price)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpdateQuantity(item, -1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  
                  <span className="w-8 text-center">{item.quantity}</span>
                  
                  <button
                    onClick={() => handleUpdateQuantity(item, 1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}

            <Button
              onClick={clearCart}
              className="mt-4 px-4 py-2 text-red-500 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="col-span-4">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatToIDRCurrency(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t pt-2 font-medium flex justify-between">
                  <span>Total</span>
                  <span>{formatToIDRCurrency(getCartTotal())}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full py-3 bg-[#6173E6] text-white rounded-md hover:bg-[#5969cf]"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}