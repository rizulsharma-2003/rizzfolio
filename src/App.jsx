import { useCallback, useState } from 'react'
import { MotionConfig } from 'motion/react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Statement from './components/Statement'
import MacDemo from './components/mac-demo/MacDemo'
import DemoPlayer from './components/mac-demo/DemoPlayer'
import Projects from './components/Projects'
import Highlights from './components/Highlights'
import Downloads from './components/Downloads'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProjectModal from './components/ProjectModal'

export default function App() {
  const [openProject, setOpenProject] = useState(null)
  const [demo, setDemo] = useState(null)
  const close = useCallback(() => setOpenProject(null), [])
  const closeDemo = useCallback(() => setDemo(null), [])
  const watch = useCallback((project) => {
    setOpenProject(null)
    setDemo(project.id)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div aria-hidden className="noise" />
      <Nav />
      <main>
        <Hero />
        <Statement />
        <MacDemo onOpen={setOpenProject} />
        <Projects onOpen={setOpenProject} onDemo={watch} />
        <Highlights />
        <Downloads onOpen={setOpenProject} />
        <Contact />
      </main>
      <Footer onOpen={setOpenProject} />
      <ProjectModal project={openProject} onClose={close} onDemo={watch} />
      <DemoPlayer projectId={demo} onClose={closeDemo} onChange={setDemo} />
    </MotionConfig>
  )
}
