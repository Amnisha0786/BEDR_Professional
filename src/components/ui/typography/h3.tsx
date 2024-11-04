type TtypographyH3 = {
  children: React.ReactNode;
  center?: boolean;
  classname?: string;
  size?: number;
  onClick?: () => void;
};

export function TypographyH3({ children }: TtypographyH3) {
  return (
    <h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
      {children}
    </h3>
  );
}
