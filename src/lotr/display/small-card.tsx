import { Card as GameCard } from "@/lotr/lotr-schema";
import { Link } from "@tanstack/react-router";

import Attack from "@/lotr/icons/game icons/Attack.svg?react";
import Defense from "@/lotr/icons/game icons/Defense.svg?react";
import HitPoints from "@/lotr/icons/game icons/HitPoints.svg?react";
import Threat from "@/lotr/icons/game icons/Threat.svg?react";
import Willpower from "@/lotr/icons/game icons/Willpower.svg?react";

import Baggins from "@/lotr/icons/game icons/Baggins.svg?react";
import Fellowship from "@/lotr/icons/game icons/Fellowship.svg?react";
import Leadership from "@/lotr/icons/game icons/Leadership.svg?react";
import Lore from "@/lotr/icons/game icons/Lore.svg?react";
import Spirit from "@/lotr/icons/game icons/Spirit.svg?react";
import Tactics from "@/lotr/icons/game icons/Tactics.svg?react";

import Unique from "@/lotr/icons/game icons/Unique.svg?react";

export const SmallCard = ({ card }: { card: GameCard }) => {
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
        fontSize: "small",
        fontFamily: "times, serif",
      }}
    >
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            fontFamily: "vafthrudnir",
            fontVariant: "small-caps",
            fontWeight: "normal",
            fontSize: "1.5rem",
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
              <div title={card.Front.Sphere}>{sphereIcon}</div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div
              title="Card type"
              style={{
                display: "inline-block",
                padding: "0.25rem 0.5rem",
                border: "1px solid #ccc",
                borderRadius: "0.25rem",
                marginRight: "0.5rem",
                fontFamily: "sans-serif",
              }}
            >
              {card.Front.Type}
              {card.Front.Subtype && ` - ${card.Front.Subtype}`}
            </div>
            {card.Front.ResourceCost != null && (
              <div
                title="Resource cost"
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginRight: "0.5rem",
                }}
              >
                <div style={{ display: "flex" }}>
                  <span>Cost:</span>
                  <span
                    style={{
                      fontFamily: "vafthrudnir",
                      transform: "translate(0, 3px)",
                    }}
                  >
                    {card.Front.ResourceCost}
                  </span>
                </div>
              </div>
            )}
            {card.Front.ThreatCost != null && (
              <div
                title="Threat cost"
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginRight: "0.5rem",
                }}
              >
                <Threat
                  style={{
                    display: "inline",
                    height: "1rem",
                    width: "1rem",
                  }}
                />{" "}
                {card.Front.ThreatCost}
              </div>
            )}
            {card.Front.QuestPoints != null && (
              <div
                title="Quest points"
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginRight: "0.5rem",
                }}
              >
                <Threat
                  style={{
                    display: "inline",
                    height: "1rem",
                    width: "1rem",
                  }}
                />{" "}
                {card.Front.QuestPoints}
              </div>
            )}
            {card.Front.EngagementCost != null && (
              <div
                title="Engagement cost"
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginRight: "0.5rem",
                }}
              >
                <Threat
                  style={{
                    display: "inline",
                    height: "1rem",
                    width: "1rem",
                  }}
                />{" "}
                {card.Front.EngagementCost}
              </div>
            )}
          </div>
          <div
            style={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
          >
            {card.Front.ThreatStrength != null && (
              <div
                title="Threat strength"
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginRight: "0.5rem",
                  fontFamily: "vafthrudnir",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  <span style={{ transform: "translate(0, 3px)" }}>
                    {card.Front.ThreatStrength}
                  </span>
                  <Threat
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                </div>
              </div>
            )}

            {card.Front.Willpower != null && (
              <div
                title="Willpower"
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginRight: "0.5rem",
                  fontFamily: "vafthrudnir",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  <span style={{ transform: "translate(0, 3px)" }}>
                    {card.Front.Willpower}
                  </span>
                  <Willpower
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                </div>
              </div>
            )}
            {card.Front.Attack != null && (
              <div
                title="Attack"
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginRight: "0.5rem",
                  fontFamily: "vafthrudnir",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  <span style={{ transform: "translate(0, 3px)" }}>
                    {card.Front.Attack}
                  </span>
                  <Attack
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                </div>
              </div>
            )}
            {card.Front.Defense != null && (
              <div
                title="Defense"
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginRight: "0.5rem",
                  fontFamily: "vafthrudnir",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  <span style={{ transform: "translate(0, 3px)" }}>
                    {card.Front.Defense}
                  </span>
                  <Defense
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                </div>
              </div>
            )}
            {card.Front.HitPoints != null && (
              <div
                title="Hit points"
                style={{
                  display: "inline-block",
                  padding: "0.25rem 0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "0.25rem",
                  marginRight: "0.5rem",
                  fontFamily: "vafthrudnir",
                }}
              >
                <div style={{ display: "flex", gap: "4px" }}>
                  <span style={{ transform: "translate(0, 3px)" }}>
                    {card.Front.HitPoints}
                  </span>
                  <HitPoints
                    style={{
                      width: "15px",
                      height: "15px",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <em
          style={{
            fontSize: "small",
            fontFamily: "times, serif",
          }}
        >
          {card.Front.Keywords.split(",").join(" ")}
          {card.Front.Keywords && card.Front.Traits && " - "}
          {card.Front.Traits.split(",").join(" ")}
        </em>
        {card.Front.Text && (
          <div
            style={{
              fontSize: "small",
              fontFamily: "times, serif",
              textWrap: "pretty",
            }}
          >
            {card.Front.Text.replaceAll('\\"', '"')
              .split("\\r\\n")
              .flatMap((str, index) => [str, <br key={index} />])}
          </div>
        )}
        {card.Front.VictoryPoints && (
          <div
            style={{
              fontSize: "small",
              fontFamily: "times, serif",
              textWrap: "pretty",
              fontWeight: "bold",
              alignSelf: "flex-end",
            }}
          >
            Victory {card.Front.VictoryPoints}.
          </div>
        )}
      </div>
    </div>
  );
};
