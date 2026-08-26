import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Clock, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

/**
 * Página de planos.
 *
 * POR QUE O BOTÃO ABRE UM CHAMADO, E NÃO UM CHECKOUT
 *
 * O provedor de pagamento ainda não foi escolhido, e escolher taxa, conciliação
 * e o que acontece quando o cartão falha é decisão que não dá para chutar. Até
 * lá o botão abre um chamado do tipo `assinatura`, que cai na mesma fila que o
 * admin já atende hoje em Ajuda e Suporte.
 *
 * Não é remendo: para os primeiros assinantes, fechar à mão é mais rápido do
 * que integrar, e ensina qual objeção aparece de verdade. O admin recebe o
 * pedido, combina o pagamento, e carimba `plano` e `plano_renova_em` no painel.
 * A guarda do `plano_carimbo.js` deixa o admin escrever e impede todo o resto.
 *
 * Quando o provedor existir, muda o `solicitar` abaixo e mais nada: os cartões,
 * os preços e a régua de limites continuam iguais.
 *
 * OS PREÇOS SÃO HIPÓTESE, NÃO PESQUISA
 *
 * Os tetos de 10 e 30 operações saíram de uma conta, não de dado. O contador de
 * `negocios_no_mes` começou a rodar agora: em algumas semanas ele diz quantas
 * operações um corretor abre de verdade por mês, e aí os números se recortam em
 * cima do real. Mudar valor aqui é mudar a constante `PLANOS` e a tabela
 * `LIMITES` do `negocio_limite.js`, nesta ordem.
 */

type Plano = {
  id: string
  nome: string
  preco: string
  unidade: string
  nota?: string
  destaque?: boolean
  itens: string[]
}

const PLANOS: Plano[] = [
  {
    id: 'avulso',
    nome: 'Avulso',
    preco: 'R$ 49',
    unidade: 'por negócio',
    nota: 'Uma operação, 30 dias para usar. Sem assinatura.',
    itens: [
      'Todos os documentos daquela operação',
      'Correções ilimitadas',
      'Uma validação de minuta',
      'O dossiê fica na sua conta depois',
    ],
  },
  {
    id: 'corretor',
    nome: 'Individual',
    preco: 'R$ 69',
    unidade: 'por mês',
    nota: 'R$ 690 no ano, dois meses grátis. Até 10 operações por mês.',
    itens: [
      'Todos os documentos, correções ilimitadas',
      'Validação de minuta, 20 por mês',
      'Régua jurídica sempre atualizada',
      'Dossiês ilimitados',
    ],
  },
  {
    id: 'profissional',
    nome: 'Profissional',
    preco: 'R$ 97',
    unidade: 'por mês',
    nota: 'R$ 970 no ano. Até 30 operações por mês.',
    destaque: true,
    itens: [
      'Tudo do Individual, com três vezes o teto',
      'Validação de minuta, 60 por mês',
      'Canal do especialista, orçado à parte',
    ],
  },
  {
    id: 'imobiliaria',
    nome: 'Imobiliária',
    preco: 'R$ 197',
    unidade: 'por mês, 3 assentos',
    nota: 'Assento adicional R$ 59. Cada assento tem o teto do Profissional.',
    itens: [
      'Quem só acompanha entra de graça, sem limite de gente',
      'Equipe, com convite por e-mail e aceite do termo',
      'Negócios da casa e trilha de acesso',
      'Régua jurídica própria da imobiliária',
    ],
  },
]

