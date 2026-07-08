import { useState, useEffect, useCallback } from 'react'
import { Loader2, UserCircle, Save } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import {
  getBrokerProfile,
  createBrokerProfile,
  updateBrokerProfile,
  type BrokerProfile,
} from '@/services/broker-profile'
import { extractFieldErrors, getErrorMessage, type FieldErrors } from '@/lib/pocketbase/errors'
import { maskCpfCnpj, maskPhone } from '@/lib/utils'

interface ProfileForm {
  name: string
  creci: string
  document: string
  phone: string
  email: string
}

const emptyForm: ProfileForm = {
  name: '',
  creci: '',
  document: '',
  phone: '',
  email: '',
}

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
          name: existing.name || '',
          creci: existing.creci || '',
          document: existing.document || '',
          phone: existing.phone || '',
          email: existing.email || '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFieldErrors({})
    try {
      const payload = {
        name: form.name,
        creci: form.creci || undefined,
        document: form.document || undefined,
        phone: form.phone || undefined,
        email: form.email || undefined,
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="bp-name">Nome Completo *</Label>
            <Input
              id="bp-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            {fieldErrors.name && <p className="text-sm text-red-500">{fieldErrors.name}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="bp-creci">CRECI</Label>
              <Input
                id="bp-creci"
                value={form.creci}
                onChange={(e) => setForm({ ...form, creci: e.target.value })}
              />
              {fieldErrors.creci && <p className="text-sm text-red-500">{fieldErrors.creci}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="bp-document">CPF / CNPJ</Label>
              <Input
                id="bp-document"
                placeholder="000.000.000-00"
                value={form.document}
                onChange={(e) => setForm({ ...form, document: maskCpfCnpj(e.target.value) })}
              />
              {fieldErrors.document && (
                <p className="text-sm text-red-500">{fieldErrors.document}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="bp-phone">Telefone</Label>
              <Input
                id="bp-phone"
                placeholder="(21) 99999-9999"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: maskPhone(e.target.value) })}
              />
              {fieldErrors.phone && <p className="text-sm text-red-500">{fieldErrors.phone}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="bp-email">E-mail</Label>
              <Input
                id="bp-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              {fieldErrors.email && <p className="text-sm text-red-500">{fieldErrors.email}</p>}
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
