import pb from '@/lib/pocketbase/client'

export interface LegalKnowledge {
  id: string
  title: string
  category?: string
  code?: string
  trigger_logic?: string
  content: string
  priority?: number
  version?: number
  created: string
  updated: string
}

export const getLegalKnowledge = () =>
  pb.collection('legal_knowledge').getFullList<LegalKnowledge>({ sort: '-created' })

export const getLegalKnowledgeById = (id: string) =>
  pb.collection('legal_knowledge').getOne<LegalKnowledge>(id)

export const createLegalKnowledge = (data: Partial<LegalKnowledge>) =>
  pb.collection('legal_knowledge').create<LegalKnowledge>(data)

export const updateLegalKnowledge = (id: string, data: Partial<LegalKnowledge>) =>
  pb.collection('legal_knowledge').update<LegalKnowledge>(id, data)

export const deleteLegalKnowledge = (id: string) => pb.collection('legal_knowledge').delete(id)
