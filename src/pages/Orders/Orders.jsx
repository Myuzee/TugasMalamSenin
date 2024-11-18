import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import formatToIDRCurrency from '../../utils/formatToIDRCurrency';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // Dummy data untuk contoh
  useEffect(() => {
    // Normally this would be an API call
    setOrders([
      {
        id: 1,
        date: '2024-03-18',
        status: 'Delivered',
        total: 1500000,
        items: [
          {
            id: 'KIDS-001',
            name: 'Creative Building Blocks Set',
            quantity: 2,
            price: 299000,
            imageUrl: '/assets/images/building-blocks.png'
          }
        ]
      },
      {
        id: 2,
        date: '2024-03-17',
        status: 'Processing',
        total: 2499000,
        items: [
          {
            id: 'ADULT-003',
            name: 'Professional Robot Building Kit',
            quantity: 1,
            price: 2499000,
            imageUrl: '/assets/images/robot-kit.png'
          }
        ]
      }
    ]);
  }, []);

  return (
    <>
      <Navbar />
      <div className="px-24 py-8">
        <h2 className="text-2xl font-medium mb-8">My Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-medium mb-2">No orders found</h3>
            <p className="text-gray-600">You haven&apos;t placed any orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id}
                className="border rounded-lg overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-gray-50 p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                    <span className="font-medium">
                      {formatToIDRCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  {order.items.map((item) => (
                    <div 
                      key={item.id}
                      className="flex items-center gap-4"
                    >
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm">
                          {formatToIDRCurrency(item.price)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}