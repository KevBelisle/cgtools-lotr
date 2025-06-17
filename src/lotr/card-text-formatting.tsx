import regexifyString from "regexify-string";

//import { Baggins } from '@/lotr/icons/game icons/Baggins.svg?react'
//import { Fellowship } from '@/lotr/icons/game icons/Fellowship.svg?react'
import Leadership from "@/lotr/icons/game icons/Leadership.svg?react";
import Lore from "@/lotr/icons/game icons/Lore.svg?react";
import Spirit from "@/lotr/icons/game icons/Spirit.svg?react";
import Tactics from "@/lotr/icons/game icons/Tactics.svg?react";

import Attack from "@/lotr/icons/game icons/Attack.svg?react";
import Defense from "@/lotr/icons/game icons/Defense.svg?react";
import HitPoints from "@/lotr/icons/game icons/HitPoints.svg?react";
import SauronsEye from "@/lotr/icons/game icons/SauronsEye.svg?react";
import Threat from "@/lotr/icons/game icons/Threat.svg?react";
import Willpower from "@/lotr/icons/game icons/Willpower.svg?react";

const formatNumber = (value: number) =>
  value === 255 ? "-" : value === 254 ? "X" : value === 253 ? "✽" : value;

const svgStyle: React.CSSProperties = {
  width: "1rem",
  height: "1rem",
  display: "inline",
  position: "relative",
  top: "-0.125rem",
};

const textReplacements = [
  {
    pattern: /When Revealed:/,
    replacement: <b>When Revealed:</b>,
  },
  {
    pattern: /Setup:/,
    replacement: <b>Setup:</b>,
  },
  {
    pattern: /Valour Planning Action:/,
    replacement: <b>Valour Planning Action:</b>,
  },
  {
    pattern: /Planning Action:/,
    replacement: <b>Planning Action:</b>,
  },
  {
    pattern: /Valour Action:/,
    replacement: <b>Valour Action:</b>,
  },
  {
    pattern: /Combat Action:/,
    replacement: <b>Combat Action:</b>,
  },
  {
    pattern: /Quest Action:/,
    replacement: <b>Quest Action:</b>,
  },
  {
    pattern: /Action:/,
    replacement: <b>Action:</b>,
  },
  {
    pattern: /Forced:/,
    replacement: <b>Forced:</b>,
  },
  {
    pattern: /Travel:/,
    replacement: <b>Travel:</b>,
  },
  {
    pattern: /Valour Response:/,
    replacement: <b>Valour Response:</b>,
  },
  {
    pattern: /Response:/,
    replacement: <b>Response:</b>,
  },
  {
    pattern: /Attack(?=\W)/,
    replacement: <Attack style={{ ...svgStyle }} />,
  },
  {
    pattern: /Defense(?=\W)/,
    replacement: <Defense style={{ ...svgStyle }} />,
  },
  {
    pattern: /Hit Points(?=\W)/,
    replacement: <HitPoints style={{ ...svgStyle }} />,
  },
  {
    pattern: /Threat(?=\W)/,
    replacement: <Threat style={{ ...svgStyle }} />,
  },
  {
    pattern: /Willpower(?=\W)/,
    replacement: <Willpower style={{ ...svgStyle }} />,
  },
  {
    pattern: /\(\|\)/,
    replacement: <SauronsEye style={{ ...svgStyle }} />,
  },

  {
    pattern: /Leadership/,
    replacement: <Leadership style={{ ...svgStyle }} />,
  },
  {
    pattern: /Lore/,
    replacement: <Lore style={{ ...svgStyle }} />,
  },
  {
    pattern: /Spirit/,
    replacement: <Spirit style={{ ...svgStyle }} />,
  },
  {
    pattern: /Tactics/,
    replacement: <Tactics style={{ ...svgStyle }} />,
  },
];

const formatCardText = (text: string) => {
  let output: (string | Element)[] = [text];

  textReplacements.forEach(({ pattern, replacement }) => {
    output = output.flatMap((part) => {
      if (typeof part !== "string") return [part] as (string | Element)[];

      return regexifyString({
        pattern,
        decorator: () => replacement,
        input: part,
      }) as (string | Element)[];
    });
  });

  return <>{output}</>;
};

export { formatCardText, formatNumber };
