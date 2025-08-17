
interface USDTSentConfirmationProps {
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
  onBackToHome: () => void;
}

export function USDTSentConfirmation({ orderData, orderId, onBackToHome }: USDTSentConfirmationProps) {
  return (
    <div className="text-white">
      <h2>USDT Sent Confirmation</h2>
      <p>Amount: {orderData.amount}</p>
      <p>Order ID: {orderId}</p>
      <button onClick={onBackToHome}>Back to Home</button>
    </div>
  );
}
