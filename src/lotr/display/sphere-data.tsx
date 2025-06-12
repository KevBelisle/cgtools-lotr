import Baggins from "@/lotr/icons/game icons/Baggins.svg?react";
import Fellowship from "@/lotr/icons/game icons/Fellowship.svg?react";
import Leadership from "@/lotr/icons/game icons/Leadership.svg?react";
import Lore from "@/lotr/icons/game icons/Lore.svg?react";
import Neutral from "@/lotr/icons/game icons/Neutral.svg?react";
import Spirit from "@/lotr/icons/game icons/Spirit.svg?react";
import Tactics from "@/lotr/icons/game icons/Tactics.svg?react";
import React from "react";

export function sphereData(sphere: string | null) {
  var backgroundColor = "";
  var borderColor = "";
  var SphereIcon = null as React.FC<React.SVGAttributes<SVGElement>> | null;

  switch (sphere) {
    case "Baggins":
      backgroundColor = "baggins.fg/10";
      borderColor = "baggins.fg";
      SphereIcon = Baggins;
      break;
    case "Fellowship":
      backgroundColor = "fellowship.fg/10";
      borderColor = "fellowship.fg";
      SphereIcon = Fellowship;
      break;
    case "Leadership":
      backgroundColor = "leadership.fg/10";
      borderColor = "leadership.fg";
      SphereIcon = Leadership;
      break;
    case "Lore":
      backgroundColor = "lore.fg/10";
      borderColor = "lore.fg";
      SphereIcon = Lore;
      break;
    case "Spirit":
      backgroundColor = "spirit.fg/10";
      borderColor = "spirit.fg";
      SphereIcon = Spirit;
      break;
    case "Tactics":
      backgroundColor = "tactics.fg/10";
      borderColor = "tactics.fg";
      SphereIcon = Tactics;
      break;
    case "Neutral":
      backgroundColor = "neutral.fg/10";
      borderColor = "sand.700";
      SphereIcon = Neutral;
      // (
      //   <div
      //     style={{
      //       fontSize: "35px",
      //       fontWeight: "bold",
      //       width: "35px",
      //       height: "35px",
      //     }}
      //   >
      //     <span
      //       style={{
      //         transform: "translate(6px, 10px)",
      //         display: "inline-block",
      //       }}
      //     >
      //       N
      //     </span>
      //   </div>
      // );
      break;
    default:
      backgroundColor = "night.800/10";
      borderColor = "night.800";
      break;
  }

  return {
    backgroundColor: backgroundColor,
    borderColor: borderColor,
    SphereIcon: SphereIcon,
  };
}

export default sphereData;
