const Hero = () => {
  return (
    <section className="pt-20 px-5 pb-12">
      {/* Hero Block with Background Image */}
      <div
        className="relative rounded-3xl overflow-hidden min-h-[600px] flex items-center"
        style={{
          backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-8 sm:px-12 lg:px-16 py-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <strong>
                Notarize and Apostille <br />
                Your Documents <br />
                100% Online
              </strong>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl">
              Secure, legally valid, recognized internationally through the Hague Convention<br />
              from anywhere, in just a few minutes.
            </p>

            <a href="#" className="primary-cta text-lg inline-block mb-12 bg-white text-black hover:bg-gray-100">
              Book an appointement
            </a>

            {/* Features */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mt-8">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ff8b02c6344234e55e6908_hugeicons--legal-hammer%20(2)%201.svg"
                  alt="Legal"
                  className="w-6 h-6 brightness-0 invert"
                  height="25"
                />
                <span className="text-white font-medium">Legally valid worldwide</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ff8ab39dbcffc87b0adbfb_fluent--flash-16-regular%201.svg"
                  alt="Fast"
                  className="w-6 h-6 brightness-0 invert"
                  height="25"
                />
                <span className="text-white font-medium">Fast &amp; fully online</span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ff8adc0d66d2c2a71c35cd_iconoir--badge-check%201.svg"
                  alt="Secure"
                  className="w-6 h-6 brightness-0 invert"
                  height="25"
                />
                <span className="text-white font-medium">Secure &amp; privacy-focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
