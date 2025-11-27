import { cva } from 'class-variance-authority';

export const hoverLift = "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg";
export const hoverScale = "transition-transform duration-300 hover:scale-[1.02]";
export const hoverGlow = "transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(255,107,53,0.4)]";

export const gradients = {
    construction: "bg-[linear-gradient(135deg,#f97316_0%,#ea580c_100%)]",
    steel: "bg-[linear-gradient(135deg,#64748b_0%,#475569_100%)]",
    warm: "bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_100%)]",
};

export const shadows = {
    construction: "shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]",
    steel: "shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]",
};

export const cardStyles = cva(
    "bg-white rounded-3xl shadow-xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800",
    {
        variants: {
            padding: {
                default: "p-8",
                sm: "p-4",
                lg: "p-10",
            },
        },
        defaultVariants: {
            padding: "default",
        },
    }
);
