
// import {
//   Truck,
//   Gem,
//   Headset,
//   ShieldCheck,
// } from "lucide-react";

// const benefits = [
//   {
//     id: 1,
//     icon: Truck,
//     title: "Free Shipping",
//     description: "On all orders",
//   },
//   {
//     id: 2,
//     icon: Gem,
//     title: "Premium Quality",
//     description: "Carefully selected fabrics",
//   },
//   {
//     id: 3,
//     icon: Headset,
//     title: "Customer Care",
//     description: "We're here to help",
//   },
//   {
//     id: 4,
//     icon: ShieldCheck,
//     title: "Secure Payments",
//     description: "Safe online checkout",
//   },
// ];

// function ShoppingBenefits() {
//   return (
//     <section className="w-full bg-offwhite py-6 sm:py-10 lg:py-14">
//       <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">

//         <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-6 lg:grid-cols-4">

//           {benefits.map((benefit) => {
//             const Icon = benefit.icon;

//             return (
//               <div
//                 key={benefit.id}
//                 className="group flex flex-col items-center text-center"
//               >

//                 {/* Icon */}
//                 <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-ivory transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-gold/15 sm:mb-4 sm:h-16 sm:w-16 lg:h-20 lg:w-20">

//                   <Icon
//                     strokeWidth={1.5}
//                     className="h-5 w-5 text-gold transition-transform duration-300 group-hover:scale-110 sm:h-7 sm:w-7 lg:h-8 lg:w-8"
//                   />

//                 </div>

//                 {/* Title */}
//                 <h3 className="font-serif text-xs font-semibold text-chocolate sm:text-base lg:text-lg">
//                   {benefit.title}
//                 </h3>

//                 {/* Description */}
//                 <p className="mt-1 max-w-[160px] text-[10px] leading-4 text-chocolate/70 sm:mt-2 sm:text-sm sm:leading-5">
//                   {benefit.description}
//                 </p>

//               </div>
//             );
//           })}

//         </div>
//       </div>
//     </section>
//   );
// }

// export default ShoppingBenefits;




import {
  Truck,
  Gem,
  Headset,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    id: 1,
    icon: Truck,
    title: "Free Shipping",
    description: "On all orders",
    color: "bg-[#F4DED3]",
  },
  {
    id: 2,
    icon: Gem,
    title: "Premium Quality",
    description: "Carefully selected fabrics",
    color: "bg-[#E1E5D8]",
  },
  {
    id: 3,
    icon: Headset,
    title: "Customer Care",
    description: "We're here to help",
    color: "bg-[#E8DDEC]",
  },
  {
    id: 4,
    icon: ShieldCheck,
    title: "Secure Payments",
    description: "Safe online checkout",
    color: "bg-[#E2E8DE]",
  },
];

function ShoppingBenefits() {
  return (
    <section className="w-full bg-sand/40 py-8 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 gap-y-6 lg:grid-cols-4 lg:gap-y-0">

          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.id}
                className="group flex flex-col items-center px-2 text-center lg:border-r lg:border-gold/20 lg:px-5 lg:last:border-r-0"
              >

                {/* Pastel icon circle */}
                <div
                  className={`mb-2 flex h-11 w-11 items-center justify-center rounded-full sm:mb-3 sm:h-14 sm:w-14 ${benefit.color} transition-transform duration-300 group-hover:-translate-y-1`}
                >
                  <Icon
                    strokeWidth={1.5}
                    className="h-5 w-5 text-chocolate sm:h-6 sm:w-6"
                  />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xs font-medium tracking-wide text-chocolate sm:text-sm lg:text-base">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="mt-1 text-[10px] leading-4 text-taupe sm:text-xs">
                  {benefit.description}
                </p>

              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}

export default ShoppingBenefits;
