type Ttypography = {
  children: React.ReactNode;
  center?: boolean;
  classname?: string;
  size?: number;
  onClick?: () => void;
  noBottom?: boolean;
  primary?: boolean;
};

export function TypographyP({
  children,
  center,
  classname,
  size,
  noBottom = false,
  onClick,
  primary = false,
}: Ttypography) {
  return (
    <p
      className={`${!noBottom && 'mb-2'} font-medium leading-normal ${primary ? 'text-darkGray' : 'text-gray'} ${center && 'text-center'} ${size ? `text-[${size}px]` : 'text-[18px]'} ${classname}`}
      onClick={onClick}
    >
      {children}
    </p>
  );
}
