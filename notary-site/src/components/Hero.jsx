const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <strong>
              Notarize and Apostille <br />
              Your Documents <br />
              100% Online
            </strong>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Secure, legally valid, recognized internationally through the Hague Convention<br />
            from anywhere, in just a few minutes.
          </p>

          <a href="#" className="primary-cta text-lg inline-block mb-12">
            Book an appointement
          </a>

          {/* Features */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mt-8">
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ff8b02c6344234e55e6908_hugeicons--legal-hammer%20(2)%201.svg"
                alt="Legal"
                className="w-6 h-6"
                height="25"
              />
              <span className="text-gray-800 font-medium">Legally valid worldwide</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ff8ab39dbcffc87b0adbfb_fluent--flash-16-regular%201.svg"
                alt="Fast"
                className="w-6 h-6"
                height="25"
              />
              <span className="text-gray-800 font-medium">Fast &amp; fully online</span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68ff8adc0d66d2c2a71c35cd_iconoir--badge-check%201.svg"
                alt="Secure"
                className="w-6 h-6"
                height="25"
              />
              <span className="text-gray-800 font-medium">Secure &amp; privacy-focused</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
