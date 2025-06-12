import React, { Suspense } from "react";

export const SvgIcon: React.FC<
  React.SVGAttributes<SVGSVGElement> & { src: string }
> = (props) => {
  let { src, ...svgProps } = props;
  const SvgComponent = React.lazy(() =>
    import(src)
      .then((module) => {
        return module;
      })
      .catch(
        () => ({ default: () => <svg {...svgProps}></svg> }), // Fallback to an empty SVG
      ),
  );

  svgProps = { width: "1em", height: "1em", ...svgProps };

  return (
    <Suspense fallback={<svg {...svgProps}></svg>}>
      <SvgComponent {...svgProps} />
    </Suspense>
  );
};
