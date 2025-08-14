import Link from 'next/link'
import { Instagram, Github, Globe, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold mb-2">FindWorkAI</h3>
            <p className="text-sm text-muted-foreground mb-4">
              AI-Powered Business Discovery Platform. Transform your lead generation with intelligent automation.
            </p>
            <p className="text-sm text-muted-foreground">
              Created with <Heart className="inline h-3 w-3 text-red-500" /> by{' '}
              <a 
                href="https://www.instagram.com/pheelymon.oftan" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Pheelymon
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/search" className="text-muted-foreground hover:text-primary transition-colors">
                  Search Leads
                </Link>
              </li>
              <li>
                <Link href="/dashboard/ai-agents" className="text-muted-foreground hover:text-primary transition-colors">
                  AI Agents
                </Link>
              </li>
              <li>
                <Link href="/dashboard/analytics" className="text-muted-foreground hover:text-primary transition-colors">
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/pheelymon.oftan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/Thankswewin"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://findworkai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Website"
              >
                <Globe className="h-5 w-5" />
              </a>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Developer: <strong>Pheelymon</strong></p>
              <p className="mt-1">
                <a 
                  href="https://www.instagram.com/pheelymon.oftan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  @pheelymon.oftan
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} FindWorkAI. All rights reserved.</p>
          <p className="mt-2">
            Developed by{' '}
            <a 
              href="https://www.instagram.com/pheelymon.oftan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              Pheelymon
            </a>
            {' '}| AI-Powered Business Solutions
          </p>
        </div>
      </div>
    </footer>
  )
}
