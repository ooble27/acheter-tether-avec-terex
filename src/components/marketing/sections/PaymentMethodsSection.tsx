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
    <section className="py-20 sm:py-28" style={{ backgroundColor: "#1a1a1a" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-16">
          <p
            className="text-xs sm:text-sm font-medium uppercase tracking-widest mb-4"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            Moyens de paiement
          </p>
          <h2
            className="font-bold text-white tracking-tight mb-5"
            style={{ fontSize: "clamp(1.9rem, 4vw, 2.6rem)" }}
          >
            Payez avec Mobile Money
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            Achetez vos USDT directement avec votre portefeuille mobile
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-stretch gap-5 sm:gap-6">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-6 py-5 sm:px-8 sm:py-6 rounded-2xl transition-colors duration-300 min-w-[200px] sm:min-w-[240px]"
              style={{
                backgroundColor: "#1e1e1e",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >
              <div
                className="flex items-center justify-center rounded-xl w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
              >
                <img
                  src={method.logo}
                  alt={method.name}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-contain"
                />
              </div>
              <span className="text-white text-base sm:text-lg font-medium">
                {method.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
