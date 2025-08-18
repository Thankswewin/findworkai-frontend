import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GeneratedArtifact } from '@/lib/ai-agent'

interface ArtifactHistoryItem extends GeneratedArtifact {
  businessName: string
  businessCategory: string
  savedAt: Date
}

interface ArtifactStore {
  artifacts: ArtifactHistoryItem[]
  currentArtifact: GeneratedArtifact | null
  
  // Actions
  saveArtifact: (artifact: GeneratedArtifact, business: { name: string; category: string }) => void
  loadArtifact: (artifactId: string) => void
  deleteArtifact: (artifactId: string) => void
  clearHistory: () => void
  setCurrentArtifact: (artifact: GeneratedArtifact | null) => void
  updateArtifact: (artifactId: string, content: string) => void
  getArtifactById: (artifactId: string) => ArtifactHistoryItem | undefined
}

export const useArtifactStore = create<ArtifactStore>()(
  persist(
    (set, get) => ({
      artifacts: [],
      currentArtifact: null,
      
      saveArtifact: (artifact, business) => {
        const historyItem: ArtifactHistoryItem = {
          ...artifact,
          businessName: business.name,
          businessCategory: business.category,
          savedAt: new Date()
        }
        
        set((state) => ({
          artifacts: [historyItem, ...state.artifacts].slice(0, 50), // Keep last 50 artifacts
          currentArtifact: artifact
        }))
      },
      
      loadArtifact: (artifactId) => {
        const artifact = get().artifacts.find(a => a.id === artifactId)
        if (artifact) {
          set({ currentArtifact: artifact })
        }
      },
      
      deleteArtifact: (artifactId) => {
        set((state) => ({
          artifacts: state.artifacts.filter(a => a.id !== artifactId),
          currentArtifact: state.currentArtifact?.id === artifactId ? null : state.currentArtifact
        }))
      },
      
      clearHistory: () => {
        set({ artifacts: [], currentArtifact: null })
      },
      
      setCurrentArtifact: (artifact) => {
        set({ currentArtifact: artifact })
      },
      
      updateArtifact: (artifactId, content) => {
        set((state) => ({
          artifacts: state.artifacts.map(a => 
            a.id === artifactId 
              ? { ...a, content, savedAt: new Date() }
              : a
          ),
          currentArtifact: state.currentArtifact?.id === artifactId
            ? { ...state.currentArtifact, content }
            : state.currentArtifact
        }))
      },
      
      getArtifactById: (artifactId) => {
        return get().artifacts.find(a => a.id === artifactId)
      }
    }),
    {
      name: 'ai-artifacts-storage',
      partialize: (state) => ({
        artifacts: state.artifacts.slice(0, 20) // Only persist last 20 for storage
      })
    }
  )
)
