import pb from '@/lib/pocketbase/client'

export type ProfileType = 'corretor_autonomo' | 'imobiliaria'

export interface BrokerProfile {
  id: string
  user: string
  tipo_perfil: ProfileType
  nome: string
  cpf: string
  creci: string
  razao_social: string
  nome_fantasia: string
  cnpj: string
  creci_juridico: string
  responsavel_nome: string
  responsavel_cpf: string
  responsavel_creci: string
  creci_uf: string
  pix: string
  telefone: string
  email: string
  endereco: string
  cidade: string
  uf: string
  created: string
  updated: string
}

export interface BrokerDisplay {
  tipo: ProfileType
  nome: string
  documento: string
  creci: string
  responsavel_nome: string
  responsavel_cpf: string
  responsavel_creci: string
  pix: string
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

export const getBrokerDisplay = (profile: BrokerProfile | null): BrokerDisplay | null => {
  if (!profile) return null

  if (profile.tipo_perfil === 'imobiliaria') {
    return {
      tipo: 'imobiliaria',
      nome: profile.razao_social || '',
      documento: `CNPJ nº ${profile.cnpj || ''}`.trim(),
      creci: `CRECI-J ${profile.creci_juridico || ''} ${profile.creci_uf || ''}`.trim(),
      responsavel_nome: profile.responsavel_nome || '',
      responsavel_cpf: profile.responsavel_cpf || '',
      responsavel_creci: profile.responsavel_creci || '',
      pix: profile.pix || '',
    }
  }

  return {
    tipo: 'corretor_autonomo',
    nome: profile.nome || '',
    documento: `CPF nº ${profile.cpf || ''}`.trim(),
    creci: `CRECI ${profile.creci || ''} ${profile.creci_uf || ''}`.trim(),
    responsavel_nome: profile.nome || '',
    responsavel_cpf: profile.cpf || '',
    responsavel_creci: profile.creci || '',
    pix: profile.pix || '',
  }
}

export const createBrokerProfile = (data: Partial<BrokerProfile> & { user: string }) =>
  pb.collection('broker_profile').create<BrokerProfile>(data)

export const updateBrokerProfile = (id: string, data: Partial<BrokerProfile>) =>
  pb.collection('broker_profile').update<BrokerProfile>(id, data)

export const deleteBrokerProfile = (id: string) => pb.collection('broker_profile').delete(id)
