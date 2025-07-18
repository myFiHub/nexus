import { Loader } from "app/components/Loader";
import { motion } from "framer-motion";

export const JoiningStatus = () => {
  return (
    <div className=" inset-0 flex items-center justify-center z-10 bg-background/80 backdrop-blur-sm  absolute w-full h-[100vh] -top-[270px]">
      <div className="flex flex-col items-center gap-4">
        <Loader className="w-8 h-8 text-foreground" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">
            setting up the Outpost...
          </h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we connect you to the outpost...
          </p>
        </motion.div>

        <motion.div
          className="w-48 h-1 bg-muted rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "95%" }}
            transition={{
              duration: 8,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};
