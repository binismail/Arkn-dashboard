"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useUserSession } from "@/hooks/useUserSession";

export default function FinalCTA() {
  const { isLoggedIn } = useUserSession();

  return (
    <section className="py-32 px-6 font-sans">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-[32px] md:text-[40px] font-semibold text-gray-950 tracking-[-0.02em] leading-[1.1]"
        >
          Your team already trusts AI.
          <br />
          Make sure AI deserves that trust.
        </motion.h2>

        {/* Auth-Aware Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="h-11 px-6 bg-[#1A5C38] hover:bg-[#113f25] text-white text-[14px] font-semibold rounded-lg flex items-center justify-center transition-colors"
            >
              Go to Dashboard &rarr;
            </Link>
          ) : (
            <Link
              href="/register"
              className="h-11 px-6 bg-[#1A5C38] hover:bg-[#113f25] text-white text-[14px] font-semibold rounded-lg flex items-center justify-center transition-colors"
            >
              Create workspace
            </Link>
          )}
          <a
            href="#onboarding"
            className="h-11 px-6 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 text-[14px] font-semibold rounded-lg flex items-center justify-center transition-colors"
          >
            Download extension
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-[13px] text-gray-400 font-normal"
        >
          Free for teams up to 5 members. No credit card required.
        </motion.p>
      </div>
    </section>
  );
}
