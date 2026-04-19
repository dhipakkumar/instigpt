import { Trash2, GraduationCap } from 'lucide-react'

export default function Header({ onClear }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <GraduationCap size={22} strokeWidth={2.5} />
        </div>
        <div className="header-title-group">
          <h1 className="header-title">InstiGPT</h1>
          <span className="header-subtitle">IIT Madras AI Assistant</span>
        </div>
      </div>
    </header>
  )
}
