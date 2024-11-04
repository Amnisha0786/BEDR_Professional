import React, { useMemo, Suspense, lazy } from 'react';

interface IProps {
  className?: string;
  name: string;
  width?: number;
  height?: number;
  rotate?: number;
  alt?: string;
  color?: string;
}

const loadSVG = (fileName: string) =>
  lazy(async () => {
    let moduleComp;
    try {
      moduleComp = await import(`../../../public/assets/${fileName}.svg`);
    } catch (e) {
      moduleComp = await import('../../../public/assets/avatar.svg');
    }
    return typeof moduleComp.default === 'function'
      ? moduleComp
      : moduleComp.default;
  });

const Icon = ({
  className,
  name,
  height = 24,
  width = 24,
  alt,
  rotate = 0,
  color,
}: IProps) => {
  const SvgComponent = useMemo(() => loadSVG(name), [name]);

  return (
    <Suspense fallback={<div style={{ width, height }} />}>
      <SvgComponent
        className={className}
        alt={alt || 'icon'}
        width={width}
        height={height}
        fill={color}
        style={{
          transform: `rotate(${rotate}deg)`,
        }}
      />
    </Suspense>
  );
};

export default Icon;
