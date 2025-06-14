import { SvgIcon } from "@/components/ui/svg-icon";
import { Tag } from "@/components/ui/tag";
import { Card, type HTMLChakraProps, Image } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { Product } from "../lotr-schema";

function ProductCard({
  product,
  ...rootProps
}: { product: Product } & HTMLChakraProps<"div">) {
  return (
    <Card.Root size="sm" flexDirection="row" {...rootProps}>
      <Image
        objectFit="contain"
        maxW="20%"
        minH="120px"
        minW="120px"
        src={`./product-images/${product.Code.toLowerCase()}_main.png`}
        aspectRatio={1}
        padding={2}
        paddingRight={0}
      />
      <Card.Body gap="2">
        <Card.Title fontFamily="ringbearer" fontWeight="normal" fontSize="lg">
          {product.ExpansionSymbol ? (
            <>
              <SvgIcon
                src={`/src/assets/expansion%20symbols/${product.ExpansionSymbol}?react`}
                width="1.4em"
                height="1.4em"
                style={{ display: "inline-block" }}
              />{" "}
            </>
          ) : null}
          <Link
            to="/products/$product-code"
            params={{ "product-code": product.Code }}
          >
            {product.Name}
          </Link>
        </Card.Title>
        <Card.Description>
          <Tag
            as="span"
            size="md"
            float="left"
            fontFamily="sans-serif"
            variant="subtle"
            mr={2}
          >
            {product.Code}
          </Tag>
          Released on {product.FirstReleased}.
        </Card.Description>
      </Card.Body>
    </Card.Root>
  );
}

export { ProductCard };
