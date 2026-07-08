import { useState, useEffect, useCallback } from 'react'
import { Loader2, UserCircle, Save, Building2, User } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
    try {
      const payload: Partial<BrokerProfile> = {
        tipo_perfil: form.tipo_perfil,
        nome: form.nome || undefined,
        cpf: form.cpf || undefined,
        creci: form.creci || undefined,
        razao_social: form.razao_social || undefined,
        nome_fantasia: form.nome_fantasia || undefined,
        cnpj: form.cnpj || undefined,
        creci_juridico: form.creci_juridico || undefined,
        responsavel_nome: form.responsavel_nome || undefined,
        responsavel_cpf: form.responsavel_cpf || undefined,
        responsavel_creci: form.responsavel_creci || undefined,
        creci_uf: form.creci_uf || undefined,
        pix: form.pix || undefined,
        telefone: form.telefone || undefined,
        email: form.email || undefined,
        endereco: form.endereco || undefined,
        cidade: form.cidade || undefined,
        uf: form.uf || undefined,
      }
      if (profile) {
        await updateBrokerProfile(profile.id, payload)
        toast.success('Perfil atualizado com sucesso!')
      } else {
        await createBrokerProfile({ ...payload, user: user?.id || '' })
        toast.success('Perfil criado com sucesso!')
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
    <Card className="w-full max-w-2xl shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-primary" />
          <div>
            <CardTitle className="text-xl text-primary">Meu Perfil</CardTitle>
            <CardDescription>
              Gerencie suas informações profissionais para uso nos documentos gerados.
            </CardDescription>
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
                />
                {fieldErrors.nome && <p className="text-sm text-red-500">{fieldErrors.nome}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="pf-cpf">CPF</Label>
                  <Input
                    id="pf-cpf"
                    placeholder="000.000.000-00"
                    value={form.cpf}
                    onChange={(e) => update('cpf', maskCpfCnpj(e.target.value))}
                  />
                  {fieldErrors.cpf && <p className="text-sm text-red-500">{fieldErrors.cpf}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pf-creci">CRECI</Label>
                  <Input
                    id="pf-creci"
                    value={form.creci}
                    onChange={(e) => update('creci', e.target.value)}
                  />
                  {fieldErrors.creci && <p className="text-sm text-red-500">{fieldErrors.creci}</p>}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="pf-creci-uf">CRECI UF</Label>
                <Input
                  id="pf-creci-uf"
                  placeholder="RJ"
                  maxLength={2}
                  value={form.creci_uf}
                  onChange={(e) => update('creci_uf', e.target.value.toUpperCase())}
                />
                {fieldErrors.creci_uf && (
                  <p className="text-sm text-red-500">{fieldErrors.creci_uf}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Dados da Imobiliária
              </h3>
              <div className="space-y-1">
                <Label htmlFor="pf-razao">Razão Social</Label>
                <Input
                  id="pf-razao"
                  value={form.razao_social}
                  onChange={(e) => update('razao_social', e.target.value)}
                />
                {fieldErrors.razao_social && (
                  <p className="text-sm text-red-500">{fieldErrors.razao_social}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="pf-fantasia">Nome Fantasia</Label>
                <Input
                  id="pf-fantasia"
                  value={form.nome_fantasia}
                  onChange={(e) => update('nome_fantasia', e.target.value)}
                />
                {fieldErrors.nome_fantasia && (
                  <p className="text-sm text-red-500">{fieldErrors.nome_fantasia}</p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="pf-cnpj">CNPJ</Label>
                  <Input
                    id="pf-cnpj"
                    placeholder="00.000.000/0000-00"
                    value={form.cnpj}
                    onChange={(e) => update('cnpj', maskCnpj(e.target.value))}
                  />
                  {fieldErrors.cnpj && <p className="text-sm text-red-500">{fieldErrors.cnpj}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="pf-creci-juridico">CRECI Jurídico</Label>
                  <Input
                    id="pf-creci-juridico"
                    value={form.creci_juridico}
                    onChange={(e) => update('creci_juridico', e.target.value)}
                  />
                  {fieldErrors.creci_juridico && (
                    <p className="text-sm text-red-500">{fieldErrors.creci_juridico}</p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label htmlFor="pf-creci-uf-j">CRECI UF</Label>
                <Input
                  id="pf-creci-uf-j"
                  placeholder="RJ"
                  maxLength={2}
                  value={form.creci_uf}
                  onChange={(e) => update('creci_uf', e.target.value.toUpperCase())}
                />
                {fieldErrors.creci_uf && (
                  <p className="text-sm text-red-500">{fieldErrors.creci_uf}</p>
                )}
              </div>

              <div className="border-t border-border/60 pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Corretor Responsável
                </h3>
                <div className="space-y-1">
                  <Label htmlFor="pf-resp-nome">Nome do Responsável</Label>
                  <Input
                    id="pf-resp-nome"
                    value={form.responsavel_nome}
                    onChange={(e) => update('responsavel_nome', e.target.value)}
                  />
                  {fieldErrors.responsavel_nome && (
                    <p className="text-sm text-red-500">{fieldErrors.responsavel_nome}</p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="pf-resp-cpf">CPF do Responsável</Label>
                    <Input
                      id="pf-resp-cpf"
                      placeholder="000.000.000-00"
                      value={form.responsavel_cpf}
                      onChange={(e) => update('responsavel_cpf', maskCpfCnpj(e.target.value))}
                    />
                    {fieldErrors.responsavel_cpf && (
                      <p className="text-sm text-red-500">{fieldErrors.responsavel_cpf}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pf-resp-creci">CRECI do Responsável</Label>
                    <Input
                      id="pf-resp-creci"
                      value={form.responsavel_creci}
                      onChange={(e) => update('responsavel_creci', e.target.value)}
                    />
                    {fieldErrors.responsavel_creci && (
                      <p className="text-sm text-red-500">{fieldErrors.responsavel_creci}</p>
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
                />
                {fieldErrors.pix && <p className="text-sm text-red-500">{fieldErrors.pix}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="pf-telefone">Telefone</Label>
                <Input
                  id="pf-telefone"
                  placeholder="(21) 99999-9999"
                  value={form.telefone}
                  onChange={(e) => update('telefone', maskPhone(e.target.value))}
                />
                {fieldErrors.telefone && (
                  <p className="text-sm text-red-500">{fieldErrors.telefone}</p>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="pf-email">E-mail</Label>
              <Input
                id="pf-email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
              />
              {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="pf-endereco">Endereço</Label>
              <Input
                id="pf-endereco"
                value={form.endereco}
                onChange={(e) => update('endereco', e.target.value)}
              />
              {fieldErrors.endereco && (
                <p className="text-sm text-red-500">{fieldErrors.endereco}</p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="pf-cidade">Cidade</Label>
                <Input
                  id="pf-cidade"
                  value={form.cidade}
                  onChange={(e) => update('cidade', e.target.value)}
                />
                {fieldErrors.cidade && <p className="text-sm text-red-500">{fieldErrors.cidade}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="pf-uf">UF</Label>
                <select
                  id="pf-uf"
                  value={form.uf}
                  onChange={(e) => update('uf', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">--</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
                {fieldErrors.uf && <p className="text-sm text-red-500">{fieldErrors.uf}</p>}
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
                {profile ? 'Atualizar Perfil' : 'Criar Perfil'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
