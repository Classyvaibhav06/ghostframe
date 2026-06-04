import { cn } from "../../lib/utils";

export const BackgroundBeams = ({ className }) => {
  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden bg-black", className)}>
      <div className="absolute -top-[50%] -left-[10%] w-[120%] h-[150%] rounded-[100%] bg-[radial-gradient(circle_800px_at_50%_300px,#3b0764,transparent)] opacity-40 blur-[80px]"></div>
      <div className="absolute top-[20%] left-[60%] w-[80%] h-[80%] rounded-[100%] bg-[radial-gradient(circle_600px_at_50%_300px,#172554,transparent)] opacity-30 blur-[80px]"></div>
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1714558603/noise_d9o0s4.png')] opacity-[0.04] mix-blend-overlay pointer-events-none"></div>
    </div>
  );
};
