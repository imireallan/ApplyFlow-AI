import { useEffect, useState } from "react";
import type { User } from "~/types/user";

interface UserAvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  onClick?: () => void;
  className?: string;
}

export function UserAvatar({
  user,
  size = "md",
  showName = false,
  onClick,
  className = "",
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [user?.picture_url]);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const getInitials = () => {
    if (user?.full_name) {
      return user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }

    if (user?.email) {
      return user.email[0].toUpperCase();
    }

    return "U";
  };

  const showImage = user?.picture_url && !imageError;

  const avatar = (
    <div
      className={`
        ${sizeClasses[size]}
        rounded-full
        bg-gradient-to-br from-blue-500 to-indigo-600
        flex items-center justify-center
        text-white font-bold
        overflow-hidden
      `}
    >
      {showImage ? (
        <img
          src={user.picture_url}
          alt={user.full_name || user.email || "User"}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        getInitials()
      )}
    </div>
  );

  const name = user?.full_name?.split(" ")[0] || "User";

  const content = (
    <>
      {avatar}
      {showName && (
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {name}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        type="button"
        className={`flex items-center gap-2 cursor-pointer ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>{content}</div>
  );
}
