type TtypographyH1 = {
  children: React.ReactNode;
  center?: boolean;
  classname?: string;
  size?: number;
  onClick?: () => void;
};

export function TypographyH1({ children }: TtypographyH1) {
  return (
    <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
      {children}
    </h1>
  );
}
