export const Cross = ({ onClick }: { onClick: () => void }) => {
  return (
    <>
      <button
        type="button"
        className="rounded-full w-[28px] h-[28px] flex items-center justify-center bg-[#FF0000]/[.15] relative cursor-pointer focus:outline-red-400"
        onClick={onClick}>
        <span className="w-[30%] bg-[#FF0000] h-[1px] rounded-full rotate-45 absolute"></span>
        <span className="w-[30%] bg-[#FF0000] h-[1px] rounded-full -rotate-45 absolute"></span>
      </button>
    </>
  );
};
