
import HeroCarousel from "../components/home/HeroCarousel";
import ShoppingBenefits from "../components/home/ShoppingBenefits";
import CategorySection from "../components/home/CategorySection";
import SpecialOfferBanner from "../components/home/SpecialOfferBanner";
import TrendingProducts from "../components/home/TrendingProducts";
import AllProductsSection from "../components/home/AllProductsSection";
import Reveal from "../components/common/Reveal";

function Home() {
  return (
    <>
    <Reveal>
      <HeroCarousel />
      </Reveal>

      <Reveal>
        <ShoppingBenefits />
      </Reveal>

      <Reveal>
        <CategorySection />
      </Reveal>

      <Reveal>
        <SpecialOfferBanner />
      </Reveal>

      <Reveal>
        <TrendingProducts />
      </Reveal>

      <Reveal>
        <AllProductsSection />
      </Reveal>
    </>
  );
}

export default Home;
