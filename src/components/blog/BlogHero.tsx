export function BlogHero() {
  return (
    <div className="relative bg-terex-darker py-16 md:py-24 overflow-hidden border-b border-terex-gray/20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-terex-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-terex-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground mb-6 leading-tight">
            Blog Terex
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Découvrez nos articles, guides et actualités sur l'USDT, les transferts internationaux, 
            la blockchain et l'économie numérique en Afrique.
          </p>
        </div>
      </div>
    </div>
  );
}
