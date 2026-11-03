
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Flower2 } from "lucide-react";

const flowers = [
  { x: -180, y: -130, delay: 0, size: 22 },
  { x: 170, y: -110, delay: 0.15, size: 18 },
  { x: -150, y: 120, delay: 0.3, size: 16 },
  { x: 190, y: 100, delay: 0.1, size: 24 },
  { x: -70, y: -190, delay: 0.25, size: 14 },
  { x: 90, y: 170, delay: 0.4, size: 18 },
];
function IntroAnimation({ show }) {
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ivory px-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.6 }}
        >

{!reducedMotion && (
  <div
    className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
    aria-hidden="true"
  >
    {flowers.map((flower, index) => (
      <motion.div
        key={index}
        className="absolute text-gold/70"
        initial={{
          opacity: 0,
          x: flower.x,
          y: flower.y,
          scale: 0.5,
          rotate: -45,
        }}
        animate={{
          opacity: [0, 0.9, 0],
          x: flower.x * 0.35,
          y: flower.y * 0.35,
          scale: [0.5, 1, 0.7],
          rotate: 90,
        }}
        transition={{
          duration: 2.4,
          delay: flower.delay,
          ease: "easeInOut",
        }}
      >
        <Flower2 size={flower.size} strokeWidth={1.2} />
      </motion.div>
    ))}
  </div>
)}



          <motion.img
            src="/images/logo/intro-logo.png"
            alt="Threads & Tassels"
            className="w-[230px] max-w-[75vw] sm:w-[340px] lg:w-[420px]"
            initial={
              reducedMotion
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.75, y: 20 }
            }
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: reducedMotion ? 0 : 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IntroAnimation;
