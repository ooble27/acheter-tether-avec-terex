import waveImage from "@/assets/wave-logo.png";
import orangeMoneyImage from "@/assets/orange-money-logo.png";
import bankCardImage from "@/assets/bank-card-logo.png";

const paymentMethods = [
  {
    name: "Wave",
    logo: waveImage,
  },
  {
    name: "Orange Money",
    logo: orangeMoneyImage,
  },
  {
    name: "Cartes bancaires",
    logo: bankCardImage,
  }
];

export function PaymentMethodsSection() {
  return (
    <section className="py-12 sm:py-16 bg-terex-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white mb-4">
            Méthodes de <span className="text-terex-accent">paiement</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto font-light">
            Plusieurs options sécurisées pour vos transactions
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-14 lg:gap-20">
          {paymentMethods.map((method, index) => (
            <img 
              key={index}
              src={method.logo} 
              alt={method.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain hover:scale-110 transition-transform duration-300"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
