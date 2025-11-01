import blogHeroIllustration from "@/assets/blog-hero.png";

export function BlogHero() {
  return (
    <div className="relative bg-gradient-to-b from-terex-darker to-terex-dark py-20 md:py-32 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-terex-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-terex-accent-light rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4">
              <span className="text-terex-accent text-sm font-medium bg-terex-accent/10 px-4 py-2 rounded-full">
                Blog Terex
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
              Actualités et Guides sur la{" "}
              <span className="text-terex-accent">Crypto en Afrique</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Découvrez nos articles, guides et actualités sur l'USDT, les transferts internationaux, 
              la blockchain et l'économie numérique en Afrique.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-terex-accent/10 to-transparent"></div>
              <img
                src={blogHeroIllustration}
                alt="Crypto illustration"
                className="relative w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
