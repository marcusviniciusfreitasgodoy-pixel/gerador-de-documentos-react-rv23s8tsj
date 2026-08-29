import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Clock, Loader2, ShieldCheck, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import pb from '@/lib/pocketbase/client'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
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
 *
 * POR QUE O AVULSO CUSTA R$ 149, E NÃO R$ 49 (28/08/2026)
 *
 * O corretor autônomo fecha de 3 a 4 negócios POR ANO, não por mês. Três
 * caminhos independentes dão o mesmo número: o mercado primário vendeu 426 mil
 * unidades em 2025 (CBIC) para 730 mil corretores registrados (Cofeci); a renda
 * média publicada pelo conselho, de R$ 3 mil a R$ 4 mil, só fecha com 3 a 4
 * vendas anuais depois da divisão da comissão com a casa; e as pesquisas de
 * nicho convergem em "a maioria faz menos de 10 por ano".
 *
 * Com essa frequência, o preço do avulso decide TUDO, porque ele define a
 * partir de quantas operações assinar compensa:
 *
 *   avulso R$ 49  -> assinar só compensa a partir de 14 operações no ano
 *   avulso R$ 99  -> a partir de 7
 *   avulso R$ 149 -> a partir de 5
 *   avulso R$ 349 -> a partir de 2
 *
 * A R$ 49 ninguém no mercado real alcança o ponto de virada, e a tabela inteira
 * vira enfeite em volta do avulso: a assinatura nunca é a escolha racional. A
 * R$ 149 a virada cai dentro da distribuição de verdade. E a receita por
 * corretor deixa de depender de adivinhar a frequência dele: com 4 operações no
 * ano, o avulso rende R$ 596 contra os R$ 690 do plano, quase o mesmo; a R$ 49
 * rendia R$ 196, um quarto.
 *
 * O AVULSO É ÂNCORA, E ISSO É DELIBERADO
 *
 * A R$ 149 o avulso já custa mais que um mês de assinatura, então quem fizer a
 * conta assina. É o efeito desejado, e é o papel que o `MELHORIAS.md` já dava a
 * ele. Não espere receita de avulso: espere que ele empurre para o plano.
 *
 * R$ 149 ATÉ 31/12/2026, R$ 349 DEPOIS (decisão do Marcus, 29/08/2026)
 *
 * O preço final do avulso é R$ 349. O que está sendo cobrado até 31 de dezembro
 * de 2026 é R$ 149, e a data está escrita na página.
 *
 * A R$ 349 a virada cai para DOIS negócios (R$ 698 contra os R$ 690 do ano),
 * abaixo da mediana do mercado inteiro. Ou seja: o avulso deixa de ser produto e
 * passa a ser placa apontando para a assinatura. É de propósito, e é o que
 * transforma o bloco de comparação numa frase que ninguém precisa de
 * calculadora para entender.
 *
 * POR QUE NÃO TEM PREÇO RISCADO
 *
 * No dia em que este preço subiu, R$ 349 nunca tinha sido cobrado de ninguém.
 * Anunciar "de R$ 349 por R$ 149" seria desconto sobre preço que não existiu, e
 * este público reconhece a metade do dobro de olhos fechados. Vale a regra do
 * CLAUDE.md: não escreva garantia que não se sustenta. Então a página mostra
 * R$ 149 como preço, e diz a data em que ele muda. O efeito comercial é o
 * mesmo, e nada ali é falso.
 *
 * O prazo tem fim declarado de propósito. "Preço de lançamento" sem data vira
 * preço permanente, e aí o R$ 349 seria fictício do mesmo jeito.
 *
 * E o motivo do preço menor é BENEFÍCIO, não risco. A primeira versão do texto
 * dizia que quem entra agora "corre um risco que quem entrar depois não corre".
 * Era verdade e era péssimo: dizer ao corretor que ele está comprando algo não
 * provado, na frase que deveria fazê-lo comprar. O que a página diz agora é o
 * mesmo fato pelo lado certo: quem chega no começo paga menos, e continua
 * pagando menos em cada avulso que comprar até 31/12/2026.
 *
 * A DATA NÃO VIRA SOZINHA
 *
 * Não existe janela promocional no código. Em 31/12/2026 isso é uma rodada de
 * colagem no Skip, feita à mão, e ela toca CINCO lugares:
 *
 *   1. a constante `PLANOS`, o preço em si;
 *   2. o `selo` do avulso, que sai;
 *   3. a `nota` do cartão, que perde o "Vai para R$ 349 em 31 de dezembro";
 *   4. o bloco "Quem entra agora paga R$ 149", que muda de sentido inteiro;
 *   5. os blocos "A partir do quinto negócio" e "A conta de referência".
 *
 * A tabela de virada aqui em cima também envelhece. A data é compromisso de
 * gente, não cron.
 *
 * O número também aparece em comentário no `negocio_limite.js` e na migração
 * `1900000039`, onde ele explica por que a segunda operação do avulso não é
 * travada. O raciocínio continua valendo a R$ 349, e mais forte, então aqueles
 * dois não entram na rodada: só o número envelhece, não o argumento.
 *
 * Do lado bom: o avulso é compra única de 30 dias, não assinatura. Quem comprar
 * a R$ 149 comprou aquele avulso e acabou, então a mudança de preço não deixa
 * ninguém com preço travado para honrar depois.
 *
 * OS 16 DOCUMENTOS, E O "100%" QUE NÃO FOI ESCRITO
 *
 * O que justifica R$ 349 não é o preço, é o que ele compra, e isso estava
 * implícito demais: "todos os documentos daquela operação" não diz nada para
 * quem está decidindo. Agora o cartão e o bloco "O que cabe num Avulso" dizem o
 * número, quem revisou os modelos (advogado e escrevente de cartório) e o resto
 * do fluxo que vem junto (leitura de documento com IA, o negócio montado,
 * validação de minuta, consulta de dúvidas).
 *
 * O pedido original dizia que os documentos "seguem 100% do que o Código Civil
 * orienta". O 100% ficou de fora de propósito. É garantia de conformidade
 * jurídica, e nenhum modelo padronizado sustenta isso diante do caso concreto:
 * é exatamente a frase que o advogado da outra parte citaria de volta se um
 * contrato for contestado. Vale a regra do CLAUDE.md, não escreva garantia que
 * não se sustenta, e a de nunca posar de substituto de advogado (Lei 8.906/94,
 * art. 1º, II). "Escritos sobre o que o Código Civil orienta para cada ato e
 * revisados por advogado e por escrevente" diz a mesma coisa, é verificável, e
 * não promete resultado.
 *
 * O NÚMERO 16 É CONTAGEM DO DONO DO PROJETO, NÃO DE ARQUIVO
 *
 * A árvore tem 17 modelos `.docx` referenciados no `src/`. O 16 é o que o dono
 * do projeto conta como documento distinto oferecido ao corretor, e ficou como
 * ele disse, um a MENOS que os arquivos: errar para baixo não vira promessa que
 * o produto não cumpre. Quem for mexer no número confere pelos formulários, não
 * pelo `ls` da pasta de modelos.
 *
 * O ANO NA FRENTE, O MÊS ATRÁS
 *
 * Quem faz 4 negócios por ano não pensa em mês. Pensando por mês, a pergunta
 * vira "vou usar em setembro?", e a resposta honesta é "talvez não", que leva
 * ao cancelamento. Pensando por ano, a pergunta vira "R$ 690 valem menos do que
 * um advogado cobra por UM contrato?", e aí a resposta é óbvia. Por isso o
 * número grande do cartão é o do ano e o mês virou nota.
 *
 * O mensal continua existindo e continua R$ 69: ele é a referência da metade do
 * preço prometida na landing da Prime Circle ("Prime Circle Docs pela metade:
 * R$ 35 por mês"). Mexer nele quebra aquela página.
 *
 * "O QUE LANÇARMOS ENTRA SEM CUSTO": O QUE ESSA FRASE PROMETE E O QUE NÃO
 *
 * O pedido original era "toda funcionalidade futura incluída" no Profissional e
 * no Imobiliária. A frase foi estreitada de propósito, por duas razões.
 *
 * A primeira: promessa aberta amarra o produto ao que ainda não existe. Se um
 * dia um recurso tiver custo por uso (IA mais cara, base licenciada, integração
 * paga), a escolha vira entregar no prejuízo ou voltar atrás com quem já pagou,
 * e voltar atrás é o que este público menos perdoa. Por isso a frase fala de
 * RECURSO DO SISTEMA e deixa serviço de gente fora, com o canal do especialista
 * nomeado no próprio cartão como o exemplo.
 *
 * A segunda: o código é um só, e quase toda novidade aparece para todo mundo,
 * Individual incluído. Prometer "novidade" só aos dois planos de cima ou não
 * significaria nada, ou obrigaria a bloquear recurso de propósito. Então o que
 * se promete não é RECEBER novidade, é ela NÃO VIRAR COBRANÇA: enquanto o plano
 * estiver ativo, o que entrar não gera custo a mais nem reajuste no meio do ano.
 * Isso é verificável e casa com o preço travado por 12 meses.
 */

// A aba escolhe qual par preço/unidade aparece. O Avulso repete o mesmo valor
// nos dois lados de propósito: ele não é mensal nem anual, é por operação, e
// tirar ele da grade só para caber no seletor deixaria o cartão órfão. Repetir
// custa duas linhas e mantém a grade inteira sob a mesma regra.
type PorCiclo = { anual: string; mensal: string }

type Ciclo = keyof PorCiclo

type Plano = {
  id: string
  nome: string
  preco: PorCiclo
  unidade: PorCiclo
  nota?: PorCiclo
  // Selo do topo do cartão. Existe por causa do preço de lançamento do avulso:
  // sem ele, "vai para R$ 349 em 31 de dezembro" fica escondido na nota miúda,
  // e o aviso que justifica o preço de hoje é justamente o que precisa ser
  // visto antes do número.
  selo?: string
  destaque?: boolean
  itens: string[]
}

const PLANOS: Plano[] = [
  {
    id: 'avulso',
    nome: 'Avulso',
    preco: { anual: 'R$ 149', mensal: 'R$ 149' },
    unidade: { anual: 'por negócio', mensal: 'por negócio' },
    selo: 'Preço de lançamento',
    nota: {
      anual:
        'Uma operação, 30 dias para usar. Sem assinatura e sem renovação automática. Vai para R$ 349 em 31 de dezembro de 2026.',
      mensal:
        'Uma operação, 30 dias para usar. Sem assinatura e sem renovação automática. Vai para R$ 349 em 31 de dezembro de 2026.',
    },
    itens: [
      'Os 16 documentos da operação, em Word',
      'Correções ilimitadas',
      'Uma validação de minuta com IA',
      'Consulta de dúvidas com a IA',
      'O dossiê fica na sua conta depois',
    ],
  },
  {
    id: 'corretor',
    nome: 'Individual',
    preco: { anual: 'R$ 690', mensal: 'R$ 69' },
    unidade: { anual: 'por ano', mensal: 'por mês' },
    nota: {
      anual: 'Dois meses de graça, e o preço fica travado por 12 meses. Até 10 operações por mês.',
      mensal: 'Cancela quando quiser. Até 10 operações por mês.',
    },
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
    preco: { anual: 'R$ 970', mensal: 'R$ 97' },
    unidade: { anual: 'por ano', mensal: 'por mês' },
    nota: {
      anual: 'Dois meses de graça, e o preço fica travado por 12 meses. Até 30 operações por mês.',
      mensal: 'Cancela quando quiser. Até 30 operações por mês.',
    },
    destaque: true,
    itens: [
      'Tudo do Individual, com três vezes o teto',
      'Validação de minuta, 60 por mês',
      'O que a gente lançar entra sem custo enquanto o plano estiver ativo',
      'Canal do especialista, orçado à parte',
    ],
  },
  {
    id: 'imobiliaria',
    nome: 'Imobiliária',
    preco: { anual: 'R$ 1.970', mensal: 'R$ 197' },
    unidade: { anual: 'por ano, 3 assentos', mensal: 'por mês, 3 assentos' },
    nota: {
      anual:
        'Dois meses de graça, e o preço fica travado por 12 meses. Assento adicional R$ 59 por mês.',
      mensal: 'Cancela quando quiser. Assento adicional R$ 59 por mês.',
    },
    itens: [
      'Quem só acompanha entra de graça, sem limite de gente',
      'Equipe, com convite por e-mail e aceite do termo',
      'Negócios da casa e trilha de acesso',
      'Régua jurídica própria da imobiliária',
      'O que a gente lançar entra sem custo enquanto o plano estiver ativo',
    ],
  },
]

export default function PlanosPage() {
  const { user, plano, planoAtivo, trialDiasRestantes, negociosNoMes, planoLimiteNegocios } =
    useAuth()
  const navigate = useNavigate()
  // Abre no ANUAL de propósito. Abrir no mensal reconstrói a pergunta que faz o
  // corretor de 4 negócios por ano cancelar ("vou usar em setembro?"). No ano a
  // pergunta é outra: "R$ 690 valem menos do que um advogado cobra por um
  // contrato?".
  const [ciclo, setCiclo] = useState<Ciclo>('anual')
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
    // Visitante sem conta: o caminho é criar a conta primeiro. O teste de 15
    // dias começa aí, e o pedido de assinatura pode esperar ele conhecer.
    if (!user?.id) {
      navigate('/signup')
      return
    }
    setEnviando(p.id)
    try {
      await pb.collection('chamados').create({
        user: user?.id,
        tipo: 'assinatura',
        // A unidade carrega o ciclo ("por ano" / "por mês" / "por negócio"). Sem
        // isso chega um pedido de assinatura e ninguém sabe se a pessoa
        // escolheu o mês ou o ano, e a cobrança ainda é fechada à mão.
        mensagem: `Quero assinar o plano ${p.nome} (${p.preco[ciclo]} ${p.unidade[ciclo]}).`,
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
          Teste grátis por 15 dias, use em uma operação avulsa, ou assine o ano e resolva a
          documentação de todos os seus negócios.
        </p>
      </div>

      {/* Onde o corretor está hoje. Uma página de preços que não diz isso obriga
          ele a sair para descobrir, e quem está prestes a pagar não deveria
          precisar procurar. */}
      {user && !carregando && (
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

      {/* Seletor de ciclo. O rótulo do anual carrega o benefício e não só a
          palavra: "Anual" sozinho é uma opção, "2 meses grátis" é um motivo. */}
      <div
        role="group"
        aria-label="Escolha o ciclo de cobrança"
        className="inline-flex rounded-lg border border-border bg-card p-1"
      >
        {(['anual', 'mensal'] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCiclo(c)}
            aria-pressed={ciclo === c}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              ciclo === c
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {c === 'anual' ? 'Anual, 2 meses grátis' : 'Mensal'}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PLANOS.map((p) => (
          <Card
            key={p.id}
            className={cn(
              'relative',
              p.destaque ? 'border-primary/50 shadow-elevation' : 'border-border/60',
            )}
          >
            {p.destaque ? (
              <Badge className="absolute -top-2.5 left-4">
                <Sparkles className="mr-1 h-3 w-3" /> Recomendado
              </Badge>
            ) : (
              // Contorno em vez de preenchido, e `bg-card` em vez de
              // `bg-background`: o selo fica em cima da borda do cartão, e o
              // fundo da página ali embaixo abriria um buraco visível. O
              // ternário garante que nenhum cartão receba dois selos.
              p.selo && (
                <Badge
                  variant="outline"
                  className="absolute -top-2.5 left-4 border-primary/30 bg-card font-medium text-primary"
                >
                  {p.selo}
                </Badge>
              )
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
                    {p.preco[ciclo]}
                  </div>
                  <div className="text-xs text-muted-foreground">{p.unidade[ciclo]}</div>
                </div>
                {p.nota && (
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {p.nota[ciclo]}
                  </p>
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
            Em cada negócio você cadastra os dados uma vez, gera todos os documentos e corrige
            quantas vezes precisar, sem custo a mais. Checklist, termo de chaves, termo de posse e
            recibo de comissão não contam como operação: pertencem a um negócio que já existe.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Modelos prontos resolvem um arquivo</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            O Prime Circle Docs organiza a operação inteira: partes, imóvel, comissão, documentos em
            Word e validação com IA no mesmo fluxo. Seus dados continuam seus, com ou sem plano:
            nada é apagado e nada fica preso aqui dentro.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            A partir do quinto negócio, o ano sai mais barato
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Cinco negócios avulsos custam R$ 745. O ano do Individual custa R$ 690 e dá mais
            operações e mais validações. Quem fecha três ou quatro por ano fica bem no Avulso, sem
            assinar nada: a conta é sua, e ela está aqui na mesa. Depois de 31 de dezembro de 2026,
            com o Avulso a R$ 349, a virada passa para o segundo negócio.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">O que cabe num Avulso</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            16 documentos padronizados, escritos sobre o que o Código Civil orienta para cada ato e
            revisados por advogado e por escrevente de cartório. Junto vem o fluxo todo: leitura dos
            documentos com IA, o negócio montado com as partes e o imóvel, a validação da minuta e a
            consulta de dúvidas. A operação inteira, da autorização de venda ao recibo de comissão.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            Quem entra agora paga R$ 149, e depois são R$ 349
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            R$ 349 é o preço do Avulso, e é o preço da operação inteira descrita aí em cima. Até 31
            de dezembro de 2026 ele sai por R$ 149: quem chega no começo paga menos, e continua
            pagando menos em cada avulso que comprar até essa data. R$ 149 é o preço de hoje, não é
            desconto sobre preço que ninguém pagou, e a data em que ele muda está escrita aqui.
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            O Avulso custa mais que um mês de assinatura, e isso é de propósito: aqui você não deixa
            cartão e não tem renovação para lembrar de cancelar.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">
            O que a gente lançar já está no seu plano
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Nos planos Profissional e Imobiliária, o que for lançado entra sem custo a mais enquanto
            o seu plano estiver ativo, e sem reajuste no meio do seu ano. A exceção é serviço de
            gente, não recurso do sistema: o canal do especialista continua orçado caso a caso.
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">A conta de referência</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            No mercado, uma única minuta com advogado custa de R$ 800 a R$ 2.500, e a análise de
            documentos é cobrada à parte. Os 16 modelos daqui já passaram por advogado e por
            escrevente de cartório. Aqui o Avulso cobre a operação inteira por R$ 149 até 31 de
            dezembro de 2026, e a assinatura inclui a validação. O advogado continua no lugar certo:
            na análise do caso concreto, não na papelada repetitiva.
          </p>
        </div>
      </div>
    </div>
  )
}
