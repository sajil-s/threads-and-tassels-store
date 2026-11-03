
import { Truck, Clock3, Flower2 } from "lucide-react";

function AnnouncementBar() {
  return (
    <div className="w-full bg-sage text-white">
      <div className="mx-auto flex min-h-10 max-w-7xl items-center justify-center gap-3 px-3 py-2 sm:gap-8">

        {/* Shipping information */}
        <div className="flex items-center gap-2">
          <Truck size={18} className="shrink-0" />

          <span className="text-[9px] uppercase tracking-wide sm:text-xs">
            Free Shipping on All Orders
          </span>
        </div>

        {/* Decorative flower - desktop only */}
        <Flower2
          size={22}
          className="hidden shrink-0 text-[#F5D7AD] sm:block"
        />

        {/* Delivery information */}
        <div className="flex items-center gap-2">
          <Clock3 size={18} className="shrink-0" />

          <span className="text-[9px] uppercase tracking-wide sm:text-xs">
            Delivery in 3-5 Days
          </span>
        </div>

      </div>
    </div>
  );
}

export default AnnouncementBar;
