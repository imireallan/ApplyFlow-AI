import { useState } from "react";
import type { User } from "~/types/user";

interface UserAvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * UserAvatar - A reusable avatar component that displays user profile picture or initials
 *
 * @param user - The user object containing profile data
 * @param size - Size of the avatar: "sm" (32px), "md" (40px), "lg" (48px)
 * @param showName - Whether to show the user's first name next to the avatar
 * @param onClick - Optional click handler for interactive avatars
 * @param className - Additional CSS classes
 */
export function UserAvatar({
  user,
  size = "md",
  showName = false,
  onClick,
  className = "",
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Debug: Log user data when component renders
  console.log("UserAvatar - user data:", user);
  console.log("UserAvatar - picture_url:", user?.picture_url);

  // Get initials from user name or email
  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  // Size classes
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const initialsSizeClasses = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  const sizeClass = sizeClasses[size];
  const initialsClass = initialsSizeClasses[size];
  const hasPicture = !!user?.picture_url && !imageError;

  const avatarContent = hasPicture ? (
    <img
      src={user.picture_url!}
      alt={user.full_name || user.email || "User"}
      className="w-full h-full object-cover"
      onError={() => {
        console.log("Image failed to load:", user.picture_url);
        setImageError(true);
      }}
    />
  ) : (
    <span className={initialsClass}>{getInitials()}</span>
  );

  const Container = onClick ? "button" : "div";

  return (
    <Container
      onClick={onClick}
      className={`
        flex items-center gap-2 
        ${onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""} 
        ${className}
      `}
      type={onClick ? "button" : undefined}
    >
      <div
        className={`
          ${sizeClass} 
          rounded-full 
          bg-gradient-to-br from-blue-500 to-indigo-600 
          flex items-center justify-center 
          text-white font-bold 
          shadow-md 
          ${onClick ? "hover:shadow-lg hover:scale-105 transition-all" : ""}
          overflow-hidden
        `}
      >
        {avatarContent}
      </div>

      {showName && (
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {user?.first_name?.split(" ")[0] || "User"}
        </span>
      )}
    </Container>
  );
}
