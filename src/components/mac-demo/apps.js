import { CodeXml, Compass, Trash } from 'lucide-react'
import { projects } from '../../data/projects'

// Dock items that aren't projects of their own.
const SYSTEM_APPS = {
  code: { id: 'code', name: 'Code', icon: CodeXml, colors: ['#3ea6ff', '#1f7ad6', '#0a4fa3'] },
  browser: { id: 'browser', name: 'Browser', icon: Compass, colors: ['#5ac8fa', '#0a84ff', '#0040dd'] },
  trash: { id: 'trash', name: 'Trash', icon: Trash, colors: ['#8e8e93', '#636366', '#48484a'] },
}

export const dockApp = (id) => SYSTEM_APPS[id] ?? projects.find((p) => p.id === id)
