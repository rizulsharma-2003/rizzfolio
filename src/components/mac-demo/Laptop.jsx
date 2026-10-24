/** A MacBook: bezel, notch and base. `children` fill the screen. */
export default function Laptop({ screenRef, children }) {
  return (
    <>
      <div
        ref={screenRef}
        className="relative aspect-[16/10] rounded-[2.4%/3.8%] bg-black p-[1.3%] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_60px_120px_-40px_rgba(0,0,0,1)]"
      >
        <div className="size-full overflow-hidden rounded-[1%/1.6%]">{children}</div>
        <span aria-hidden className="absolute top-[1.3%] left-1/2 h-[2.2%] w-[9%] -translate-x-1/2 rounded-b-[6px] bg-black" />
      </div>
      <div
        aria-hidden
        className="relative left-1/2 h-[clamp(8px,1.5vw,16px)] w-[114%] -translate-x-1/2 rounded-t-[2px] rounded-b-[18px] bg-gradient-to-b from-[#45454a] via-[#222226] to-[#0c0c0e]"
      >
        <span className="absolute top-0 left-1/2 h-[38%] w-[13%] -translate-x-1/2 rounded-b-[8px] bg-[#0c0c0e]/80" />
      </div>
    </>
  )
}
