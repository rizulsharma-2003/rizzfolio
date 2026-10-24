import { LayoutGroup, motion } from 'motion/react'
import { SPRING_SNAPPY } from '../lib/motion'

/** iOS segmented control — the selection slides between options. `id` must be unique per page. */
export default function Segmented({ id, label, options, value, onChange }) {
  return (
    <LayoutGroup id={id}>
      <div role="tablist" aria-label={label} className="no-scrollbar inline-flex max-w-full overflow-x-auto rounded-full bg-white/[0.08] p-1">
        {options.map((option) => {
          const selected = option.id === value
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onChange(option.id)}
              className={`relative shrink-0 rounded-full px-2 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors duration-300 sm:px-4 md:px-5 md:text-[14px] ${
                selected ? 'text-fog' : 'text-fog/60 hover:text-fog'
              }`}
            >
              {selected && (
                <motion.span
                  layoutId="segment"
                  transition={SPRING_SNAPPY}
                  className="absolute inset-0 rounded-full bg-[#636366] shadow-[0_3px_8px_rgba(0,0,0,0.3)]"
                />
              )}
              <span className="relative">
                {option.label} {option.count != null && <span className="text-fog/45 tabular-nums">{option.count}</span>}
              </span>
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
