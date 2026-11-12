
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import{Link} from "react-router-dom"
 
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  {
    id: 1,
    desktopImage: "/images/banners/desktop.jpg",
    mobileImage: "/images/banners/hero-1-mobile.jpg",
    subtitle: "THREADS & TASSELS",
    title: "Elegance in Every Thread",
    description:
      "Discover beautifully crafted salwar materials for every occasion.",
    buttonText: "Explore Collection",
  },
  {
    id: 2,
    desktopImage: "/images/banners/desktop-2.jpg",
    mobileImage: "/images/banners/hero-2-mobile.jpg",
    subtitle: "NEW ARRIVALS",
    title: "Tradition Meets Elegance",
    description:
      "Explore our latest collection of premium fabrics and timeless designs.",
    buttonText: "Shop Now",
  },
];

function HeroCarousel(){

    
const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  const mediaQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const updatePreference = () => {
    setReduceMotion(mediaQuery.matches);
  };

  updatePreference();

  mediaQuery.addEventListener("change", updatePreference);

  return () => {
    mediaQuery.removeEventListener("change", updatePreference);
  };
}, []);

  return (
    <section className="relative w-full overflow-hidden">

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        slidesPerView={1}
        loop={true} 
autoplay={
  reduceMotion
    ? false
    : {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }
}

        navigation={{
          prevEl: ".hero-prev",
          nextEl: ".hero-next",
        }}
        pagination={{
          clickable: true,
          el: ".hero-pagination",
        }}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-[480px] w-full sm:h-[550px] lg:h-[600px]">

              {/* Responsive background images */}
              <picture>
                <source
                  media="(max-width: 639px)"
                  srcSet={slide.mobileImage}
                />

                <img
                  src={slide.desktopImage}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </picture>

              {/* Light overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-ivory/90 via-ivory/60 to-transparent sm:bg-gradient-to-r sm:from-ivory/90 sm:via-ivory/65" />

              {/* Banner content */}
              <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6 sm:px-10 lg:px-16">

                <div className="max-w-xl text-chocolate">

                  <p className="mb-4 text-xs font-semibold tracking-[0.3em] text-gold uppercase">
                    {slide.subtitle}
                  </p>

                  <h2 className="max-w-[300px] font-serif text-3xl leading-tight min-[400px]:text-4xl sm:max-w-none sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h2>

                  <p className="mt-5 max-w-md text-sm leading-7 sm:text-base">
                    {slide.description}
                  </p>

                  <Link
            to="/products"
            className="mt-8 inline-block rounded-full bg-chocolate px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gold"
            >
              {slide.buttonText}

            </Link>

                  {/* <a
                    href="#"
                    className="mt-8 inline-block rounded-full bg-chocolate px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-gold"
                  >
                    {slide.buttonText}
                  </a> */}

                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Desktop navigation arrows */}
      <button
        type="button"
        aria-label="Previous slide"
        className="hero-prev absolute top-1/2 left-5 z-20 hidden -translate-y-1/2 rounded-full bg-white/80 p-3 text-chocolate shadow-md lg:flex"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        aria-label="Next slide"
        className="hero-next absolute top-1/2 right-5 z-20 hidden -translate-y-1/2 rounded-full bg-white/80 p-3 text-chocolate shadow-md lg:flex"
      >
        <ChevronRight size={22} />
      </button>

      {/* Pagination dots */}
      <div className="hero-pagination absolute bottom-5 left-0 z-20 flex w-full justify-center gap-2" />

    </section>
  );
}

export default HeroCarousel;
