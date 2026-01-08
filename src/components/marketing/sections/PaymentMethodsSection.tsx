import waveImage from "@/assets/wave-logo.png";
import orangeMoneyImage from "@/assets/orange-money-logo.png";

const paymentMethods = [
  {
    name: "Wave",
    logo: waveImage,
  },
  {
    name: "Orange Money",
    logo: orangeMoneyImage,
  }
];

export function PaymentMethodsSection() {
  return (
    <section className="py-16 sm:py-20 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
            Payez avec <span className="text-terex-accent">Mobile Money</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-light">
            Achetez vos USDT directement avec votre portefeuille mobile
          </p>
        </div>

        <div className="flex justify-center items-center gap-6 sm:gap-8">
          {paymentMethods.map((method, index) => (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl bg-terex-gray/30 hover:bg-terex-gray/50 transition-all duration-300 hover:scale-105 min-w-[180px] sm:min-w-[200px]"
            >
              <img 
                src={method.logo} 
                alt={method.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain"
              />
              <span className="text-white text-sm sm:text-base font-medium">
                {method.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
