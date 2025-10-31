import { getImageUrl } from '../utils/imageLoader';

const Testimonial = () => {
  const testimonialAvatar = getImageUrl('testimonial-avatar');

  return (
    <section className="py-20 px-[30px] bg-white overflow-hidden">
      <div className="max-w-[1300px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500 scroll-fade-in">
          {/* Image */}
          <div className="h-64 lg:h-auto relative overflow-hidden group scroll-slide-left">
            <img
              src={testimonialAvatar}
              alt="Callum Davis"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Content */}
          <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6 scroll-slide-right">
            <div className="relative">
              <svg className="w-12 h-12 text-gray-300 opacity-50 absolute -top-4 -left-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 relative z-10">
                "A smooth and fully digital experience"
              </h3>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              My Notary made what used to be a complex process incredibly simple. I was able to sign,
              certify, and apostille my documents online, fully legally, in just a few minutes. Their
              team is responsive, reliable, and the platform is extremely intuitive
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="w-1 h-16 bg-black rounded-full"></div>
              <div>
                <div className="text-xl font-bold text-gray-900 mb-1">Callum Davis</div>
                <div className="text-sm gradient-text font-semibold">CEO of Akkar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
