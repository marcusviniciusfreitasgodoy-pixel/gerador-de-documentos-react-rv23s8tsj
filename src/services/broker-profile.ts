import pb from '@/lib/pocketbase/client'

export interface BrokerProfile {
  id: string
  user: string
  name: string
  creci?: string
  document?: string
  phone?: string
  email?: string
  commission_rate?: number
  created: string
  updated: string
}

export const getBrokerProfile = async (): Promise<BrokerProfile | null> => {
  try {
    const record = await pb
      .collection('broker_profile')
      .getFirstListItem<BrokerProfile>(`user = "${pb.authStore.record?.id}"`)
    return record
  } catch {
    return null
  }
}

export const createBrokerProfile = (data: Omit<BrokerProfile, 'id' | 'created' | 'updated'>) =>
  pb.collection('broker_profile').create<BrokerProfile>(data)

export const updateBrokerProfile = (id: string, data: Partial<BrokerProfile>) =>
  pb.collection('broker_profile').update<BrokerProfile>(id, data)

export const deleteBrokerProfile = (id: string) => pb.collection('broker_profile').delete(id)
