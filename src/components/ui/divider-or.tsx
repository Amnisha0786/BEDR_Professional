type Tdivider = {
  size?: string;
};

export function DividerWithOr({ size }: Tdivider) {
  return (
    <div
      className={`flex items-center justify-center ${size ? size : 'w-1/2'} m-auto`}
    >
      <div className='flex-1 border-t-[1px] border-lightGray'></div>
      <span className='bg-white px-3 text-[12px] text-gray'>or</span>
      <div className='flex-1 border-t-[1px] border-lightGray'></div>
    </div>
  );
}
