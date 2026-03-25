import { motion } from "framer-motion";

const FloatingOrbs = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div
      className="absolute w-[600px] h-[600px] rounded-full opacity-100"
      style={{
        background: "radial-gradient(circle, rgba(14,86,250,0.15) 0%, transparent 70%)",
        top: "-10%",
        left: "-10%",
      }}
      animate={{
        x: [0, 120, 0],
        y: [0, 100, 0],
      }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="absolute w-[500px] h-[500px] rounded-full opacity-100"
      style={{
        background: "radial-gradient(circle, rgba(23,202,250,0.08) 0%, transparent 70%)",
        bottom: "-10%",
        right: "-10%",
      }}
      animate={{
        x: [0, -100, 0],
        y: [0, -80, 0],
      }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>
);

export default FloatingOrbs;
