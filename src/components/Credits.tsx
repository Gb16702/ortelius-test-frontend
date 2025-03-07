import { useEffect, useState } from "react";
import clsx from "clsx";
import { User } from "../stores/userStore";

type CreditsProps = {
  user: User;
};

const Credits: React.FC<CreditsProps> = ({ user }) => {
  const [animatedCredits, setAnimatedCredits] = useState(user ? user.credits : 0);

  useEffect(() => {
    if (!user) return;

    if (user.credits < animatedCredits) {
      let current = animatedCredits;
      const interval = setInterval(() => {
        current--;
        setAnimatedCredits(current);

        if (current <= user.credits) {
          clearInterval(interval);
        }
      }, 30);

      return () => clearInterval(interval);
    } else {
      setAnimatedCredits(user.credits);
    }
  }, [user?.credits]);

  return (
    <h1
      className={clsx("text-sm text-black font-medium", {
        "text-red-400": user && user.credits <= 0,
      })}>
      {animatedCredits} credits left
    </h1>
  );
};

export default Credits;
