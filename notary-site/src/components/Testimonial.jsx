const Testimonial = () => {
  return (
    <section className="py-20 px-[30px] bg-white">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
          {/* Image */}
          <div className="h-64 lg:h-auto">
            <img
              src="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68e9011bb4012069cfcd1c3c_1685977246323%20(1).jpg"
              srcSet="https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68e9011bb4012069cfcd1c3c_1685977246323%20(1)-p-500.jpg 500w, https://cdn.prod.website-files.com/68bb128cac235707a59a2c06/68e9011bb4012069cfcd1c3c_1685977246323%20(1).jpg 800w"
              sizes="(max-width: 800px) 100vw, 800px"
              alt="Callum Davis"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              "A smooth and fully digital experience"
            </h3>
            <p className="text-gray-700 leading-relaxed mb-8">
              My Notary made what used to be a complex process incredibly simple. I was able to sign,
              certify, and apostille my documents online, fully legally, in just a few minutes. Their
              team is responsive, reliable, and the platform is extremely intuitive
            </p>
            <div>
              <div className="text-lg font-bold text-gray-900 mb-1">Callum Davis</div>
              <div className="text-sm gradient-text font-medium">CEO of Akkar</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
