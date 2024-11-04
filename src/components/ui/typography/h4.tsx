type TtypographyH4 = {
  children: React.ReactNode;
  center?: boolean;
  classname?: string;
  size?: number;
  onClick?: () => void;
};

export function TypographyH4({
  children,
  center,
  size,
  classname,
}: TtypographyH4) {
  return (
    <h4
      className={`${size ? `text-[${size}px]` : 'text-[1.6rem]'} font-medium text-darkGray ${center && 'text-center'} ${classname}`}
    >
      {children}
    </h4>
  );
}
