
interface SellOrderConfirmationProps {
  orderData: {
    amount: string;
    paymentMethod: string;
    accountDetails: string;
    usdtAddress: string;
    usdtNetwork: string;
    binancePay: boolean;
    binanceEmail: string;
  };
  orderId: string;
  onBack: () => void;
}

export function SellOrderConfirmation({ orderData, orderId, onBack }: SellOrderConfirmationProps) {
  return (
    <div className="text-white">
      <h2>Sell Order Confirmation</h2>
      <p>Amount: {orderData.amount}</p>
      <p>Order ID: {orderId}</p>
      <button onClick={onBack}>Back</button>
    </div>
  );
}
