import { useState, useEffect, useCallback } from 'react'
import { Loader2, UserCircle, Save, Building2, User } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IntroPagina } from '@/components/Layout'
import { MinhaImobiliaria } from '@/components/ConviteImobiliaria'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getBrokerProfile,
  createBrokerProfile,
  updateBrokerProfile,
  type BrokerProfile,
  type ProfileType,
} from '@/services/broker-profile'
import { extractFieldErrors, getErrorMessage, type FieldErrors } from '@/lib/pocketbase/errors'
import { maskCpfCnpj, maskCnpj, maskPhone, maskCep } from '@/lib/utils'

interface ProfileForm {
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
}

const emptyForm: ProfileForm = {
  tipo_perfil: 'corretor_autonomo',
  nome: '',
  cpf: '',
  creci: '',
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  creci_juridico: '',
  responsavel_nome: '',
  responsavel_cpf: '',
  responsavel_creci: '',
  creci_uf: '',
  pix: '',
  telefone: '',
  email: '',
  endereco: '',
  cidade: '',
  uf: '',
}

const UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
]

export default function MyProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<BrokerProfile | null>(null)
  const [form, setForm] = useState<ProfileForm>(emptyForm)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const existing = await getBrokerProfile()
      setProfile(existing)
      if (existing) {
        setForm({
          tipo_perfil: (existing.tipo_perfil as ProfileType) || 'corretor_autonomo',
          nome: existing.nome || '',
          cpf: existing.cpf || '',
          creci: existing.creci || '',
          razao_social: existing.razao_social || '',
          nome_fantasia: existing.nome_fantasia || '',
          cnpj: existing.cnpj || '',
          creci_juridico: existing.creci_juridico || '',
          responsavel_nome: existing.responsavel_nome || '',
          responsavel_cpf: existing.responsavel_cpf || '',
          responsavel_creci: existing.responsavel_creci || '',
          creci_uf: existing.creci_uf || '',
          pix: existing.pix || '',
          telefone: existing.telefone || '',
          email: existing.email || '',
          endereco: existing.endereco || '',
          cidade: existing.cidade || '',
          uf: existing.uf || '',
        })
      }
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('broker_profile', () => {
    loadData()
  })

  const update = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFieldErrors({})

    // Validation
    const errors: FieldErrors = {}

    if (form.tipo_perfil === 'corretor_autonomo') {
      if (!form.nome?.trim()) errors.nome = 'Este campo é obrigatório'
      if (!form.cpf?.trim()) errors.cpf = 'Este campo é obrigatório'
      if (!form.creci?.trim()) errors.creci = 'Este campo é obrigatório'
      if (!form.creci_uf?.trim()) errors.creci_uf = 'Este campo é obrigatório'
      if (!form.email?.trim()) errors.email = 'Este campo é obrigatório'
      if (!form.telefone?.trim()) errors.telefone = 'Este campo é obrigatório'
      if (!form.endereco?.trim()) errors.endereco = 'Este campo é obrigatório'
      if (!form.cidade?.trim()) errors.cidade = 'Este campo é obrigatório'
      if (!form.uf?.trim()) errors.uf = 'Este campo é obrigatório'
    } else {
      if (!form.razao_social?.trim()) errors.razao_social = 'Este campo é obrigatório'
      if (!form.cnpj?.trim()) errors.cnpj = 'Este campo é obrigatório'
      if (!form.creci_juridico?.trim()) errors.creci_juridico = 'Este campo é obrigatório'
      if (!form.creci_uf?.trim()) errors.creci_uf = 'Este campo é obrigatório'
      if (!form.responsavel_nome?.trim()) errors.responsavel_nome = 'Este campo é obrigatório'
      if (!form.responsavel_cpf?.trim()) errors.responsavel_cpf = 'Este campo é obrigatório'
      if (!form.responsavel_creci?.trim()) errors.responsavel_creci = 'Este campo é obrigatório'
      if (!form.email?.trim()) errors.email = 'Este campo é obrigatório'
      if (!form.telefone?.trim()) errors.telefone = 'Este campo é obrigatório'
      if (!form.endereco?.trim()) errors.endereco = 'Este campo é obrigatório'
      if (!form.cidade?.trim()) errors.cidade = 'Este campo é obrigatório'
      if (!form.uf?.trim()) errors.uf = 'Este campo é obrigatório'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setSaving(false)
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      const payload: Partial<BrokerProfile> = {
        name: form.tipo_perfil === 'corretor_autonomo' ? form.nome : form.razao_social,
        tipo_perfil: form.tipo_perfil,
        nome: form.nome || '',
        cpf: form.cpf || '',
        creci: form.creci || '',
        razao_social: form.razao_social || '',
        nome_fantasia: form.nome_fantasia || '',
        cnpj: form.cnpj || '',
        creci_juridico: form.creci_juridico || '',
        responsavel_nome: form.responsavel_nome || '',
        responsavel_cpf: form.responsavel_cpf || '',
        responsavel_creci: form.responsavel_creci || '',
        creci_uf: form.creci_uf || '',
        pix: form.pix || '',
        telefone: form.telefone || '',
        email: form.email || '',
        endereco: form.endereco || '',
        cidade: form.cidade || '',
        uf: form.uf || '',
      }

      if (profile) {
        await updateBrokerProfile(profile.id, payload)
        toast.success('Perfil salvo com sucesso!')
      } else {
        await createBrokerProfile({ ...payload, user: user?.id || '' })
        toast.success('Perfil salvo com sucesso!')
      }
      await loadData()
    } catch (error) {
      setFieldErrors(extractFieldErrors(error))
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const isAutonomo = form.tipo_perfil === 'corretor_autonomo'

  return (
    <div className="w-full max-w-2xl space-y-5 animate-fade-in-up">
      {/* Vínculo com imobiliária (fase 3): onde ele está hoje, os convites
          esperando resposta e o botão de sair. Some sozinho para quem é
          autônomo e não foi convidado por ninguém. */}
      <MinhaImobiliaria />

      <Card className="shadow-elevation border-0 md:border md:border-border/60">
        <CardHeader>
          <div className="flex items-center gap-2">
            <UserCircle className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-xl text-primary">Meu Perfil</CardTitle>
              <div className="mt-1">
                <IntroPagina
                  frase="Preencha uma vez: seu nome, CRECI e chave PIX entram automaticamente na cláusula de corretagem e na assinatura de todos os documentos."
                  passos={[
                    'Escolha o tipo de perfil: corretor pessoa física ou imobiliária (CNPJ).',
                    'O percentual de comissão padrão preenche os formulários sozinho (dá para ajustar caso a caso).',
                    'Sem o perfil completo, a geração de documentos fica bloqueada, justamente para nenhum contrato sair sem os seus dados.',
                  ]}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Tipo de Perfil</Label>
              <ToggleGroup
                type="single"
                value={form.tipo_perfil}
                onValueChange={(val) => {
                  if (val) update('tipo_perfil', val as ProfileType)
                }}
                className="grid grid-cols-2 gap-2 w-full"
              >
                <ToggleGroupItem
                  value="corretor_autonomo"
                  className="flex items-center gap-2 h-12 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <User className="h-4 w-4" />
                  Corretor Autônomo
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="imobiliaria"
                  className="flex items-center gap-2 h-12 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <Building2 className="h-4 w-4" />
                  Imobiliária
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {isAutonomo ? (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Dados do Corretor
                </h3>
                <div className="space-y-1">
                  <Label htmlFor="pf-nome">Nome Completo *</Label>
                  <Input
                    id="pf-nome"
                    value={form.nome}
                    onChange={(e) => update('nome', e.target.value)}
                    className={
                      fieldErrors.nome ? 'border-destructive focus-visible:ring-destructive' : ''
                    }
                  />
                  {fieldErrors.nome && (
                    <p className="text-sm text-destructive">{fieldErrors.nome}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="pf-cpf">CPF *</Label>
                    <Input
                      id="pf-cpf"
                      placeholder="000.000.000-00"
                      value={form.cpf}
                      onChange={(e) => update('cpf', maskCpfCnpj(e.target.value))}
                      className={
                        fieldErrors.cpf ? 'border-destructive focus-visible:ring-destructive' : ''
                      }
                    />
                    {fieldErrors.cpf && (
                      <p className="text-sm text-destructive">{fieldErrors.cpf}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pf-creci">CRECI *</Label>
                    <Input
                      id="pf-creci"
                      value={form.creci}
                      onChange={(e) => update('creci', e.target.value)}
                      className={
                        fieldErrors.creci ? 'border-destructive focus-visible:ring-destructive' : ''
                      }
                    />
                    {fieldErrors.creci && (
                      <p className="text-sm text-destructive">{fieldErrors.creci}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pf-creci-uf">CRECI UF *</Label>
                  <Input
                    id="pf-creci-uf"
                    placeholder="RJ"
                    maxLength={2}
                    value={form.creci_uf}
                    onChange={(e) => update('creci_uf', e.target.value.toUpperCase())}
                    className={
                      fieldErrors.creci_uf
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }
                  />
                  {fieldErrors.creci_uf && (
                    <p className="text-sm text-destructive">{fieldErrors.creci_uf}</p>
                  )}
                </div>{' '}
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Dados da Imobiliária
                </h3>
                <div className="space-y-1">
                  <Label htmlFor="pf-razao">Razão Social *</Label>
                  <Input
                    id="pf-razao"
                    value={form.razao_social}
                    onChange={(e) => update('razao_social', e.target.value)}
                    className={
                      fieldErrors.razao_social
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }
                  />
                  {fieldErrors.razao_social && (
                    <p className="text-sm text-destructive">{fieldErrors.razao_social}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pf-fantasia">Nome Fantasia</Label>
                  <Input
                    id="pf-fantasia"
                    value={form.nome_fantasia}
                    onChange={(e) => update('nome_fantasia', e.target.value)}
                    className={
                      fieldErrors.nome_fantasia
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }
                  />
                  {fieldErrors.nome_fantasia && (
                    <p className="text-sm text-destructive">{fieldErrors.nome_fantasia}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="pf-cnpj">CNPJ *</Label>
                    <Input
                      id="pf-cnpj"
                      placeholder="00.000.000/0000-00"
                      value={form.cnpj}
                      onChange={(e) => update('cnpj', maskCnpj(e.target.value))}
                      className={
                        fieldErrors.cnpj ? 'border-destructive focus-visible:ring-destructive' : ''
                      }
                    />
                    {fieldErrors.cnpj && (
                      <p className="text-sm text-destructive">{fieldErrors.cnpj}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pf-creci-juridico">CRECI Jurídico *</Label>
                    <Input
                      id="pf-creci-juridico"
                      value={form.creci_juridico}
                      onChange={(e) => update('creci_juridico', e.target.value)}
                      className={
                        fieldErrors.creci_juridico
                          ? 'border-destructive focus-visible:ring-destructive'
                          : ''
                      }
                    />
                    {fieldErrors.creci_juridico && (
                      <p className="text-sm text-destructive">{fieldErrors.creci_juridico}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pf-creci-uf-j">CRECI UF *</Label>
                  <Input
                    id="pf-creci-uf-j"
                    placeholder="RJ"
                    maxLength={2}
                    value={form.creci_uf}
                    onChange={(e) => update('creci_uf', e.target.value.toUpperCase())}
                    className={
                      fieldErrors.creci_uf
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }
                  />
                  {fieldErrors.creci_uf && (
                    <p className="text-sm text-destructive">{fieldErrors.creci_uf}</p>
                  )}
                </div>

                <div className="border-t border-border/60 pt-4 space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Corretor Responsável
                  </h3>
                  <div className="space-y-1">
                    <Label htmlFor="pf-resp-nome">Nome do Responsável *</Label>
                    <Input
                      id="pf-resp-nome"
                      value={form.responsavel_nome}
                      onChange={(e) => update('responsavel_nome', e.target.value)}
                      className={
                        fieldErrors.responsavel_nome
                          ? 'border-destructive focus-visible:ring-destructive'
                          : ''
                      }
                    />
                    {fieldErrors.responsavel_nome && (
                      <p className="text-sm text-destructive">{fieldErrors.responsavel_nome}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="pf-resp-cpf">CPF do Responsável *</Label>
                      <Input
                        id="pf-resp-cpf"
                        placeholder="000.000.000-00"
                        value={form.responsavel_cpf}
                        onChange={(e) => update('responsavel_cpf', maskCpfCnpj(e.target.value))}
                        className={
                          fieldErrors.responsavel_cpf
                            ? 'border-destructive focus-visible:ring-destructive'
                            : ''
                        }
                      />
                      {fieldErrors.responsavel_cpf && (
                        <p className="text-sm text-destructive">{fieldErrors.responsavel_cpf}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="pf-resp-creci">CRECI do Responsável *</Label>
                      <Input
                        id="pf-resp-creci"
                        value={form.responsavel_creci}
                        onChange={(e) => update('responsavel_creci', e.target.value)}
                        className={
                          fieldErrors.responsavel_creci
                            ? 'border-destructive focus-visible:ring-destructive'
                            : ''
                        }
                      />
                      {fieldErrors.responsavel_creci && (
                        <p className="text-sm text-destructive">{fieldErrors.responsavel_creci}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-border/60 pt-4 space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Contato e Endereço
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="pf-pix">Chave PIX</Label>
                  <Input
                    id="pf-pix"
                    value={form.pix}
                    onChange={(e) => update('pix', e.target.value)}
                    className={
                      fieldErrors.pix ? 'border-destructive focus-visible:ring-destructive' : ''
                    }
                  />
                  {fieldErrors.pix && <p className="text-sm text-destructive">{fieldErrors.pix}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pf-telefone">Telefone *</Label>
                  <Input
                    id="pf-telefone"
                    placeholder="(21) 99999-9999"
                    value={form.telefone}
                    onChange={(e) => update('telefone', maskPhone(e.target.value))}
                    className={
                      fieldErrors.telefone
                        ? 'border-destructive focus-visible:ring-destructive'
                        : ''
                    }
                  />
                  {fieldErrors.telefone && (
                    <p className="text-sm text-destructive">{fieldErrors.telefone}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="pf-email">E-mail *</Label>
                <Input
                  id="pf-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className={
                    fieldErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''
                  }
                />
                {fieldErrors.email && (
                  <p className="text-sm text-destructive">{fieldErrors.email}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="pf-endereco">Endereço *</Label>
                <Input
                  id="pf-endereco"
                  value={form.endereco}
                  onChange={(e) => update('endereco', e.target.value)}
                  className={
                    fieldErrors.endereco ? 'border-destructive focus-visible:ring-destructive' : ''
                  }
                />
                {fieldErrors.endereco && (
                  <p className="text-sm text-destructive">{fieldErrors.endereco}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="pf-cidade">Cidade *</Label>
                  <Input
                    id="pf-cidade"
                    value={form.cidade}
                    onChange={(e) => update('cidade', e.target.value)}
                    className={
                      fieldErrors.cidade ? 'border-destructive focus-visible:ring-destructive' : ''
                    }
                  />
                  {fieldErrors.cidade && (
                    <p className="text-sm text-destructive">{fieldErrors.cidade}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pf-uf">UF *</Label>
                  <select
                    id="pf-uf"
                    value={form.uf}
                    onChange={(e) => update('uf', e.target.value)}
                    className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${fieldErrors.uf ? 'border-destructive focus-visible:ring-destructive' : 'border-input'}`}
                  >
                    <option value="">--</option>
                    {UFS.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.uf && <p className="text-sm text-destructive">{fieldErrors.uf}</p>}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full h-11 text-base font-medium shadow-sm transition-all active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  {profile ? 'Salvar Perfil' : 'Criar Perfil'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