export default function PlanosPage() {
  const { user, plano, planoAtivo, trialDiasRestantes, negociosNoMes, planoLimiteNegocios } =
    useAuth()
  const [enviando, setEnviando] = useState('')
  const [jaPediu, setJaPediu] = useState(false)
  const [carregando, setCarregando] = useState(true)

  // Um pedido em aberto basta. Sem esta checagem, o corretor que não recebeu
  // resposta no mesmo dia abre o segundo e o terceiro chamado, e a fila do
  // admin vira ruído justamente na hora de fechar a venda.
  const carregar = useCallback(async () => {
    if (!user?.id) {
      setCarregando(false)
      return
    }
    try {
      const lista = await pb.collection('chamados').getFullList({
        filter: `user = "${user.id}" && tipo = "assinatura" && status != "resolvido"`,
        sort: '-created',
      })
      setJaPediu(lista.length > 0)
    } catch {
      // Silencioso: se a consulta falhar, o botão continua disponível. Errar
      // para o lado de deixar pedir é melhor que travar quem quer pagar.
    } finally {
      setCarregando(false)
    }
  }, [user?.id])

  useEffect(() => {
    carregar()
  }, [carregar])

  const solicitar = async (p: Plano) => {
    setEnviando(p.id)
    try {
      await pb.collection('chamados').create({
        user: user?.id,
        tipo: 'assinatura',
        mensagem: `Quero assinar o plano ${p.nome} (${p.preco} ${p.unidade}).`,
        status: 'aberto',
      })
      setJaPediu(true)
      toast.success('Pedido enviado. A gente responde pela página de Ajuda e Suporte.')
    } catch {
      toast.error('Não foi possível enviar o pedido. Tente de novo em instantes.')
    } finally {
      setEnviando('')
    }
  }

  const noTeste = !planoAtivo && !plano
  const temTeto = planoLimiteNegocios > 0
  const passouDoTeto = temTeto && negociosNoMes > planoLimiteNegocios

  return (
    <div className="w-full max-w-5xl space-y-6 animate-fade-in-up">
      <div>
        <h1 className="font-display text-3xl font-medium text-foreground">
          Escolha como quer usar o Prime Circle Docs
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground max-w-2xl">
          Teste grátis por 15 dias, use em uma operação avulsa, ou assine para organizar a
          documentação dos seus negócios todo mês.
        </p>
      </div>

      {/* Onde o corretor está hoje. Uma página de preços que não diz isso obriga
          ele a sair para descobrir, e quem está prestes a pagar não deveria
          precisar procurar. */}
      {!carregando && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {planoAtivo ? (
                  <>
                    Você está no plano <strong>{plano}</strong>.
                  </>
                ) : noTeste && trialDiasRestantes !== null ? (
                  trialDiasRestantes === 0 ? (
                    <>Seu teste termina hoje.</>
                  ) : (
                    <>
                      Você está no teste grátis, faltam <strong>{trialDiasRestantes}</strong>{' '}
                      {trialDiasRestantes === 1 ? 'dia' : 'dias'}.
                    </>
                  )
                ) : (
                  <>Sua conta está liberada, sem prazo definido.</>
                )}
              </span>
            </div>
            {temTeto && (
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-sm text-foreground tabular-nums">
                  {negociosNoMes} de {planoLimiteNegocios} operações neste mês
                </span>
              </div>
            )}
          </div>
          {passouDoTeto && (
            <p className="mt-2 text-sm leading-relaxed text-amber-700">
              Você passou do teto do seu plano neste mês. Nada foi bloqueado e nada vai ser: os
              documentos continuam saindo normalmente. Vale subir de plano para a conta fechar
              certa.
            </p>
          )}
        </div>
      )}

      {jaPediu && (
        <div className="rounded-lg border border-primary/25 bg-primary/[0.04] p-4">
          <p className="text-sm font-medium text-foreground">Seu pedido já está com a gente</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            A gente responde e combina o pagamento pela página de ajuda. Você acompanha por lá.{' '}
            <Link to="/ajuda" className="font-medium underline">
              Ver meus chamados
            </Link>
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANOS.map((p) => (
          <Card
            key={p.id}
            className={
              p.destaque ? 'border-primary/50 shadow-elevation relative' : 'border-border/60'
            }
          >
            {p.destaque && (
              <Badge className="absolute -top-2.5 left-4">
                <Sparkles className="mr-1 h-3 w-3" /> Mais escolhido
              </Badge>
            )}
            <CardContent className="pt-5 pb-5 flex h-full flex-col gap-3.5">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {p.nome}
                </p>
                {/* Preço e unidade EMPILHADOS, não lado a lado. Em linha, a
                    unidade longa do plano de imobiliária ("por mês, 3 assentos")
                    espremia o número e quebrava "R$ 197" em duas linhas, só
                    naquele cartão. Numa grade de preços a diferença salta aos
                    olhos e passa impressão de descuido. Empilhado, os quatro
                    ficam iguais e nenhuma unidade nova quebra o número. */}
                <div className="mt-1">
                  <div className="font-display text-3xl font-medium text-foreground tabular-nums whitespace-nowrap">
                    {p.preco}
                  </div>
                  <div className="text-xs text-muted-foreground">{p.unidade}</div>
                </div>
                {p.nota && (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.nota}</p>
                )}
              </div>

              <ul className="flex flex-col gap-2">
                {p.itens.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="text-xs leading-relaxed text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-1">
                <Button
                  className="w-full"
                  variant={p.destaque ? 'default' : 'outline'}
                  disabled={!!enviando || jaPediu || (planoAtivo && plano === p.id)}
                  onClick={() => solicitar(p)}
                >
                  {enviando === p.id ? (
                    <>
                      <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Enviando
                    </>
                  ) : planoAtivo && plano === p.id ? (
                    'Seu plano atual'
                  ) : (
                    'Quero este'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-card p-4 space-y-3">
        <div>
          <p className="text-sm font-medium text-foreground">O limite é por operação</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Em cada negócio, você cadastra os dados uma vez, gera todos os documentos e corrige
            quantas vezes precisar, sem custo adicional. Checklist, termo de chaves, termo de posse
            e recibo de comissão não contam como operação: eles pertencem a um negócio que já
            existe.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Modelos prontos resolvem um arquivo</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            O Prime Circle Docs organiza a operação inteira: partes, imóvel, comissão, documentos em
            Word e validação com IA no mesmo fluxo. E os seus dados continuam seus, com ou sem
            plano: nada é apagado e nada fica preso aqui dentro.
          </p>
        </div>
      </div>
    </div>
  )
}
