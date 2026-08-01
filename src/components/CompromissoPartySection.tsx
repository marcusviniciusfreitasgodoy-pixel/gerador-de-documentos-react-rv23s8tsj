import { useWatch, type Control } from 'react-hook-form'
import type { ReactNode } from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { maskCpfCnpj } from '@/lib/utils'
import { regimeSeAplica } from '@/lib/form-helpers'
import {
  ESTADO_CIVIL_OPTIONS,
  REGIME_BENS_OPTIONS,
  type CompromissoValues,
} from '@/lib/compromisso-helpers'

interface Props {
  control: Control<CompromissoValues>
  prefix: string
  title: string
  icon: ReactNode
  showRelacao?: boolean
  /** Separador entre prefix e campo. '_' (default) para prefixos flat (vendedor_nome);
   *  '.' para prefixos indexados de useFieldArray (vendedores.0.nome). */
  sep?: string
}

export function CompromissoPartySection({
  control,
  prefix,
  title,
  icon,
  showRelacao,
  sep = '_',
}: Props) {
  const f = (field: string) => `${prefix}${sep}${field}` as any
  const estadoCivil = useWatch({ control, name: f('estado_civil') }) as string

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-semibold text-primary">{title}</h3>
      </div>
      <Separator />
      <FormField
        control={control}
        name={f('nome')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo *</FormLabel>
            <FormControl>
              <Input placeholder="Ex: João Silva" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={f('nacionalidade')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nacionalidade</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('profissao')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profissão</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={f('estado_civil')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado Civil *</FormLabel>
              <Select value={field.value || undefined} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ESTADO_CIVIL_OPTIONS.map((o) => (
                    <SelectItem key={o} value={o}>
                      {o}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {regimeSeAplica(estadoCivil) && (
          <FormField
            control={control}
            name={f('regime_bens')}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regime de Bens</FormLabel>
                <Select value={field.value || undefined} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {REGIME_BENS_OPTIONS.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={f('rg')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>RG *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('orgao_emissor')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Órgão Emissor *</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name={f('cpf')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF/CNPJ *</FormLabel>
              <FormControl>
                <Input
                  value={field.value || ''}
                  onChange={(e) => field.onChange(maskCpfCnpj(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={f('email')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name={f('endereco')}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço Completo *</FormLabel>
            <FormControl>
              <Input placeholder="Rua, nº, Bairro, Cidade/UF, CEP" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {showRelacao && (
        <FormField
          control={control}
          name={f('relacao')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Relação (cônjuge, coproprietário, etc.)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Cônjuge" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
