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

export const FullCard = ({ card }: { card: GameCard }) => {
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
        fontFamily: "times, serif",
      }}
    >
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "stretch",
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
                )}
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
              <div title={card.Front.Sphere} style={{ marginTop: "-4px" }}>
                {sphereIcon}
              </div>
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
        <em style={{ fontStyle: "italic" }}>
          {card.Front.Keywords.split(",").join(" ")}
          {card.Front.Keywords && card.Front.Traits && " - "}
          {card.Front.Traits.split(",").join(" ")}
        </em>
        {card.Front.Text && (
          <div style={{ textWrap: "pretty" }}>
            {card.Front.Text.replaceAll('\\"', '"')
              .split("\\r\\n")
              .flatMap((str, index) => [str, <br key={index} />])}
          </div>
        )}
        {card.Front.VictoryPoints && (
          <div
            style={{
              textWrap: "pretty",
              fontWeight: "bold",
              alignSelf: "flex-end",
            }}
          >
            Victory {card.Front.VictoryPoints}.
          </div>
        )}
        {(card.Front.Text || card.Front.VictoryPoints) &&
        card.Front.FlavorText ? (
          <hr
            style={{
              border: "none",
              borderTop: "1px dotted #ccc",
              margin: "8px 0",
            }}
          />
        ) : null}
        {card.Front.FlavorText && (
          <div style={{ textWrap: "pretty", fontStyle: "italic" }}>
            {card.Front.FlavorText.replaceAll('\\"', '"')
              .split("\\r\\n")
              .flatMap((str, index) => [str, <br key={index} />])}
          </div>
        )}

        <div style={{ margin: "0 -16px" }}>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #ccc",
              margin: "8px 0",
            }}
          />
        </div>
        <ul
          style={{
            listStyleType: "none",
            fontFamily: "sans-serif",
            padding: 0,
            margin: 0,
          }}
        >
          {card.ProductCards?.sort((a, _) =>
            a.Product.IsRepackage ? 1 : -1,
          ).map((pc) => (
            <li key={`${pc.Product.Code}-${pc.Number}`}>
              {pc.Product.IsRepackage ? (
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: "rgba(0, 128, 128, 0.1)",
                    color: "#008080",
                    padding: "0.25rem",
                    width: "2rem",
                    position: "relative",
                    top: "2px",
                    textAlign: "center",
                    borderRadius: "0.25rem",
                    fontSize: "smaller",
                  }}
                >
                  RC
                </div>
              ) : (
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: "rgba(255, 0, 0, 0.1)",
                    color: "#ff0000",
                    padding: "0.25rem",
                    width: "2rem",
                    position: "relative",
                    top: "2px",
                    textAlign: "center",
                    borderRadius: "0.25rem",
                    fontSize: "smaller",
                  }}
                >
                  OG
                </div>
              )}{" "}
              {pc.Quantity}x in {pc.Product.Name}{" "}
              {pc.Product.Cycle && !pc.Product.IsRepackage && (
                <span style={{ color: "#a89984" }}>
                  ({pc.Product.Cycle} cycle)
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
