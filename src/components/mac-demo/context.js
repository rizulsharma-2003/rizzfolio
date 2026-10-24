import { createContext, useContext } from 'react'

/** Lets a scene reach outside the screen, e.g. to jolt the whole laptop. */
export const DemoContext = createContext({ shake: () => {} })

export const useDemo = () => useContext(DemoContext)
