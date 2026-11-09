
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Heart,
  Sparkles,
  PackageCheck,
  ArrowRight,
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Chosen With Care",
    description:
      "A thoughtful selection of dress materials for different tastes, occasions, and personal styles.",
  },
  {
    icon: Sparkles,
    title: "Everyday Elegance",
    description:
      "From subtle everyday looks to beautiful occasion-ready fabrics, discover something that feels like you.",
  },
  {
    icon: PackageCheck,
    title: "A Simple Experience",
    description:
      "Explore our collections, find your favourites, and shop with convenience from wherever you are.",
  },
];

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-[#FAF7F1] text-[#4A2E1F]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#FFFCF8]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:px-10 md:py-24 lg:gap-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#C9A46A]/40 px-4 py-2 text-xs font-medium tracking-[0.18em] uppercase text-[#99774B]">
              <Sparkles size={14} />
              The Story Behind The Style
            </div>

            <h1 className="max-w-xl font-serif text-5xl leading-[1.12] md:text-6xl lg:text-7xl">
              A Little More
              <br />
              <span className="italic text-[#B88D66]">
                About Us.
              </span>
            </h1>

            <div className="my-8 h-px w-20 bg-[#C9A46A]" />

            <p className="max-w-lg text-base leading-8 text-[#78695F] md:text-lg">
              Welcome to Threads &amp; Tassels, a boutique
              destination for beautiful salwar dress materials
              and fabrics, thoughtfully brought together to
              inspire your personal style.
            </p>

            <p className="mt-5 max-w-lg text-sm leading-7 text-[#887A70] md:text-base">
              We believe choosing a fabric is more than
              shopping. It is the beginning of creating
              something that feels uniquely yours.
            </p>

            <Link
              to="/products"
              className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#4A2E1F] px-7 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6B4734]"
            >
              Explore Our Collection
              <ArrowUpRight size={17} />
            </Link>
          </div>

          {/* <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -left-4 top-8 h-40 w-40 rounded-full bg-[#E9A09A]/15 blur-3xl" />
            <div className="absolute -bottom-6 -right-4 h-48 w-48 rounded-full bg-[#C9A46A]/20 blur-3xl" /> */}

            {/* <div className="relative overflow-hidden rounded-t-[180px] rounded-b-[20px] border-[7px] border-white shadow-xl">
              <img
                src="/images/about/about-hero.jpg"
                alt="Beautifully arranged salwar dress materials"
                className="h-[390px] w-full object-cover md:h-[510px]"
              />
            </div> */}

            {/* <div className="absolute -bottom-5 -left-3 rounded-xl border border-[#EAE2D8] bg-[#FFFCF8] px-6 py-4 shadow-lg md:-left-8">
              <p className="font-serif text-xl italic text-[#4A2E1F]">
                Made for Your Style
              </p>
              <p className="mt-1 text-xs tracking-widest uppercase text-[#A28C75]">
                Threads &amp; Tassels
              </p>
            </div> */}
          {/* </div> */}
        </div>
      </section>

      {/* OUR STORY */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 md:grid-cols-2 md:px-10 md:py-28 lg:gap-20">
        <div className="relative">
          {/* <div className="overflow-hidden rounded-2xl">
            <img
              src="/images/about/about-fabrics.jpg"
              alt="Colourful fabrics and dress materials"
              className="h-[350px] w-full object-cover md:h-[480px]"
            />
          </div> */}
          <div className="absolute -bottom-5 -right-4 -z-0 h-32 w-32 rounded-2xl border border-[#C9A46A]/60 md:-right-6" />
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#B88D66]">
            Our Story
          </p>

          <h2 className="font-serif text-4xl leading-tight md:text-5xl">
            Every Fabric Has
            <br />
            <span className="italic text-[#B88D66]">
              A Story To Tell.
            </span>
          </h2>

          <p className="mt-7 text-sm leading-8 text-[#78695F] md:text-base">
            At Threads &amp; Tassels, we celebrate the
            beauty of fabrics and the creativity they make
            possible. Our collection brings together salwar
            materials in a variety of colours, textures,
            patterns, and styles.
          </p>

          <p className="mt-5 text-sm leading-8 text-[#78695F] md:text-base">
            Whether you're looking for a comfortable everyday
            outfit, something elegant for a celebration, or
            fabric for your next custom-stitched design,
            we're here to make discovering it easier.
          </p>

          <div className="mt-8 flex items-center gap-3">
            <span className="h-px w-10 bg-[#C9A46A]" />
            <span className="font-serif text-lg italic text-[#99774B]">
              Your fabric. Your expression.
            </span>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-[#FFFCF8] px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#B88D66]">
              What We Believe
            </p>
            <h2 className="font-serif text-4xl md:text-5xl">
              The Little Things
              <span className="italic text-[#B88D66]">
                {" "}Matter.
              </span>
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#887A70]">
              A beautiful shopping experience begins with
              thoughtful choices and attention to detail.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-[#EAE2D8] bg-[#FAF7F1] p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-7 flex h-13 w-13 items-center justify-center rounded-full bg-[#E9A09A]/15 text-[#B88D66]">
                  <Icon size={23} strokeWidth={1.5} />
                </div>

                <h3 className="font-serif text-2xl">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#887A70]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="relative overflow-hidden px-5 py-20 md:px-10 md:py-28">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-[#E9A09A]/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-[#8FA580]/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-[#B88D66]">
            Discover Your Next Favourite
          </p>

          <h2 className="font-serif text-4xl leading-tight md:text-6xl">
            Find The Fabric.
            <br />
            <span className="italic text-[#B88D66]">
              Create Your Story.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-[#78695F] md:text-base">
            Explore our collection of salwar materials and
            discover pieces that inspire your next look.
          </p>

          <Link
            to="/products"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#4A2E1F] px-8 py-4 text-sm font-medium text-white transition-all duration-300 hover:bg-[#6B4734]"
          >
            Shop Our Collection
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
