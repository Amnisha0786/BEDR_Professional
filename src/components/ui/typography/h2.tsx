type TtypographyH2 = {
  children: React.ReactNode;
  center?: boolean;
  classname?: string;
  size?: number;
  onClick?: () => void;
};

export function TypographyH2({
  children,
  center,
  size,
  classname,
}: TtypographyH2) {
  return (
    <h2
      className={`${size ? `text-[${size}px]` : 'text-[1.6rem]'} font-semibold text-darkGray ${center && 'text-center'} ${classname}`}
    >
      {children}
    </h2>
  );
}
