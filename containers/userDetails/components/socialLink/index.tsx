import { generateXUrl } from "app/lib/openSocialPage";
import { User } from "app/services/api/types";
import Image from "next/image";
import Link from "next/link";

interface SocialLinkProps {
  user: User;
}

export const SocialLink = ({ user }: SocialLinkProps) => {
  if (user.login_type === "twitter" && user.login_type_identifier) {
    return (
      <Link
        href={generateXUrl(user.login_type_identifier)}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 px-4 py-2 bg-card text-foreground border border-border rounded-xl font-medium transition-all duration-300 ease-out hover:bg-accent hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 mt-2"
        aria-label={`Visit ${user.name || "User"}'s X profile`}
      >
        <div className="relative w-5 h-5 transition-transform duration-300 group-hover:rotate-12">
          <Image
            src="/social_login_icons/x_platform.png"
            alt="X (Twitter)"
            fill
            className="object-contain dark:filter dark:brightness-0 dark:invert"
          />
        </div>
        <span className="text-sm font-semibold">View on X</span>
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </Link>
    );
  }

  return null;
};
