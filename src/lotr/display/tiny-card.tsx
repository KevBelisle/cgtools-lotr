import { Card as GameCard } from "@/lotr/lotr-schema";
import { Link } from "@tanstack/react-router";

import Baggins from "@/lotr/icons/game icons/Baggins.svg?react";
import Fellowship from "@/lotr/icons/game icons/Fellowship.svg?react";
import Leadership from "@/lotr/icons/game icons/Leadership.svg?react";
import Lore from "@/lotr/icons/game icons/Lore.svg?react";
import Spirit from "@/lotr/icons/game icons/Spirit.svg?react";
import Tactics from "@/lotr/icons/game icons/Tactics.svg?react";

import Unique from "@/lotr/icons/game icons/Unique.svg?react";
import React from "react";
import { arePropsEqual } from "./util";

export const TinyCard = React.memo(({ card }: { card: GameCard }) => {
  var sphereIcon = null;

  switch (card.Front.Sphere) {
    case "Baggins":
      sphereIcon = <Baggins style={{ width: "35px", height: "35px" }} />;
      break;
    case "Fellowship":
      sphereIcon = <Fellowship style={{ width: "35px", height: "35px" }} />;
      break;
    case "Leadership":
      sphereIcon = <Leadership style={{ width: "35px", height: "35px" }} />;
      break;
    case "Lore":
      sphereIcon = <Lore style={{ width: "35px", height: "35px" }} />;
      break;
    case "Spirit":
      sphereIcon = <Spirit style={{ width: "35px", height: "35px" }} />;
      break;
    case "Tactics":
      sphereIcon = <Tactics style={{ width: "35px", height: "35px" }} />;
      break;
    case "Neutral":
      sphereIcon = (
        <div
          style={{
            fontSize: "35px",
            fontWeight: "bold",
            width: "35px",
            height: "35px",
          }}
        >
          <span
            style={{
              transform: "translate(6px, 10px)",
              display: "inline-block",
            }}
          >
            N
          </span>
        </div>
      );
      break;
  }

  return (
    <div 
      style={{
        border: "2px solid #ccc",
        boxShadow: "0 0.5rem 2.5rem -2rem rgba(0, 0, 0, 0.5)",
        fontSize: "small",
        fontFamily: "times, serif"
      }}
    >
      <div 
        style={{ 
          padding: "16px", 
          paddingBottom: "8px", 
          display: "flex", 
          flexDirection: "column", 
          gap: "8px", 
          alignItems: "stretch" 
        }}
      >
        <div
          style={{
            fontFamily: "vafthrudnir",
            fontVariant: "small-caps",
            fontWeight: "normal",
            fontSize: "1.5rem"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Link to="/cards/$card-slug" params={{ "card-slug": card.Slug }}>
              <span>
                {card.Front.IsUnique ? (
                  <Unique
                    style={{
                      display: "inline",
                      height: "1.4rem",
                      width: "1.4rem",
                    }}
                  />
                ) : (
                  ""
                )}{" "}
                {card.Front.Stage ? (
                  <span style={{ fontSize: "1.25rem", color: "#a89984" }}>
                    {card.Front.Stage}
                  </span>
                ) : (
                  ""
                )}{" "}
                {card.Front.Title}
              </span>
            </Link>
            {card.Front.Sphere && (
              <div title={card.Front.Sphere} style={{ marginTop: "-8px" }}>
                {sphereIcon}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}, arePropsEqual);
