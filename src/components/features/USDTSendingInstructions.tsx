
interface USDTSendingInstructionsProps {
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

export function USDTSendingInstructions({ orderData, orderId, onBackToHome }: USDTSendingInstructionsProps) {
  return (
    <div className="text-white">
      <h2>USDT Sending Instructions</h2>
      <p>Amount: {orderData.amount}</p>
      <p>Order ID: {orderId}</p>
      <button onClick={onBackToHome}>Back to Home</button>
    </div>
  );
}
