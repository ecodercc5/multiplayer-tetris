import { motion } from "framer-motion";
import { useState } from "react";
import { IUser } from "../core/user";
import { Button } from "./Button";

interface Props {
  player: IUser;
  onChallenge: (player: IUser) => any;
}

export const PlayerCard: React.FC<Props> = ({ player, onChallenge }) => {
  const [isHovered, setIsHovered] = useState(false);

  const joined = player.joined;
  const hours24 = joined.getHours();
  const hours = hours24 > 12 ? hours24 - 12 : hours24;
  const timeOfDay = hours24 < 12 ? "am" : "pm";
  const minutes = joined.getMinutes();

  const time = `${hours}:${minutes}${timeOfDay}`;

  return (
    <motion.div
      className="flex flex-col items-center justify-center bg-zinc-50 w-[230px] h-[175px] 
                 rounded-md border border-zinc-200 py-2 px-2 cursor-pointer
                 transition
                 hover:shadow-[0_2px_10px_0_rgba(0,0,0,0.1)]
                 "
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div layout className="text-center m-auto">
        <p className="text-lg font-semibold text-zinc-900 mb-0.5">
          {player.username}
        </p>
        <p className="text-zinc-400 text-sm">Joined {time}</p>
      </motion.div>

      {isHovered && (
        <Button
          className="w-full"
          initial={{ y: -4, opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.01 }}
          onClick={() => onChallenge(player)}
        >
          Challenge
        </Button>
      )}
    </motion.div>
  );
};
