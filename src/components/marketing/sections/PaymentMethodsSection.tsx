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

        <div className="flex justify-center items-center gap-16 sm:gap-24 lg:gap-32">
          {paymentMethods.map((method, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className="absolute inset-0 bg-terex-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={method.logo} 
                alt={method.name}
                className="relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
