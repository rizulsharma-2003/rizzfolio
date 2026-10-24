import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUp, ChevronRight, CircleCheck, FaceSlightlySmiling, Info, Plus, Search, Users } from 'lucide-react'
import MacWindow from '../../MacWindow'
import { Cursor } from '../../Desktop'
import { useStoryboard } from '../../useStoryboard'
import { ACCENT, FileGlyph, Header, INCOMING, MESSAGE_BLUE, PINK, Stage, VIOLET } from './shared'

const FRAME = { x: 9, y: 5.2, w: 82, h: 50.8 }
const DRAFT = 'Just sent it 🙌'
// EmojiCatalog.tapbacks
const TAPBACKS = ['❤️', '👍', '👎', '😂', '‼️', '❓']
const SPRING = { type: 'spring', stiffness: 420, damping: 32 }

// settle · type · send · they're typing · reply + read · react · hold
const STEPS = [1.0, 1.5, 0.6, 1.4, 1.4, 1.9, 1.8]

/** DeskDrop's Messages: bubbles with tails, typing, read receipts, tapbacks and files in the chat. */
export default function MessagesChapter() {
  const step = useStoryboard(STEPS, { delay: 0.9 })
  const draft = useTyping(DRAFT, step === 1)
  const sent = step >= 2
  const typing = step === 3
  const replied = step >= 4
  const reacting = step === 5
  const reacted = step >= 6

  const preview = replied ? 'Looks great, thanks!' : sent ? DRAFT : '📎 Q3 Report.pdf'

  return (
    <div className="absolute inset-0">
      <MacWindow frame={FRAME} app="deskdrop" chrome="bare" className="bg-transparent">
        <Stage />
        <Header tab="messages" />
        <div className="absolute inset-x-[0.9cqw] top-[3.7cqw] bottom-[0.9cqw] flex gap-[0.9cqw]">
          <Sidebar preview={preview} time={replied ? '3:41 PM' : '3:38 PM'} />

          <div className="relative min-w-0 flex-1 overflow-hidden rounded-[1.4cqw] bg-[#1e1e1e] ring-1 ring-white/[0.08]">
            <ConversationHeader />

            <motion.div layout className="absolute inset-x-[1.6cqw] top-[7.4cqw] bottom-[4.6cqw] flex flex-col justify-end gap-[0.45cqw]">
              <p className="pb-[0.4cqw] text-center text-[0.82cqw] text-white/45">
                <span className="font-semibold">Today</span> 3:38 PM
              </p>
              <Incoming text="Did the deck land?" />
              <FileCard />
              <AnimatePresence initial={false}>
                {sent && (
                  <motion.div key="mine" layout initial={{ opacity: 0, y: 14, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={SPRING} className="flex flex-col items-end">
                    <Bubble outgoing tail>
                      {DRAFT}
                    </Bubble>
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.p
                        key={replied ? 'read' : 'delivered'}
                        initial={{ opacity: 0, y: -3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-[0.15cqw] pr-[0.3cqw] text-[0.82cqw] font-medium text-white/45"
                      >
                        {replied ? 'Read 3:41 PM' : 'Delivered'}
                      </motion.p>
                    </AnimatePresence>
                  </motion.div>
                )}
                {typing && (
                  <motion.div key="typing" layout initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={SPRING} className="origin-bottom-left pl-[2.7cqw]">
                    <TypingIndicator />
                  </motion.div>
                )}
                {replied && (
                  <motion.div key="reply" layout initial={{ opacity: 0, y: 12, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={SPRING} className="relative pt-[1.4cqw]">
                    <Incoming text="Looks great, thanks!" reaction={reacted ? '❤️' : null} reacting={reacting} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <MessageBar draft={draft} />

            {reacting && (
              <Cursor initial={{ left: '62%', top: '70%' }} animate={{ left: '24%', top: '79%' }} transition={{ duration: 0.5, ease: 'easeInOut' }} />
            )}
          </div>
        </div>
      </MacWindow>
    </div>
  )
}

/** Types `text` out once `active` turns true; returns what's in the field. */
function useTyping(text, active) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    const chars = [...text]
    let i = 0
    const id = setInterval(() => {
      i += 1
      setCount(i)
      if (i >= chars.length) clearInterval(id)
    }, 70)
    return () => clearInterval(id)
  }, [active, text])
  return active ? [...text].slice(0, count).join('') : ''
}

function Avatar({ initials, colors, size = 2.7, icon: Icon }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{ width: `${size}cqw`, height: `${size}cqw`, fontSize: `${size * 0.38}cqw`, background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
    >
      {Icon ? <Icon style={{ width: `${size * 0.42}cqw`, height: `${size * 0.42}cqw` }} strokeWidth={2.4} /> : initials}
    </span>
  )
}

function Sidebar({ preview, time }) {
  const rows = [
    { name: 'Everyone nearby', preview: 'Alex: Lunch at 1?', time: '2:10 PM', colors: [ACCENT, VIOLET], icon: Users },
    { name: 'Priya’s Mac', preview, time, colors: [VIOLET, PINK], initials: 'P', selected: true },
    { name: 'Alex’s Mac', preview: 'Can you send the mockups?', time: '1:52 PM', colors: ['#52D1F5', ACCENT], initials: 'A', unread: 2 },
  ]
  return (
    <div className="w-[21.75cqw] shrink-0 rounded-[1.8cqw] bg-white/[0.06] p-[0.75cqw] shadow-[0_0.6cqw_1.4cqw_rgba(0,0,0,0.3)] ring-1 ring-white/10">
      <div className="mx-[0.3cqw] mt-[0.3cqw] flex h-[2.4cqw] items-center gap-[0.45cqw] rounded-full bg-white/[0.11] px-[0.8cqw] text-[0.98cqw] text-white/45 ring-1 ring-white/[0.16]">
        <Search className="size-[0.95cqw]" strokeWidth={2.2} /> Search
      </div>
      <div className="mt-[0.7cqw] space-y-[0.25cqw]">
        {rows.map((row) => (
          <div key={row.name} className={`flex items-center gap-[0.7cqw] rounded-[0.9cqw] px-[0.6cqw] py-[0.6cqw] ${row.selected ? 'bg-[#0a84ff]' : ''}`}>
            <Avatar initials={row.initials} colors={row.colors} icon={row.icon} />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="flex items-baseline justify-between gap-[0.4cqw]">
                <p className={`truncate text-[0.98cqw] ${row.unread ? 'font-bold' : 'font-semibold'} text-white`}>{row.name}</p>
                <p className={`shrink-0 text-[0.8cqw] ${row.selected ? 'text-white/80' : row.unread ? 'font-semibold text-[#0a84ff]' : 'text-white/45'}`}>{row.time}</p>
              </div>
              <div className="mt-[0.2cqw] flex items-center gap-[0.4cqw]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={row.preview}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`min-w-0 flex-1 truncate text-[0.9cqw] ${row.selected ? 'text-white/85' : row.unread ? 'font-medium text-white/80' : 'text-white/50'}`}
                  >
                    {row.preview}
                  </motion.p>
                </AnimatePresence>
                {row.unread && (
                  <span className="grid h-[1.3cqw] min-w-[1.3cqw] place-items-center rounded-full bg-[#0a84ff] px-[0.3cqw] text-[0.8cqw] font-bold text-white">
                    {row.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** The avatar with the name in a glass pill beneath it, and a round glass button on the right. */
function ConversationHeader() {
  return (
    <>
      <div className="absolute inset-x-0 top-[0.9cqw] flex flex-col items-center">
        <span className="relative z-10">
          <Avatar initials="P" colors={[VIOLET, PINK]} size={3} />
          <span className="absolute -right-[0.05cqw] -bottom-[0.05cqw] size-[0.9cqw] rounded-full border-[0.15cqw] border-[#1e1e1e] bg-[#45CC87]" />
        </span>
        <div className="-mt-[0.4cqw] rounded-full bg-white/[0.08] px-[1.05cqw] pt-[0.55cqw] pb-[0.35cqw] text-center ring-1 ring-white/10">
          <p className="flex items-center justify-center gap-[0.2cqw] text-[0.9cqw] font-semibold text-white">
            Priya’s Mac <ChevronRight className="size-[0.6cqw] text-white/50" strokeWidth={3} />
          </p>
          <p className="text-[0.79cqw] text-white/50">Available</p>
        </div>
      </div>
      <span className="absolute top-[1.1cqw] right-[1.1cqw] grid size-[2.4cqw] place-items-center rounded-full bg-white/[0.08] text-white/80 ring-1 ring-white/10">
        <Info className="size-[1cqw]" strokeWidth={2.4} />
      </span>
    </>
  )
}

/** Views/Chat/BubbleShape.swift: a rounded bubble whose last one in a run curls into a tail. */
function Bubble({ outgoing = false, tail = false, children }) {
  const fill = outgoing ? MESSAGE_BLUE : INCOMING
  return (
    <span className="relative inline-block max-w-[26cqw] rounded-[1.27cqw] px-[0.9cqw] py-[0.52cqw] text-[1.05cqw] leading-snug text-white" style={{ background: fill }}>
      {children}
      {tail && (
        <svg
          viewBox="0 0 17 17.5"
          className="absolute bottom-0 h-[1.31cqw] w-[1.28cqw]"
          style={outgoing ? { right: '-0.375cqw' } : { left: '-0.375cqw', transform: 'scaleX(-1)' }}
        >
          <path d="M12 0 C12 11 14 15.5 17 17 C10 17.5 5 16.5 0 14 L0 0 Z" fill={fill} />
        </svg>
      )}
    </span>
  )
}

function Incoming({ text, reaction, reacting }) {
  return (
    <div className="relative flex items-end gap-[0.6cqw]">
      <Avatar initials="P" colors={[VIOLET, PINK]} size={2.1} />
      <div className="relative">
        <Bubble tail>{text}</Bubble>
        <AnimatePresence>
          {reacting && (
            <motion.div
              key="bar"
              className="absolute bottom-full left-0 z-20 mb-[0.5cqw] flex items-center gap-[0.15cqw] rounded-full bg-[#2c2c2e]/95 p-[0.45cqw] shadow-[0_0.6cqw_1.6cqw_rgba(0,0,0,0.5)] ring-1 ring-white/10"
              initial={{ opacity: 0, scale: 0.6, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ ...SPRING, delay: 0.55 }}
              style={{ transformOrigin: '20% 100%' }}
            >
              {TAPBACKS.map((emoji, i) => (
                <motion.span
                  key={emoji}
                  className="grid size-[2.55cqw] place-items-center rounded-full text-[1.5cqw]"
                  initial={{ backgroundColor: 'rgba(10,132,255,0)' }}
                  animate={{ backgroundColor: i === 0 ? ['rgba(10,132,255,0)', 'rgba(10,132,255,0)', MESSAGE_BLUE] : 'rgba(10,132,255,0)' }}
                  transition={{ duration: 1.2, times: [0, 0.75, 0.8] }}
                >
                  {emoji}
                </motion.span>
              ))}
              <span className="mx-[0.2cqw] h-[1.65cqw] w-px bg-white/15" />
              <span className="grid size-[2.25cqw] place-items-center rounded-full bg-white/[0.06] text-white/70">
                <Plus className="size-[1cqw]" strokeWidth={3} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {reaction && (
            <motion.span
              key="reaction"
              className="absolute -top-[1.7cqw] -right-[1.75cqw] grid size-[2.25cqw] place-items-center rounded-full text-[1.1cqw] shadow-[0_0.2cqw_0.5cqw_rgba(0,0,0,0.4)] ring-[0.15cqw] ring-[#1e1e1e]"
              style={{ background: MESSAGE_BLUE }}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: [0, 1.25, 1], rotate: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              {reaction}
              <span className="absolute -bottom-[0.25cqw] -left-[0.2cqw] size-[0.75cqw] rounded-full ring-[0.15cqw] ring-[#1e1e1e]" style={{ background: MESSAGE_BLUE }} />
              <span className="absolute -bottom-[0.65cqw] -left-[0.55cqw] size-[0.38cqw] rounded-full" style={{ background: MESSAGE_BLUE }} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/** Views/Chat/FileBubbleView.swift: a file you sent, as a blue card in the conversation. */
function FileCard() {
  return (
    <div className="flex justify-end">
      <div className="w-[21cqw] rounded-[1.35cqw] px-[0.9cqw] py-[0.75cqw] text-white" style={{ background: MESSAGE_BLUE }}>
        <div className="flex items-center gap-[0.75cqw]">
          <svg viewBox="-1.5 -1.8 3 3.6" className="h-[3cqw] w-auto shrink-0 rounded-[0.75cqw]">
            <FileGlyph kind="pdf" />
          </svg>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-[0.98cqw] font-semibold">Q3 Report.pdf</p>
            <p className="text-[0.82cqw] text-white/75">2.4 MB</p>
          </div>
        </div>
        <p className="mt-[0.5cqw] flex items-center gap-[0.3cqw] text-[0.86cqw] font-medium">
          <CircleCheck className="size-[0.95cqw]" strokeWidth={2.4} /> Delivered
        </p>
      </div>
    </div>
  )
}

/** "•••" in a grey bubble while a colleague types: the dots lift and fade in turn. */
function TypingIndicator() {
  return (
    <span className="relative inline-flex items-center gap-[0.3cqw] rounded-[1.27cqw] px-[0.98cqw] py-[0.83cqw]" style={{ background: INCOMING }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-[0.53cqw] rounded-full bg-white/60"
          animate={{ y: ['0%', '-35%', '0%'], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
      <svg viewBox="0 0 17 17.5" className="absolute bottom-0 -left-[0.375cqw] h-[1.31cqw] w-[1.28cqw] -scale-x-100">
        <path d="M12 0 C12 11 14 15.5 17 17 C10 17.5 5 16.5 0 14 L0 0 Z" fill={INCOMING} />
      </svg>
    </span>
  )
}

/** The glass message bar: + for files, the field with its emoji button, and send once there's text. */
function MessageBar({ draft }) {
  const hasText = draft.length > 0
  return (
    <div className="absolute inset-x-[1.2cqw] bottom-[0.9cqw] flex items-center gap-[0.6cqw]">
      <span className="grid size-[2.6cqw] shrink-0 place-items-center rounded-full bg-white/[0.08] text-white/75 ring-1 ring-white/10">
        <Plus className="size-[1.2cqw]" strokeWidth={2.6} />
      </span>
      <div className="flex h-[2.6cqw] flex-1 items-center rounded-[1.35cqw] bg-white/[0.08] pr-[0.3cqw] pl-[1cqw] ring-1 ring-white/10">
        <span className={`flex-1 truncate text-[1.05cqw] ${hasText ? 'text-white' : 'text-white/35'}`}>
          {hasText ? draft : 'Message'}
          {hasText && <span className="ml-px inline-block h-[1.1cqw] w-[0.1cqw] translate-y-[0.2cqw] animate-blink bg-[#0a84ff]" />}
        </span>
        <FaceSlightlySmiling className="mx-[0.4cqw] size-[1.3cqw] text-white/45" strokeWidth={1.8} />
        <AnimatePresence>
          {hasText && (
            <motion.span
              className="grid size-[2.1cqw] place-items-center rounded-full text-white"
              style={{ background: MESSAGE_BLUE }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={SPRING}
            >
              <ArrowUp className="size-[1cqw]" strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
