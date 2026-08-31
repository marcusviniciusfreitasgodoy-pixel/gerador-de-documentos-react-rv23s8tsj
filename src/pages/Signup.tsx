import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, FileText } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getErrorMessage } from '@/lib/pocketbase/mensagens'

// ─────────────────────────────────────────────────────────────────────────────
// PORTA DE ENTRADA (pagina de abertura) — REVISAO DE AGOSTO/2026
//
// Quem chega em www.documentos.primecircle.app.br sem conta ve o componente
// `Abertura`; o ProtectedRoute o mostra na rota "/" quando nao ha sessao, e o
// Layout suprime o proprio cabecalho/rodape nessa rota (a Abertura traz os seus).
// Logado, "/" segue mostrando o hub de documentos, intacto.
//
// HERO DE 31/08/2026: PROMESSA NO TOPO, DOR NO § 01
//
// O hero antigo fazia DOR ("O seu nao devia terminar em improviso") e o § 01,
// tres telas abaixo, fazia dor de novo e melhor, com o R$ 800 a R$ 2.500 em
// display. A pagina cutucava a ferida duas vezes seguidas e so prometia depois.
// Agora o hero faz PROMESSA e o § 01 fica com a dor, sozinho.
//
// E o H1 antigo abria acusando o leitor de improvisar. Este publico tem orgulho
// do oficio: acusacao na primeira frase e mau comeco.
//
// O H1 novo ESTREITA o hero para o autonomo, e isso foi escolha, nao descuido:
// hero que fala com uma pessoa converte mais que hero que hedge. A imobiliaria
// continua endereçada pelo eyebrow ("Para corretores e imobiliarias"), pelo
// § 05 e pela /imobiliarias. Se um dia a imobiliaria virar o publico principal,
// e este H1 que muda.
//
// O subtitulo manteve as duas ancoras concretas que o hero nao pode perder: a
// fundamentacao no Codigo Civil (credibilidade verificavel) e o dossie
// ("cadastra o negocio uma vez"), que e o diferencial de verdade. Uma versao
// so de posicionamento, sem mecanismo, nao responde ao "como" que este publico
// faz antes de acreditar.
//
// FICOU DE FORA de proposito: "os mesmos instrumentos, na mesma ordem, com a
// MESMA CONFERENCIA" e "em minutos". A equivalencia de conferencia com uma
// grande imobiliaria e forte demais para um parametro que ninguem confere, e
// "em minutos" e numero testavel na primeira sessao. "Na hora" entrega a mesma
// ideia sem cronometro.
//
// CORTE DE 29/08/2026: A PAGINA ESTAVA LONGA DEMAIS, E ISSO FOI MEDIDO
//
// Antes: 14.277 px a 1440 (15,9 telas) e 19.988 px a 390 (23,7 telas), com
// 2.666 palavras visiveis. Para um publico que decide em minutos, o preco e o
// cadastro estavam depois da 20a tela no celular.
//
// A pagina se repetia: "sem cartao" aparecia 8 vezes, "15 dias" 7, "dossie" 9,
// "nao substitui advogado" 5. O caso pior era o § 06 e a primeira pergunta do
// FAQ dizendo o MESMO paragrafo reescrito, com 1.900 px entre os dois.
//
// O que saiu, e para onde:
// A. O CATALOGO DOS 16 e a secao das IMOBILIARIAS foram para paginas proprias
//    (/documentos e /imobiliarias, em src/pages/Documentos.tsx). Os dois
//    respondem a pergunta que o visitante so faz DEPOIS de se interessar. Na
//    abertura ficou a chamada curta, com os 16 nomes ainda visiveis no § 03.
// B. FAQ de 8 para 5 perguntas. "Quanto custa?" saiu por duplicar o § 06;
//    "Como e o cadastro?" por duplicar o hero e o CTA final; "validade
//    juridica" foi fundida na pergunta do advogado, que passou a ser a aberta
//    por padrao (e a objecao mais funda deste publico).
// C. § 01 de cinco dores para tres. Saiu "Os mesmos dados, cinco vezes" (era o
//    § 02 antecipado) e "A comissao no fio do combinado", a mais fraca.
// D. § 02 perdeu o sub-bloco "O dossie do negocio": os tres cartoes dele
//    repetiam o passo 02 logo acima, palavra por palavra. A frase da
//    privacidade saiu daqui e continua dita no FAQ, uma vez so.
// E. "A prova esta no documento" perdeu o ensaio e os tres cartoes; ficou o
//    trecho de clausula, que MOSTRA em vez de afirmar, e o "Quem escreveu".
// F. Apoio de especialista comprimido: eram 219 palavras vendendo forte um
//    recurso que a /planos cobra a parte, e isso gera atrito no desconfiado.
//
// ANCORA DE PRECO, as duas pontas que estavam soltas. O § 01 dizia que uma
// minuta avulsa custa R$ 800 a R$ 2.500 no mercado, e o § 06 "Preco" nao tinha
// preco nenhum: so "15 dias gratis" e um link. A ancora e o pagamento dela
// ficavam a 7.000 px de distancia. Agora o numero e display no cartao 01 (era
// corpo de 14,5 px no meio de um paragrafo) e o § 06 fecha a conta com "a
// partir de R$ 69 por mes". A TABELA continua so na /planos, de proposito: se
// o valor mudar la, aqui muda uma frase, nao quatro cartoes.
//
// MOLDURA COMPARTILHADA. Cabecalho e rodape viraram `montarCabecalho()` e
// `DESIGN_RODAPE`, e a maquinaria virou `PaginaDesign({ html })`. As tres
// paginas usam a mesma implementacao: cabecalho copiado diverge na terceira
// edicao e ninguem percebe ate um cliente apontar. O menu das paginas de apoio
// NAO leva ancora de secao (#preco, #funciona), que la seria link morto.
//
// O QUE MUDOU NESTA REVISAO (e por que):
//
// 1. HERO ENXUTO. Acima da dobra ficaram cinco elementos: eyebrow, titulo,
//    subtitulo, UM botao de ouro e a arte. O par "Gerar / Validar" desceu para o
//    § 02 (onde explica, em vez de competir) e a fileira de chips mono saiu,
//    porque a linha sob o botao ja diz "15 dias gratis, sem cartao".
// 2. ENTRADA ENCENADA. O hero anima no carregamento, em ~900 ms, na ordem da
//    leitura (eyebrow, regua de ouro, titulo, subtitulo, botao, arte). E CSS
//    puro com animation-fill-mode: both, sem JavaScript: se o script falhar,
//    nada fica invisivel.
// 3. REVELACAO POR ELEMENTO, NAO POR SECAO. O reveal antigo animava a secao
//    inteira, e as secoes tem milhares de pixels: dava um bloco piscando. Agora
//    o observer olha os elementos marcados [data-anim] e entra em cascata de
//    70 ms por grupo de irmaos. Mantida a rede de seguranca de 2,5 s.
// 4. FAIXA DE DADOS com contagem (16 documentos, 1 cadastro, 3 fases, 30 dias),
//    logo abaixo do hero: os numeros eram o fato mais forte da pagina e estavam
//    soltos dentro de paragrafos.
// 5. HOVER DE VERDADE. O style-hover reescrevia o atributo style inteiro no
//    mouseenter: sem transicao na saida, sem teclado, sem toque. Os cartoes
//    agora usam [data-card] e a funcao `superficie` abaixo, que toca so as
//    propriedades do estado e responde a foco tambem.
// 6. CABECALHO QUE CONDENSA depois de 120 px (72 -> 56 px, subtitulo fora), e
//    PARALLAX de no maximo 14 px na arte do hero, so com transform.
// 7. CATALOGO DO § 03: em vez de 16 cartoes iguais, um cartao ancora por grupo
//    (titulo em Cormorant) e o resto em linhas compactas.
// 8. SECAO DE PRECO com endereco proprio (#preco). O item "Preco" do menu
//    apontava para o FAQ; agora aponta para a resposta.
// 9. FAQ EM ACORDEAO, com a pergunta de preco aberta por padrao. Eram mais de
//    mil palavras abertas logo antes do CTA final.
// 10. FOCO VISIVEL em links e botoes, e o H1 sem <br> forcado (text-wrap:
//     balance resolve a quebra).
//
// PENDENCIAS CONHECIDAS (nao dependem deste arquivo):
// - As duas capturas de tela sairam do hero. Elas viajavam como data-URI dentro
//   desta string (~80 KB no bundle, sem cache e sem lazy). O certo e por os
//   arquivos em /public e voltar com <img width height loading="lazy">.
// - O trecho de clausula da secao "A prova esta no documento" e ilustrativo.
//   Trocar pelo texto exato que sai do gerador.
// - Alinhar og:title do index.html com o H1 desta pagina.
//
// Regra de redacao do Marcus: sem travessao no texto visivel.
// ─────────────────────────────────────────────────────────────────────────────

const DESIGN_CSS = `html { scroll-behavior: smooth; }
body { margin: 0; background: #F7F3EA; color: #0E0E0E; font-family: Manrope, system-ui, sans-serif; font-weight: 300; -webkit-font-smoothing: antialiased; }
* { box-sizing: border-box; }
p { text-wrap: pretty; }
h1, h2, h3 { text-wrap: balance; }
a { color: #7a6435; text-decoration: none; }
a:hover { color: #0E0E0E; }
a:focus-visible, button:focus-visible, summary:focus-visible { outline: 2px solid #C9A84C; outline-offset: 3px; }
@keyframes pcSubir { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes pcRegua { from { transform: scaleX(0); } to { transform: scaleX(1); } }
[data-cta-fixo], [data-mobile-only] { display: none; }
@media (max-width: 900px) {
  [data-cta-fixo] { display: flex; }
  [data-nav-links] { display: none !important; }
  [data-hero-art], [data-desk-only] { display: none !important; }
  [data-mobile-only] { display: block; }
}
@media (min-width: 901px) { footer { padding-bottom: 0 !important; } }
[data-menu-caixa], [data-menu-botao], [data-menu-mobile] { display: none; }
@media (max-width: 900px) {
  [data-menu-botao] { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; margin-right: -8px; cursor: pointer; color: #F5F1E6; }
  [data-menu-botao] svg { width: 22px; height: 22px; }
  [data-menu-botao] [data-icone-x] { display: none; }
  [data-menu-caixa]:checked ~ div [data-menu-botao] [data-icone-abrir] { display: none; }
  [data-menu-caixa]:checked ~ div [data-menu-botao] [data-icone-x] { display: block; }
  [data-menu-caixa]:checked ~ [data-menu-mobile] { display: flex; }
  [data-menu-mobile] { flex-direction: column; padding: 6px clamp(20px,5vw,60px) 22px; border-top: 1px solid rgba(245,241,230,.10); background: #0E0E0E; }
  [data-menu-mobile] a { font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: rgba(232,224,204,.78); padding: 14px 0; border-bottom: 1px solid rgba(245,241,230,.06); }
  [data-menu-mobile] a[data-menu-cta] { margin-top: 14px; display: inline-flex; align-items: center; justify-content: center; height: 48px; border-radius: 999px; background: #C9A84C; color: #0E0E0E; font-family: Manrope, sans-serif; font-size: 14px; font-weight: 600; letter-spacing: normal; text-transform: none; padding: 0; border-bottom: none; }
}
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; } }`

// ── Moldura compartilhada ───────────────────────────────────────────────────
// O cabeçalho e o rodapé são os mesmos na abertura e nas páginas públicas de
// apoio (/documentos e /imobiliarias). Ficam aqui, montados por função, em vez
// de copiados nos três arquivos: cabeçalho duplicado é o tipo de coisa que
// diverge na terceira edição e ninguém percebe até um cliente apontar.
//
// A lista de itens é parâmetro porque as âncoras de seção (#preco, #funciona)
// só existem na abertura. Numa página de apoio elas seriam link morto: clica e
// não acontece nada. Por isso a página de apoio passa a própria lista curta.
type ItemMenu = { href: string; texto: string }

const NAV_ABERTURA: ItemMenu[] = [
  { href: '#preco', texto: 'Preço' },
  { href: '#funciona', texto: 'Como funciona' },
  { href: '#documentos', texto: 'Documentos' },
  { href: '#validador', texto: 'Validador' },
]

// Páginas de apoio: sem âncora de seção, com a volta para a abertura.
export const NAV_APOIO: ItemMenu[] = [{ href: '/', texto: 'Início' }]

export function montarCabecalho(itens: ItemMenu[], inicio: string) {
  const ESTILO_LINK =
    "flex:none;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(232,224,204,.72);transition:color 180ms cubic-bezier(.22,.61,.36,1)"
  const desktop = itens
    .map(
      (i) =>
        `        <a href="${i.href}" style="${ESTILO_LINK}" style-hover="color:#F5F1E6">${i.texto}</a>`,
    )
    .join('\n')
  const mobile = itens.map((i) => `      <a href="${i.href}">${i.texto}</a>`).join('\n')
  return `  <header data-header style="position:sticky;top:0;z-index:50;background:#0E0E0E;border-bottom:1px solid rgba(245,241,230,.10);transition:height 220ms cubic-bezier(.22,.61,.36,1)">
    <input type="checkbox" id="pc-menu" data-menu-caixa aria-hidden="true">
    <div data-header-inner style="max-width:1120px;margin:0 auto;padding:0 clamp(20px,5vw,60px);height:72px;display:flex;align-items:center;justify-content:space-between;gap:20px;transition:height 220ms cubic-bezier(.22,.61,.36,1)">
      <a href="${inicio}" style="display:flex;align-items:center;gap:11px;color:#F5F1E6;flex:none">
        <svg viewBox="0 0 100 100" role="img" aria-label="Prime Circle" style="width:30px;height:30px;flex:none"><circle cx="36" cy="50" r="30" stroke="#C9A84C" stroke-width="4" fill="none"></circle><circle cx="64" cy="50" r="30" stroke="#F5F1E6" stroke-width="4" fill="none"></circle><circle cx="50" cy="50" r="4" fill="#C9A84C"></circle></svg>
        <span style="display:flex;flex-direction:column;line-height:1">
          <span style="font-size:15px;font-weight:700;letter-spacing:-.01em;color:#F5F1E6">Prime Circle</span>
          <span data-header-sub style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.34em;text-transform:uppercase;color:#C9A84C;margin-top:5px;transition:opacity 200ms cubic-bezier(.22,.61,.36,1),max-height 200ms cubic-bezier(.22,.61,.36,1);overflow:hidden;max-height:14px">Docs</span>
        </span>
      </a>
      <nav data-nav-links style="display:flex;align-items:center;gap:clamp(12px,2vw,26px)">
${desktop}
        <a href="/login" style="flex:none;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(232,224,204,.72);transition:color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#F5F1E6">Entrar</a>
        <a href="/signup" style="flex:none;display:inline-flex;align-items:center;height:40px;padding:0 22px;border-radius:999px;background:#C9A84C;color:#0E0E0E;font-size:13px;font-weight:600;transition:background 200ms cubic-bezier(.22,.61,.36,1)" style-hover="background:#F5F1E6">Criar conta grátis</a>
      </nav>
      <label for="pc-menu" data-menu-botao aria-label="Abrir e fechar o menu">
        <svg data-icone-abrir viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        <svg data-icone-x viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"></line><line x1="19" y1="5" x2="5" y2="19"></line></svg>
      </label>
    </div>
    <nav data-menu-mobile aria-label="Menu">
${mobile}
      <a href="/planos">Planos e valores</a>
      <a href="/login">Entrar</a>
      <a href="/signup" data-menu-cta>Criar conta grátis</a>
    </nav>
  </header>`
}

export const DESIGN_RODAPE = `  <footer style="background:#0E0E0E;border-top:1px solid rgba(245,241,230,.10);color:rgba(232,224,204,.55);padding-bottom:88px">
    <div style="max-width:1120px;margin:0 auto;padding:44px clamp(20px,5vw,60px);display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:11px">
        <svg viewBox="0 0 100 100" role="img" aria-label="Prime Circle" style="width:24px;height:24px;flex:none"><circle cx="36" cy="50" r="30" stroke="#C9A84C" stroke-width="4" fill="none"></circle><circle cx="64" cy="50" r="30" stroke="#F5F1E6" stroke-width="4" fill="none"></circle><circle cx="50" cy="50" r="4" fill="#C9A84C"></circle></svg>
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:rgba(232,224,204,.6)">Prime Circle · Docs</span>
      </div>
      <p style="margin:0;font-family:'JetBrains Mono',monospace;font-size:10px;line-height:1.9;letter-spacing:.14em;text-transform:uppercase;color:rgba(232,224,204,.5)">Prime Circle<br>CNPJ 58.409.058/0001-73<br>CRECI PJ 11841</p>
      <p style="margin:0;max-width:560px;font-size:12.5px;line-height:1.7;color:rgba(232,224,204,.72)">
        A plataforma gera documentos a partir de modelos fundamentados no Código Civil. A conferência final, a adequação ao caso concreto e a validação jurídica permanecem sob responsabilidade do usuário e de sua assessoria.
      </p>
    </div>
  </footer>

  <div data-cta-fixo style="position:fixed;left:0;right:0;bottom:0;z-index:60;background:#0E0E0E;border-top:1px solid rgba(201,168,76,.35);padding:10px 16px calc(10px + env(safe-area-inset-bottom));align-items:center;justify-content:space-between;gap:12px">
    <a href="/login" style="font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:rgba(232,224,204,.72)">Entrar</a>
    <a href="/signup" style="display:inline-flex;align-items:center;height:44px;padding:0 24px;border-radius:999px;background:#C9A84C;color:#0E0E0E;font-size:14px;font-weight:600">Criar conta grátis</a>
  </div>`

const DESIGN_HTML = `<div style="background:#F7F3EA">

${montarCabecalho(NAV_ABERTURA, '#topo')}

  <section id="topo" style="background:#0E0E0E;color:#F5F1E6;overflow:hidden">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(64px,10vw,116px) clamp(20px,5vw,60px) clamp(72px,11vw,124px);display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:clamp(36px,5vw,64px);align-items:center">
      <div style="min-width:0">
        <p style="margin:0 0 10px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#C9A84C;opacity:0;animation:pcSubir 560ms cubic-bezier(.22,.61,.36,1) 60ms both">Para corretores e imobiliárias</p>
        <div style="width:56px;height:1px;background:rgba(201,168,76,.6);transform-origin:left;margin-bottom:26px;animation:pcRegua 520ms cubic-bezier(.22,.61,.36,1) 200ms both"></div>
        <h1 style="margin:0;max-width:17ch;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(38px,4.8vw,58px);line-height:1.04;letter-spacing:-.02em;color:#F5F1E6;opacity:0;animation:pcSubir 700ms cubic-bezier(.22,.61,.36,1) 280ms both">
          A documentação de uma grande imobiliária, <em style="font-style:italic;color:#C9A84C">na mão do corretor autônomo.</em>
        </h1>
        <p style="margin:26px 0 0;max-width:500px;font-size:clamp(15.5px,1.4vw,17px);line-height:1.7;color:rgba(232,224,204,.80);opacity:0;animation:pcSubir 700ms cubic-bezier(.22,.61,.36,1) 400ms both">
          Os mesmos instrumentos, na mesma ordem, fundamentados no Código Civil. Você cadastra o negócio uma vez e gera todos eles na hora, sem esperar por ninguém.
        </p>
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:22px;margin-top:34px;opacity:0;animation:pcSubir 700ms cubic-bezier(.22,.61,.36,1) 520ms both">
          <a href="/signup" style="display:inline-flex;align-items:center;height:54px;padding:0 32px;border-radius:999px;background:#C9A84C;color:#0E0E0E;font-size:15px;font-weight:600;transition:background 200ms cubic-bezier(.22,.61,.36,1),transform 200ms cubic-bezier(.22,.61,.36,1)" style-hover="background:#F5F1E6;transform:translateY(-1px)">Criar conta e gerar meu primeiro documento</a>
          <a href="#documentos" style="font-size:15px;color:#F5F1E6;border-bottom:1px solid rgba(201,168,76,.5);padding-bottom:2px;transition:border-color 180ms cubic-bezier(.22,.61,.36,1),color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#C9A84C;border-bottom-color:#C9A84C">Ver os 16 documentos</a>
        </div>
        <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:rgba(232,224,204,.55);opacity:0;animation:pcSubir 700ms cubic-bezier(.22,.61,.36,1) 620ms both">15 dias grátis, sem cartão. Você confirma o e-mail e entra: ninguém precisa aprovar nada.</p>
        <div data-mobile-only style="margin-top:34px;border:1px solid rgba(245,241,230,.14);line-height:0">
          <img src="data:image/webp;base64,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" alt="Tela inicial da plataforma, com os documentos organizados por fase da operação" style="width:100%;display:block">
        </div>
      </div>

      <div data-hero-art style="position:relative;min-width:0;opacity:0;animation:pcSubir 800ms cubic-bezier(.22,.61,.36,1) 700ms both">
        <div data-parallax="-4" style="border:1px solid rgba(245,241,230,.14);box-shadow:0 40px 90px -24px rgba(0,0,0,.85);overflow:hidden;line-height:0;will-change:transform">
          <img src="data:image/webp;base64,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" alt="Tela inicial da plataforma, com os documentos organizados por fase da operação" style="width:100%;display:block">
        </div>
        <div data-doc-card style="position:relative;z-index:2;margin-left:-30px;margin-top:-72px;width:68%;background:#FDFBF6;padding:20px 20px 22px;box-shadow:0 30px 70px -18px rgba(0,0,0,.8);transform:rotate(-1.4deg);pointer-events:none">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:12px;border-bottom:1px solid #E8E0CC">
            <span style="font-family:'JetBrains Mono',monospace;font-size:7px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">Prime Circle</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:7px;letter-spacing:.16em;color:#6B645B">.DOCX</span>
          </div>
          <p style="margin:16px 0 4px;font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;font-weight:600;line-height:1.22;color:#0E0E0E;text-align:center">Promessa de Compra e Venda</p>
          <p style="margin:0 0 18px;font-family:'JetBrains Mono',monospace;font-size:7px;letter-spacing:.2em;text-transform:uppercase;color:#6B645B;text-align:center">Modalidade financiada</p>
          <div style="display:flex;flex-direction:column;gap:7px">
            <div style="height:5px;background:#EFE8D7;width:100%"></div>
            <div style="height:5px;background:#EFE8D7;width:94%"></div>
            <div style="height:5px;background:#E8E0CC;width:48%"></div>
            <div style="height:5px;background:#EFE8D7;width:100%"></div>
            <div style="height:5px;background:#EFE8D7;width:76%"></div>
          </div>
          <div style="display:flex;gap:14px;margin-top:22px">
            <div style="flex:1"><div style="height:1px;background:#0E0E0E"></div><p style="margin:6px 0 0;font-family:'JetBrains Mono',monospace;font-size:6.5px;letter-spacing:.14em;text-transform:uppercase;color:#6B645B">Vendedor</p></div>
            <div style="flex:1"><div style="height:1px;background:#0E0E0E"></div><p style="margin:6px 0 0;font-family:'JetBrains Mono',monospace;font-size:6.5px;letter-spacing:.14em;text-transform:uppercase;color:#6B645B">Comprador</p></div>
          </div>
        </div>
        <div data-parallax="5" style="position:absolute;right:0;bottom:2px;display:flex;align-items:center;background:#C9A84C;color:#0E0E0E;padding:11px 18px;box-shadow:0 14px 34px -10px rgba(0,0,0,.7);pointer-events:none;will-change:transform">
          <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase">Pronto em Word</span>
        </div>
      </div>
    </div>
  </section>

  <section style="background:#0E0E0E;border-top:1px solid rgba(245,241,230,.10)">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(36px,4.5vw,56px) clamp(20px,5vw,60px);display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:clamp(24px,3vw,40px)">
      <div data-anim style="border-top:1px dashed rgba(245,241,230,.22);padding-top:18px">
        <p style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(38px,4vw,52px);font-weight:500;line-height:1;color:#C9A84C"><span data-count="16">16</span></p>
        <p style="margin:10px 0 0;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(232,224,204,.6)">documentos em Word</p>
      </div>
      <div data-anim style="border-top:1px dashed rgba(245,241,230,.22);padding-top:18px">
        <p style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(38px,4vw,52px);font-weight:500;line-height:1;color:#C9A84C"><span data-count="1">1</span></p>
        <p style="margin:10px 0 0;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(232,224,204,.6)">cadastro por negócio</p>
      </div>
      <div data-anim style="border-top:1px dashed rgba(245,241,230,.22);padding-top:18px">
        <p style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(38px,4vw,52px);font-weight:500;line-height:1;color:#C9A84C"><span data-count="3">3</span></p>
        <p style="margin:10px 0 0;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(232,224,204,.6)">fases, da captação às chaves</p>
      </div>
      <div data-anim style="border-top:1px dashed rgba(245,241,230,.22);padding-top:18px">
        <p style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(38px,4vw,52px);font-weight:500;line-height:1;color:#C9A84C"><span data-count="30">30</span></p>
        <p style="margin:10px 0 0;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(232,224,204,.6)">dias até o expurgo LGPD</p>
      </div>
    </div>
  </section>

  <section id="dores" style="background:#F7F3EA">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">§ 01 · O problema</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:30px"></div>
      <h2 data-anim style="margin:0;max-width:760px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(32px,4.4vw,52px);line-height:1.06;letter-spacing:-.02em;color:#0E0E0E">
        Você fecha o negócio às seis. E passa a noite <em style="font-style:italic;color:#7a6435">consertando o contrato.</em>
      </h2>
      <div data-anim style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px;background:#DDD5C7;margin-top:52px;border:1px solid #DDD5C7">
        <div data-card style="background:#FDFBF6;padding:32px 28px;border-top:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1),transform 180ms cubic-bezier(.22,.61,.36,1)">
          <p style="margin:0 0 14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:#C9A84C">01</p>
          <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;letter-spacing:.01em;color:#0E0E0E">A conta do advogado, documento por documento</h3>
          <p style="margin:0 0 10px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(28px,3.4vw,38px);line-height:1.05;letter-spacing:-.02em;color:#0E0E0E">R$ 800 a R$ 2.500</p>
          <p style="margin:0 0 16px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#8B7340">por minuta, no mercado</p>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">Você não tem departamento jurídico. Então ou usa um modelo de origem incerta, ou paga honorários por peça, por um contrato que já é rotina na sua carreira. Sai do mesmo bolso de onde vem a comissão.</p>
        </div>
        <div data-card style="background:#FDFBF6;padding:32px 28px;border-top:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1),transform 180ms cubic-bezier(.22,.61,.36,1)">
          <p style="margin:0 0 14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:#C9A84C">02</p>
          <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;letter-spacing:.01em;color:#0E0E0E">O modelo que circula no grupo</h3>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">Um arquivo de origem incerta, trocado de mão em mão. Você substitui os nomes e torce para não ter sobrado nada do negócio anterior no meio do texto.</p>
        </div>
        <div data-card style="background:#FDFBF6;padding:32px 28px;border-top:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1),transform 180ms cubic-bezier(.22,.61,.36,1)">
          <p style="margin:0 0 14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:#C9A84C">03</p>
          <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;letter-spacing:.01em;color:#0E0E0E">A minuta que chegou pronta</h3>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">O outro lado mandou o contrato e quer resposta hoje. Ou você paga alguém para ler a tempo, ou assina sem saber, com segurança, o que está escrito ali dentro.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="funciona" style="background:#F3EBE0;border-top:1px solid #DDD5C7">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">§ 02 · Como funciona</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:30px"></div>
      <h2 data-anim style="margin:0;max-width:720px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(32px,4.4vw,52px);line-height:1.06;letter-spacing:-.02em;color:#0E0E0E">
        Você preenche uma vez. A plataforma <em style="font-style:italic;color:#7a6435">escreve o resto.</em>
      </h2>

      <div data-anim style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1px;background:#DDD5C7;border:1px solid #DDD5C7;margin-top:48px">
        <div style="background:#FDFBF6;padding:30px 28px">
          <p style="margin:0 0 10px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.3em;text-transform:uppercase;color:#8B7340">Gerar</p>
          <p style="margin:0;font-size:15px;line-height:1.7;color:#5A544C">16 documentos em Word, das arras à entrega das chaves. O negócio entra uma vez e alimenta todos eles.</p>
        </div>
        <div style="background:#FDFBF6;padding:30px 28px">
          <p style="margin:0 0 10px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.3em;text-transform:uppercase;color:#8B7340">Validar</p>
          <p style="margin:0;font-size:15px;line-height:1.7;color:#5A544C">A minuta que o outro lado mandou, lida por IA, com o que está faltando apontado antes da assinatura.</p>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(28px,4vw,56px);margin-top:clamp(48px,6vw,72px)">
        <div data-anim>
          <p style="margin:0 0 18px;font-family:'Cormorant Garamond',Georgia,serif;font-size:52px;font-weight:500;line-height:1;letter-spacing:-.03em;color:#C9A84C">01</p>
          <h3 style="margin:0 0 12px;font-size:17px;font-weight:600;color:#0E0E0E">Seu perfil de corretor <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:#8B7340">uma vez, para sempre</span></h3>
          <p style="margin:0;font-size:15px;line-height:1.75;color:#5A544C">Nome, CRECI, percentual de comissão e chave PIX. Preenchidos uma vez, entram sozinhos na cláusula de corretagem de todos os documentos que você gerar.</p>
        </div>
        <div data-anim>
          <p style="margin:0 0 18px;font-family:'Cormorant Garamond',Georgia,serif;font-size:52px;font-weight:500;line-height:1;letter-spacing:-.03em;color:#C9A84C">02</p>
          <h3 style="margin:0 0 12px;font-size:17px;font-weight:600;color:#0E0E0E">O dossiê do negócio <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:#8B7340">uma vez por operação</span></h3>
          <p style="margin:0;font-size:15px;line-height:1.75;color:#5A544C">Partes e imóvel cadastrados uma única vez por operação. Todos os documentos daquele negócio carregam de lá, e o que você corrigir volta para o dossiê.</p>
        </div>
        <div data-anim>
          <p style="margin:0 0 18px;font-family:'Cormorant Garamond',Georgia,serif;font-size:52px;font-weight:500;line-height:1;letter-spacing:-.03em;color:#C9A84C">03</p>
          <h3 style="margin:0 0 12px;font-size:17px;font-weight:600;color:#0E0E0E">O documento em Word <span style="font-family:'JetBrains Mono',monospace;font-size:9.5px;font-weight:400;letter-spacing:.14em;text-transform:uppercase;color:#8B7340">quantas vezes precisar</span></h3>
          <p style="margin:0;font-size:15px;line-height:1.75;color:#5A544C">Escolha o documento e ele abre já preenchido. Confira o que é específico do caso, clique em gerar e baixe o arquivo .docx, aberto para edição final.</p>
        </div>
      </div>

      <div data-anim style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px;background:#DDD5C7;border:1px solid #DDD5C7;margin-top:clamp(40px,5vw,64px)">
        <div style="background:#FDFBF6;padding:30px 28px">
          <h3 style="margin:0 0 12px;font-size:17px;font-weight:600;color:#0E0E0E">O negócio muda. O documento acompanha.</h3>
          <p style="margin:0;font-size:15px;line-height:1.75;color:#5A544C">O financiamento não saiu e virou recurso próprio, a parcela única virou três, a posse mudou de data: você troca o documento sem redigitar uma linha, porque as partes e o imóvel continuam no dossiê. E quando o dado ainda não chegou, a certidão que sai amanhã ou o PIX que vem depois, o negócio fica salvo pela metade e você volta nele quando ele chegar.</p>
        </div>
      </div>

      <div data-anim style="margin-top:clamp(48px,6vw,72px);background:#0E0E0E;color:#F5F1E6;padding:clamp(30px,4vw,52px);display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);align-items:center">
        <div>
          <p style="margin:0 0 16px;display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#C9A84C">Preenchimento por IA<span style="display:block;width:40px;height:1px;background:rgba(201,168,76,.5)"></span></p>
          <h3 style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(26px,3.2vw,40px);line-height:1.1;letter-spacing:-.02em;color:#F5F1E6">Você sobe os documentos. A IA <em style="font-style:italic;color:#C9A84C">preenche o negócio.</em></h3>
          <p style="margin:22px 0 0;max-width:520px;font-size:15.5px;line-height:1.75;color:rgba(232,224,204,.80)">Suba a escritura, a matrícula e o RG das partes. A IA lê e devolve o negócio preenchido para você conferir. Você deixa de redigitar nome, CPF, estado civil e número de matrícula, que é exatamente onde mora o erro que só aparece no cartório.</p>
        </div>
        <div style="display:flex;flex-direction:column;gap:1px;background:rgba(245,241,230,.12);border:1px solid rgba(245,241,230,.12)">
          <div style="background:#161412;padding:16px 20px"><p style="margin:0 0 3px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:#C9A84C">Lê</p><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(232,224,204,.82)">Nome, CPF, RG e estado civil das partes</p></div>
          <div style="background:#161412;padding:16px 20px"><p style="margin:0 0 3px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:#C9A84C">Lê</p><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(232,224,204,.82)">Matrícula, endereço e descrição do imóvel</p></div>
          <div style="background:#161412;padding:16px 20px"><p style="margin:0 0 3px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.24em;text-transform:uppercase;color:#C9A84C">Você</p><p style="margin:0;font-size:13.5px;line-height:1.55;color:rgba(232,224,204,.82)">Confere e ajusta antes de gerar. A decisão é sempre sua.</p></div>
        </div>
        <div data-desk-only style="grid-column:1 / -1">
          <div style="border:1px solid rgba(245,241,230,.14);line-height:0">
            <img src="data:image/webp;base64,UklGRjh6AABXRUJQVlA4WAoAAAAQAAAABwcAQQIAQUxQSOgAAAABN0CYbTSL8/+cZjUiIrIDrGrbikIFKtAFC7hMMNz+Nfhydkf0Pyv/+c9//vOf//znP//5z3/+85///Oc///nPf/7zn//85z//+c9//vOf//znP//5z3/+85///Oc///nPf/7zn//85z//+c9//vOf//znP//5z3/+85///Oc///nPf/7zn//85z//+c9//vOf//znP//5z3/+85///Oc///nPf/7zn//85z//+c9//vOf//znP//5z3/+85///Oc///nPf/7zn//85z//fZBTMGV0XnqG15y0Lcme42+PYOE///nPf1oBVlA4ICp5AACQWgKdASoIB0ICPlUqkkcjoqGhIhLpCHAKiWlu/BNcQwDHoArqzOXcofYdrf+sJi6FAk1Qp6oPP0I/x9O08pO076H/7J6hPmU9Gf9s9AH7j+rT/4v2u92P+A9QDzhf/D7L/9v/0//39wf9setv/w3/t4Onpj+on9e/H/wD/tf90/xP+W/q/o7+L/J/2P+0f5T/Sf2z9ufr4+av6r+3fuF5zvOP3v/kf5r1N/j32D+9/3L/Mf7/+7fuZ8Jf4n+9/s5/ePR38v/V/8N/hv3W/w3yC/kn8s/wX9s/x//R/wvqL/6Pa27D/oP+3/j/YF9X/oX+3/wH+c/93+X9zr2D/I/4H/Ff9j+6///5L/M/7L/rf8D/kf/b/ivsB/k39I/zH96/dj/Ef///7fb3+X/6/+W8mj8X/q/+5/lvgD/mf9f/3/9+/yf7efSv/Tf+L/Uf6j9xfcH+if57/yf6P/b/tt9hX82/tX/G/wv+g//H+t/////8pPpGfvKIvnfKJ7/HzgUT3+PnAonv8fOBRPf4+cCie/x84FE9/j5wKJ7/HzgUT3+PnAonv8fOBRPf4+bR3vSmVZGdAArZsqeFKZ4yluoIKTOJDowGQoe0H3cqGnOpORYLH3qKK1XOtEp9qudaJT5yZVNZLqI7EdaVsXo8lInaPnAonv8fN/efeqJT7UqcagoSmxHx84FE9/j5wKJ7/HyCK7NhvNJStNCMACQuhBF2BJaMRXw+WDWepRzBZbgpJYwwlQzEl00JQBi1HL1247iWTJmj7+S0tEp9qudaJT7Vc60ZJG/iDV59cvnBWWAVkzl5yRt5Bp3cENIjOd6WKP55tfEFmDT7bJvjxsur22RgsC3qvA9Kc7A+6r1go+ycR/hcFPKK103j+mmpZc7GgFxAIN0WXwBKKvRFkMG7ynhctL4zCS7z1IN8axVMHf/FkpBcx9yAfJTkbA6qDRmtWlvf5VxuG6RPxODpWt9uHqU8bdAne+3/CqhaPHwtmXC4Ylyr/jEMZamILRQJqTdlOh0UAcd4zslXXU+vGWNEEHJK9BmUjWUH0JTv4zlI/srO5pEY5lDlZUbmGjABF6rBi8QFWNe8AVoZFJk74Yc1819Vz6dSSu4LPPnkx62+GEW7CXirT+H9r7c5oeY1i2tX5G0J13YEJlzFozzfaKC8Vr4oNdz61StsX5d7t5WNQrEYW0861VUls2I78pwnKBle4Ch28O0ciU2ZqbiP4TeCOn/ghqKkknGaBUOVAn5bU2OqsJL9isqYcUJUKTr4MuTOHJtWTg4HCGrwEZYnGaC0uGCATrySagNAzHa5Pj0rwPxfCcO7iqlbtx6lkugpqAU9zJnTDCFej3XOiwj5vsGyOQCFy7pJm9XBgorVc60Sn2q51ateaNdThR8JSAxIIbMlsDvgLEZkICxBBhBfMz1jXD+Ka4MtRK+Ra/O8yOnBs5NXFPCPTgYeBeiUNK1IuygLBC1L3qmwe6MEe5KYIGglOH6AXn82lEYqWiBNX+hiImNOPHP226rvN6Ewd3c/YTQuZuKE0ORWVE/iaK6P9Imax8sgTpbZ/0ZZZXp5kbzmvK7CiNhXkLqNfhKP3VbcN9AgVS4TnQVCzPx4gVS7A31lLHdHmWXXzQLywBPf8Ao+sk1LpK+PnAonv8fOBRPf4/hW2n/uLaFtx+bvrSd/1wehR6td/iDMivWiidKn2q51olPtXSunbt57Wqs2pFNqtitV1PuISCUzakU2q2K1XU+4hIJTNqRTarYrVdT7iEglM2pFNqtitV1PuISCUzakU2q2K1XU+4hIJTNqRTarYrVdT7iEglM2pFNqtitV1PuISCUzakU2q2K1XU+4hIJTNqRTarYrVdT7iEglM2pFNqtitV1PuISCUzbK/OBRPf4+cCie/x84FGZFff9cIr7/rhFff9cIr7/rhFff9cIr7/rhFff9cIr1onv8fOBRPf4+cCie/x84FE9/j5wKJ7/HzgUS4jZOCVXpa785iGi4JVelrvzmIaLglV6Wu/OYhouCVXpa785iGi4JVelrvzQHxK2B0EtLRKfarnWiU+1XOtEp9qudaJT7Vc60Sn2qTIKogVo5/y/SE/d+VGvMiOfD5fpCfu/KjXmRHPh8v0hP3flNKwGdsFl9o+cCie/x84FE9/j5wKJ7/HzgUT3+PnApmKJyrUoKJ7/HzgUT3+PnAonv8fOBRPf4+cCie/05SKlE9/j5wKJ7/HzgUT3+PnAonv8fOBRPf4+eah/6W6llg3ZFvQ0gXekE2HymG1wu6vwXMBqQ9CtyeMcK6jpfdrPJ+5qZtNHa7nCRO+PlUwQOpnawFVTFD5naMXP74RlNcyluice2z3L7R84FE9/j5wKJ7/HzgUT3+RZtrVc60Sn2q51olPtVzrRKfarnWiU+1XOtEqzY2LJCA9V6cU350AEl3yie/x84FE9/j5wKJ7/HzgUW2n/aPnAonv8fOBRPf4+cCie/x84FE9/j5wKLNytUhnMC5nMNcy4UKL/vEOzqzdgB6ysy80sci5aOS8J7/HzgUT3+PnAonv8fOBRPf4+b/Cpk7KfarnWiU+1XOtEp9qudaJT7Vc60Sn2q51o3+dOKbllf2ho1panlt2HztEg6euET9rcIVEAYLGnVSUuU2y0tEp9qudaJT7Vc60Sn2q51olQTIpCie/x84FE9/j5wKJ7/HzgUT3+PnAonv8fd874L+i0p7mQvH3Ccszzn54Usr3owlKwHmDXit5bmlwJghcMni3iekvx1YIT83he7nYL3dKWiU+xkbQsZYETsP50s+1mfKKDN4tEp9qudaJT7Vc60Sn2q51olPtVzrRKfarv/nC3vFV5e7V3w5WTbVICjTSHTj0vXzmAZ8jaLWtWW+8yG/IDbolGRUmPag2nRsLnTN5e7efdBhe3H8HZQ8SDltVnbRoYM6iEgkCfYHxrYGC5vY6VRyZRj+TTGg8mWndI7jC6EZVLjn9H5LpxvbRUC7SvcdOZTXHagQUhedMax3Je462sldebL0IJYARm0kk+gIhJcd7+ks/PAbisSQ4eXhk1GsS0/T2XbF56N+8OBCOPhvfGuTdbYCW/cM9VDQjEv0JVpkIzCIgBorZ3QXisFBt9vWNkz6GMTvj86fcjVwZf9YdDpxaWwqvcpIAGH6h6mCyOnmuE3v7bHytWiVeIJwKJ7/HzgUT3+PnAonv8fOBRPf4+cCie/yKHbEqCeRsK/OqnJ8nlcsEthpNh6okB0h5L7Qm/JcgAGOpgQiCsiNBkmol3lGlZwqUjlhjwBsGzVTkgSGsbTovOmogKdX/W4154kU0DBAZ1nNftDNKxNuHq2ziUPpbSbzzYe0QjGxyYR/bZ3gdwuIvFGgPBXFcgmz5h1Yf5RpFuJWN1n+AMEtFeG9BWx2Cv18TYoRGnCqerye3DP6BLhlM26v5wEgEVSIEDKUMCwGWU4g3YsR5CPyOEtRGItBPgDWKC0K9A5pxMoCFhaK5FymR6mtf3bv7f4/BG+cCie/x84FE9/j5wKJ7/HzgUT3+PnAonv9Kt9GGVsEYEzmkSSWGYHLjZtjXR6Klp0AuNwiDQw6VVxxXtMmjtlRSqIwIsKOzClOp8NS71RQgT4H6Vqudo79gorVc60Sn2q51olPtVzrRKfarnWiU+1XOza2/zlZ4AtQxjswNh4pos1pIecaQZbRQyyO/gvsAkPmGm25FBIZxa/IIB7S65CNcngeUFYiYAi84/TSbOl9EtLjsdqIJICuYjwK+MW8GnMWmnwfHsBwJdzYTPFbPmITbX2EtQOgr+3WOYoEOI3IslEklZdCJsOx+OxOhSNaSZiwYGf4VFCKkQoq77lAY0c328rT6eLLIPEbNhEjMs+0z9isccZmPV8fK8hJAqC88vrgPph57I1hFzL+wAbZN4a8ui5CbiOYM2M8kmr8DNKj5wKJ7/HzgcWaUT3+PnAonv8fOBRPf4+cCie/x84FE9/j55qIJwKJ7/HzgUT3++VqudaJ3Ce/x84FE9/j57QFKJ7/HzgUT3+PnAonv8fOBRPf4+cCie/x881EBvU2RUelrvzmIaLglV6Wu/OYhouCVXpa785iGi4JVelrvzmIaLglV6UbJLYeStLoVHzgUT3+PnAonv8fOBRPf4+cCie/x84FE+OhANC67eJu0dnkyC7tw1ktoUmCRmoJLRT4FAe5ylTEAyn1RhmOO4k1LpSDGGY47iTUulIMYZjjuJNQqThQxQTgUT3+PnAonv8fOBRPf4+cCie/x84FE9/kUO2pu9Nt/m/167kUx9reMIq2PAOrPO5vX+viUCPtlb7C0SrLDNZO/bGcoWsW0kaaPybV2yVVHsE75RPf4+cCie/x84FEuRTWV7lBOhad0ML1eaKICPDlaXNGpzLBaWiU+1XOtEp9qudaJT7Vc60Sn2q51olPthza2nMhGvnTsRRBlOyV3givb6t8Zhm/1Qzr9cGYlWpDqlNfjNxM9bt4myucVzTebEXDdD+K3vrVpTM6aUvppfz490xP8QWLibGcOa/nq/b6Cq3jt2DJnwJWiAalrYa3PmHjXFICNt1Gq0+mQxY+tO82j2u9PMcVeyjRv4VQ5QBwcBhA22hAqBucGCitVzrRKfCyjBdZAKJ+tXYdm57Yr0Etu1mjjMZ5ij0ONAGoXDG2SuuMj/3R84FE9/j5wKJ7/HzgUT3+PnAonv8fOBRPjoQE7/dAs/AuB3xHSYHmfS68Y3j2bSeoNik0DlT+aCnlEEv9HfrLnCBZY8+SWZekroPuOMiMdpBikzOhTKEleTxD4gfYDtLqZ0kEYBpc60Sn2q51olPtWVl4FdKlBRPf4+cCie/x84FE9/j5wKJ7/HzgUT3+Pu+eDVZVQRIv4onJP+Wu/OYhouCVXpa785Hmi4JVelrvzmIaLglV6Wu/OYhouCVFv2IuAa9ZaWiU+1XOtEp9qudaJT7Vc60Sn2q51olPvziCcCie/x84FE9/j5wKJ7/HzgUT3+PnAonwG9B8fOBRPf4+cCie/x84FE9/j5wKJ7/HzgUUEZt+13icAuLeAixUPiuFd8BZ6EG4P7HIegDuzok+B16rjoUHqOZ2cCER+aSGEUXzU4FE9/j5wKJ7/HzgUT3+PnA4viarnWiU+1XOtEp9qudaJT7Vc60Sn2q51olWbGpcKgoDwdkzkCzm3ob4u7BT4L12CfD/WVKatgYaC4oechz5CxhH6Hi0roKjAoSYJB/EfwB+qVz2kkhW2TaPtQAayiml2xgL7/mX2OWvQ/BssvMOmE7ghSDJkZEjOwoEaEWoz60Sn2q51olPtVzrRKfarnaOXWiU+1XOtEp9qudaJT7Vc60Sn2q51olPtV3/zixE8VWXreyAa0GguOkF4Cq9LXfnMQ0XBKr0td+cxDRcEqvS135zENFwSo69S3F7/HzgUT3+PnAonv8fOBRPf4+cCie/x84FNcu5E9/j5wKJ7/HzgUT3+PnAonv8fOBRPf4/BG+cCie/x84FE9/j5wKJ7/HzgUT3+PnAonv9Kt9CLE8OQrRj50YjXsygOgVSZlOj94HfRg6Gy1oxGVcpousQ0dsIxOOAP1bQkO4FKRpi51olPtVzrOKNlJw5loKoyeTPmLyB1jLh8oBQQOOd8lzFGdRyYqWiU+1XOtEp9secudaJT7Vc60Sn2q51olPtVzrRKfarnWiU+2HNqfJ4+osKX3DyYYPZG2ifZ9YK2oAIR1fG+XyK6AjeTvdA+Kj0td+cxDRcEqvSiUg4OqZI4mUlTyXTsYcuvS10wJw6A2F+Jzbogh9/b6OkyTCihrOi0i9K0dJkmFFDWdFpF6VxDizSie/x84FE9/j5wKJ7/HzgUT3+PnAonv8fPNRACTVX+6dns4V0EUIojk3oJ9Vnk9nO+FTklV6Wu/OYhoH2vx6PaB/jQKTcSgL6LZYYgfOrxYqTklV6Wu/OYhouCVV/QgKTX2ShfrRKfarnWiU+1XOtEhYSdVV6Wu/OYhouCVXpa785iGi4JVelrcfdUeIBmC+NWJ5z6wnBQFloth1q+QAwH7JCb9j+zowH6GWgo3B/DYt5c3t4m0yX2kEdBRpqGhNUVgtYF1fEL9dqBK2wMhYhFKFcDpOr0DjMEX+PnAlgDGJdmkWf/F1VGilnAF2nqI6zN7CPiHwQLIcE09FdkIO3K8yirm6dMOgPnAonv8fHoCvdzigHMvr9bq3liIuCVXpa785iGi4JVelrvzmIaLglV24hO2HEj52w4kfO2HEj52w4kfO2HEj52w4kfO2BhIB3PHSvmEgGS8dK+YSAZNecavDKzXV5xqmEgGS8dK+YSM11ecavDKzXV5xq8MrMS8dOqYSI9sVqup9xCQSmbUim1WxWq6n3EJBKZtSKbVbFarqfd1aWiU+1XOtEp9qudaJT7Vc60Sn2q51olPtVzrRKfarnWiU+1XOtEp9qudaJT7Vc60Sn2q44AD+/zrQAAAAAAAmbyNqqERzQ/GaFFglulfXZVp9BZywIzPjXlwHuByobOdCuEiFhH90+2ff+EWYLSgn3+8f9MRZAJcPHLQuHxWgwkGlufVRWRz60+wLPdHrrFId/mVxgkeKyJOEnRFkNvw3KgUrwlJtqv0NcK15KsqPC4+m+wTu9dUOpmpv+4XDNWR41oa8+5TZR+5fOf257O/N/BgdjqDdtboR5kZdD77j0yf6aqr/+DXetFa1QKfikXb7YHg4m3NqZEvjh44iuUlibxfkEDn7aAAcafP5ZG5pCZK2LmPBHAW3+OVWW9S4XrL9eSZz+AQ0zh3qzEycjaCAE14UOTb+WTx1/ngOxXl8dF9Rn+ZAvCfm9iBg+k36UEIG54mnPE3UgqMK7v2L0ec7fsYhgExI0nhLz923u/5x0aJB52AnUv5ezOoeDO8SQvdJPbna8Fg5kprVIfUB53n/kt3sOKEF96nFoPUBBRvSbYjFO7fiP9f21fetyLoV6Z+LcZ+8Iuj1is7+2ahDJBqRXCCHauH/exIlqTOn4UL+mIuz8xhF5+/gv6M9UI+gJ/SwRv6YoyJbXT/N6PrdXKWD8vgRIbGL+Enat3xh9gKsUpeLVxtKPzFhFxgX6FXAi4gC1dQ1kYby5cXTw5bADHggJaMpgwgiDPor3T5ShurTDaSQEWyhzaz9wkyq59BXACjfQFhiHvlFrRz58xsbJBDyNgCAMk+HEuM7uA7Bz+QWs6w9dQt7w+FrbDcHgQPH7W1r+WdcbkyYBm6bdqr+58b9GyXzORrRPT7sJv+htcYOkbg1i3vMzRZgWHvdRa3SgciB6oy/ePUZfhVkxvpyu+mmopSPkx6FN6bl5PyqegPZNn2LG+vFPHm0Q3SFKMuqUBxaRkwp9f1uU8H2RuFdL85pEKuHUlS7u1tFCn5hcPFXEiCexTON9vLaeV7jzoMGF43K+SomVgxClACEuH86N9q62DB2YHwwxbd3HGB3Fip//YZqRCcLo3Fn3WpVDfBTSFN4aKkUcmIL7ReCsVIGpW/lEifCXhC/AA8PKLnHjoeReb5BJZhIkCtKdEfNjk/xbRDxvu9uEo93nkJEwDcKD+wT+d5h1ZxBLFZBecGZ7Y6oURbAT4gNZ+UhoUHKXiKXGm8OuNj8vQmmb4VY0SPgVDjPFG4/g5awRTtxPmoDK8W1MQeDoDKtZEKvdaxOmXTQHD4TymTOsAGuh5NZCCt1RUYU485CujB20l8ASXxUCVLG5+tN/f9GQMP01yhCYOj1cEspvFmqXGi5Sjki4YU2tVzRmPp4j+/I/3pBDQ2GQ0qkr18UsU9BF1DJlFYBPx8rTuhePlgWFYWZ3i5cPyT5sxXj7I6w0zSaqrkF7DP1Gx+jEiAK8zvMUp0uQbI024nGXLqzyAtL4PBoZU1YCrh7sqhsShVP72k69nUd3UueiVvvzbl7JQmnsN8Vl+kxdIqdBmSvwVv5x3bBr/CBgg1Lx1ffzdhrDtS/F3vUnY9Oa4Jbl2DOZdcWaN2gv42AEiV4OEFsG/NpHOJUXFF1umc8Wq3Dbm8I0LhaF3qdatQiU3hQjLBtZn52RUONhawwALvilhWEWkeV2ouEC0bZQmSGsbf65wZQVo+cMlTz+H46vh0chO//QUPmv+N0bsT1+TaS7YmcEcupJ/IfIfgn5MfjuwKFG7L/Yr5QpZUa/Lpecb9Yqozd00irlLfKBCbEJYw8kqq5a2LXuHfL7Q/iFH5rqmB+nZMco254SN+mbIJsBGl013Gvskiq+Llq/UG8bylShsLWbeYZ1imeVE0tWGXyDTFApQ/5MrQpBCqFI0clYzVscPN0s76xHjzJPq65Kx+OLLV2em/2if7MThaJ9f8SE34Ciu80/n5dHbZuPXZijL5b5Vy2Lj0guOruTuxdbJk27IJkdcmSWbpbjHNTYX5cIoeoGA1feaRf4pCZixWZBw+Qj/S3xNP2iLkKGWIrWWax+i+uJF0VK/jTH+86wtH+1KCXOalxZiOO8w/N3nYmzQNJihLGWpmUINVQBMIPtaBmhyHYIg9yNg+JGMtXnq751OrvUIXBe4t75mjqw216SXUbIk8+5IlAztjDHOG+mLIuztyHg9eqqTIT5JUkQQHjevSFlXbfwVeRk/AUVfTEfVNXx+1Ia59a/rlbTAm1/pV+2mmnXHY0h/jdbMvlBIub4hOZEhFg4kZnl/LROCeNpMPmTGNEpQHu+duLZKvCCQTlYEMXJBWNP1NbAjhJ30m+CWj78EaG+le4zKu2h1w9iAm2DJhCic+0wfztTtXxfIRFM8Y8sEzQWBT0axBYz9KbAJHnq44NuTKn+UoS5A4a6x4XxE+dfTt2wKVMtvq9yt48GZJP5XwwYa09/EwSZnYy7gXnKPfBNCrA+erXr1CgytDwNoE/fv4JDrqOuGefEN8jTqxNZo4scFk4v4YMcZEk0Bz4GKqTtOaXBZHb0Lqt33kdBWm7hSFFqwFBeuP6lCeciD9cFqWfwbjiCKjh4cj+qKoNS/oWYopvc53JVgGz2MPuu6zWr8fG5MfS+T93+uTlp/8HzQtgEF3hy0TguUvl8pukcPySE0WTK9L1xXr1jx3yVTanr1c4vJ4+pbFN67zLqnoxQ6H4TNONUzIEl0udCEU85BACB6FJbBJBQ5/1uQmQJ7mPwk2A77PlVPF7qXXCbLKOhphqYwsdzlylQ9JuiFJ98thaGN/kokZCsZrqp6AMbPsBCLveQB7dzmi1GJyqKm7m5i5WdL1o5QSsEBxTn6q38yZMWta99aXBqWB9DVN/+UHgEbciL18xEDLxYMHK2/ofEKddeVfECMlBoeyWOWdpDRL1rKDb5zU3YBZ6q1pX9Y0NCp14UZ4d2/2kEfa5BhL75XrczOIcoYJ+h+UwARlzPVJgjqFK6tmd5ZI5USgG0tOcwHxwXqGTdESvOHEjPhdmLwYlFebL/pmLfXcbFPzfYSGlyfIUjOqOaQPAddoyM48EkBQi1SeDQsJqRmZEjvzsS+SMJrn+PKrPTMdEDMrq3RF200aWDYX/2p5oKVVRgqA1G0Ct9wdgRLVVDiMl9PkRqdc2ff2c8wmPKOYSFCk9re7X7hEI20UX6RYG4jM8vhBhUQB8/uCyceB4opF9X6ZVEDswY6l8Fk5VRVtbkNz9ILzOgOJRLz7WY4eL3oPNRFevTeIG+0tO6F7e3dZ8U23ZuCy25qXccsxeqpWOTFwSKopTDQgZ9OlxVpBbh77cSLEWcez3AJ2zWZyNgHXHRN1lFJZhkZBcpCHw3AcTXsFBo9NU1MpYPqaFq0AD/yrsNZHAjqdOW1OdDsF9x6XsKYSDIULZ2HF/lPRzE+DbVx0LqkeU4ZOCjL9fyIp+frZmbRqb1SvoLegy+kQkOOaHaT83SSnCf6CiDaAu8coOSnwuziaVJTvJCFuxXkNClj1Sy8++Me0ropmarFNr7NApz5OdnEjUw8Wo+Xe3Q2MrtHjWW7EL0Zfhna6VYaSh38TAuKk4MQOo1GtWJNykj7bxnrjtd9izhWjMyMaFPMw2JbtqSZJyN5Iu6mGtWer/C0x3lwnHG0NjtaBIpjTzfi3M1jW9NWz/JrfI+JHw+lIbaMqFYXpSKpCgNlsoBISmEnhyoqayd4t1jAydltPRAAv8ERsqj/Rxhp5MPXBGGi1oCeWg3835ZTvxYvaJodVYI9Eok1VUw9fmrRqPCBo3eORpm9Z0QDYf4pJb/c7EF74Lozr9L5xnl6DLPXYCJITgZGqn7CjDF++2wWqjmNMY80A6GJobEfTQEPjv3NQ/2I6eiOKUnKtidPPliD0GJrZVvXrbHogaL/ZMkXoHDIlqFNxkx8agnRUU2LDlEH69MeSSSAQFgrks4AJY8xtnN3co0tZ1gyp3poh8XDm56A1i54InpkvIgqdXdRpWGq0pR0yjLDXheWSNRkBKtsqNrhf6YJ0G1LzvU5JwVrGnTL7JvQ1qFxuIQSMjgFjJ52KEIEFXsj/er2rQ2NouFqDe62BHkCa444gXZz9vSc7JwpY5DlmyoPQAwzpqzyhX1yH8X9YCJLiQOCKR8vKfEE6B53veZ15e0Vl8PNT65e1U7dGNNG8XF9jxc56w+0yvF/8w34GAhVfCrFWdami6vTjKfgPsKHi8agJ/kre6D28/PEQ2+oS98xIuhzo5LBp5zd0xKKun3EzBRqxKSdg7jlkQmRu01dGBpKPg9OvQEX9hSQsFCAWXVjAHZOUurtM6YMS0QhtwOPuKOFHzUAZbqPc/oUFGTGFnAhIFcX2MKtyR5x1ZRDY24inJt2D0LKv/r74CzUHqAeOwVWQp91jedZRugtKVZgD8Nnh2XnywTHj39Qihvv8nVkm3nx1z6Jbyws4mBahDfwjQEJfTTrQ3aTwlb2p2Lp/DmoD9/TCHh9evxYieiWVO5YvFxWZF+d/sRm2+2PigiKed8IqvntaS+CaAKz8Vtlc3R1GknyonDBmCP7D55xwKYcrPDK8eTpYeDeR7JaUsTFrOaz6juANnyWn8xjXlJfLwgYo1aa80CDzFF+y1v4CK/97YIfLQ8hHSTJs/Rltako0kzEcS9hrOkfeFpGDoCt0HgMa3z8RNNQTACcZJA+38BWWpGlBhKwjO70eFmWPsAu5FQg7uR+u7YYgBum+d3lTfZlzZ061KMbWtNk3NSFM7IVXQ5c7NVy+8WwKcf2MCLOuA61CxtFecRQtshmZ4e4DQJADZFm1luDey8AuMP4c1zL9Tcy0cFDLmC5l0DI7UZ9tr+4zzQx41Fcl3b9MH4bBkgrk3sOB/EvidJ8PfRSLEr1Zlqjt9An/rMugnRTYOotVgTjyRA6t1MIS91IxCHTrhA/EjFJNGofuB0JhrZX8aCYkIeG4LRdHf3R/Kc4/hD3V5TYWCoyR8PNLUXOTfuEaCH7+RgXlKUjyvqp26R67FrH6xRALH9S6JxH/OEH82B08lHC69LmCpvIlwO7mUIpPymQIolczfqNqhDeTUuhtfHjXmiksfCbJVW3cn5HtZcm1M9CcICQr9Kgu6exT9h0amLRi/SOaZLFvGGvDpRKviMC1dWjkjUNnx0yNGWWqaAZsxkVC6VgrmDovM+JeAR3xwKtF7Qi+qzyG3gU3ZeIkvO4hU9AjFzx3OSRyxwAiqqpL9Bpyq6nQgm6j1bj8oLf7webTDB6HQCI7WPKIIWVRu7SwZ74LWUD69v8EN5e2chC6Tk/DLaF//AasaS/bX5yRSO/Pnju4ujje4dejwkoIrpF4D0I9iMDI+kKjlU/8SsnUH8P7rz2WUfV3BOrICGxZ6m2/IPvhK4Oj6z+FJC7ww2E71+dB4/1o26TmFIIpmvGjNc3Ebkrhf6cEYknmPL0N+t65QHqQe7hL0zjw9efUwy79nAdz9VeUAbagth7+Nf/NLg5B0bQNLPtD6VeexyDMg0DjQibmhPIflVnoZEFAbGW10+8Q7P7h+HK6phIP/3J3nZ63zbcr4qwFMiyqInitqkmBTtAV02INFlGpW0lgOkvul/3QTbFeJDSLSdKh6rbqzOiXHqN9MEx5pZKuc6tKdHP88GaAeAWGphVMWhC9a1ZDB9ytmJN/6CXK9Ak+EWiacxEkG2BJtQJr5SvmF/lJ9fuKWD8hfHKaQcPAVmVkJgsq3oMR67BqZAg+rNtjwFoGvO37PE0ODagCS9p/VDix9CXb4qVBJ8fdc0S0Oq/rPklJYEKGkqtUskC24aOxboC42PPYo6XkMJ9gIwdmpg7F6yZFDsRV8QyaoC7m8g1sSzxIRx7rGbNJlb+4VrmFwJi5W+TspM5EkwbXfHs1ksWFSFvbP3RKHsolfrDmUqZEkuaLOZhyRhcFPduDpQC+vD+aINoz0geOH7nr9N35kS7tq3QMQXSNEhP0S5HwJJajy8xqVeXRoN92ZjUSwYstlA04qQ/x9s0hGzx1kq3Js2cspRgIX0e6sUXRw8gzYBmpkJGKNo2AFvEJow0Djoov4GwRJxGlyAHVwT8snR78YEGUqhJ8qO2wAch6NqYWjFEx64/2dtLJgTC73KexqWDKws/GgtuNCDSEToUnpYT5lUSkED/Fz8hdW3fv5VVm+7RXv4m+dQkmYD70jLiRtE5xRlet54Nh+AC+NyVjb9zlBDZMHz8ILRmT9pStsY0TknmBqLRnie+9L+Na+Z69m7XQPD17IzjIefve3zQrrAaID9TowT0ycc4BtN4uYS1OeUbsbFpWFmeLq2y/vTSyZV2SYhhDYFsTsmMXZQ9ivcGN7IZKXAuAiKDFgEfxNZOGj4zzNC1DMzv7NU6yxTHmBu7tdmj2xMiPB4c3zN40gsp2bj56X7do+UOT1MC53iXjE1QSGCHyiCgqsKkHxmpBo6ZnXGw8Y75S718CIQGW9CelHLrdF68TlmwW1fIEbSh1AvY05ZOAqIFEI7P/gg9w5ZZpRBo3WQsJM/ipFX5YYFiCHYTpKJGEQgYT3k/AfH379gWy43WdCGsdkKkkgZW0eXlHZSdh0GMHZLJK+2xxGlVQ3ztqgIW1Fr52S08/Zo9apMk6tL5b2ltvRy1Clp8mvn/rfqpgRWD2rY7YePogMC2kXoJ71HafbjdMZPE08g7ChhgLPXOSWG25S6xOFIiXVPz3E4cFak54ZZxEdO/VBs7MsUsnrRpPxX0tFw4LRzARm8ktMBFcQsb6NENe6v4/2/4mzhPIQxdCChsOo59aSucVjFMcJJsIJnIEE7sAdqRzsL27c8A3keedEOJyELu8JB3xbAZxYf9ANNRtIp/FKYd61Fxh1hT8dqY1bdeE+VJeNU8VGMgdcC80UyhAImFxo7Se0VqneiQ4HNtAk5wFdyLqDlRr77kmtDmivqvlWKbcWfLp4RCZ1OnTxqAfxbB7lK8vpym/R1Eq+aHftSUFFgN7hLI2oOVp226gyK9EjtOt29hV5/jbOUWZJsie2YkdgUa6az9hdCKwAs75bgwcL1S0T7KXpbfAANvRcRrnRLc0c9EqLH/1707lvorIvoL2fyXaQN4TTOKpHHNkjTZl++D8yXDNp6PfNPvW7iVvu9+gOFk+FFHA+qRaYz6AI//7NHU5fJQ3oS/2jpkvK+M0aDQbc5W0i4Ye2kNxqAXkcvOiLEg5G9zdo5Whh18e1Z9rljudwCr+6pfns7utO35wpeYA5aGjjNYKqDX10AUgD9GEZUuvcLgtVXnCfvnOEllSGlm3w+dlKC1wDyqWDeRql6MONywG1U0W/hoF2RkSumsbgkYZCeIF8Qir0Cvx0t5jBwaxXQ/Z7x6mrDPqL6pw2CnImWuUDua0njkrcy20CslZwj9UOD1ZEFAC/Av3lSBSnrIrQ5rvfkCVLAimUwtBG82RC6GegywatbhDW30cgzfEkt3lTwPp/jZFV+cbCqamP6/U/XVB08Rxk8stKcQgQK0P4zqBhV4/HBWWS9U43Fo8131oEGtfOjCw0ULUVq9/w8360e2/qGqJ5tlAVITJFDHEyYOCfyj51Fw/q751C70GBtfeNFq95czZStH7NGS/YTRwiCStSAHJw4fipS1de4sJT1hT+Pjfw65hu4synQRIfD70/aXcT/b7J8mDdEdeSdPsGbthQ7zhQV7dGJlgF+xrVgJTB4K3p1abhgf7gT+P3tVEW9dj0F51D9xbmiOHpARi38HkS3573LC4/5H7Un9y0wd47b1h2nBM/yiwjyAX4WnAbIv1Ddjzz8d7wE92o8MpZnkhKqF0FFx3HGW7bBHs8hOwEbq0tT1nxGR8ohktSYPG5AAKHke67SZUX66G+RCux+GzgmpvxzReKP6p+z0M3REMdTVpaXrzOfmDGzF4fU3MZr/Nnq8tXGcWRlFPXNuRFdLUk1aFBLgwzZAZZOoWEWClcc81ZU38Sh+Vcp3F1QdXxF+StuJ2T8B3Wo2oV9dtG3aSCOkljx8C5YcfMQ84rCFQeBm4XtKwwW5OlseKqR98Gbzq7fy8Hl7wfRQeSZp07jvsKq/dGq0tEigowXqPlo49oKweWBSvISyqN0ENiqHedgzjaNYVQWSp1OzN8ouAkHDBx4FALwHDOtxuyuve55YuGjeU2nOLSjx0HE8i19eCZDh9C9wK/aaCN+4wwFrUEVfpBdU8XTHKsfYmj6lkaYGyfGFayss+EXWvHwxKhVmfyOdQ+c/UsZNEA/dyYzJMqeMaP7eIwI86uSSKJSU3cWMCYaIOfyLBTNfXfNmREjfMpgnprdbzNv+zeQdJnGjZh1btPe0UAHrWE9fa/CapB+I/p0k6PDEfNZ1TW2ubQBcmzsUACvna3J8/lW4hduCSa3oY9dwHS3Ahi29up8fyKkSx/NwF77nelRXd+sS1iwkcSytryKhEeHAeewuag80i3+wsE32Dz6ARL202+EMt04/C8TyyO9yBY2BOOw1xjzURLIjHwZFLdRvonX3HKLFjwnu9wFFA/6v85MhjFMYKba6EmHd3ktEt64K7CqHQsd9i6FLkgvehc1XlwYwRjicpRJCmyCpIH/tP8rAFXv2gURY1TQqK2iv2HPbFMwDoEQDIWFQBql6H+R9AgTK3oHWtRokId6NpXIEGXX/sK7XBB0eqHA6AfyZ/NQDQ887TznyTI4qDp+IYVilh+LuXsDBL8FYzwSgDrcdNjyVycbgQKUcnZUMmtCoWSD1eAgr9PybhCFLPQDCQtU5tqnhrFNfr8oe1bSdUGva4UySJE/1liOszlU/FX4l4ECUeBq4jJBftXXD0eMHyMNxsvKz5o5ZgBxItkvWaG3yA7hZp5J1df4B0cOgp09HCjOnW6ATA2DG4k0OcLUNzdbZLov2KYLEV+ZGE8/bkrapmYWH3raCXEopLcNNplIg/3tSG/hhFaDhpgl7Iy/gW/GtFOx/q9Xz4uLWtQTVmUJdhMZvXOUSibZUFWJPfKm8KuAVHVY6KtzPLRy54yBAZUJWeI6wNXaJHbhxB4gfbDcWjDReHvJ5aiMV20uYAan9Cs44hyUzGvxA657imaetVGfRHiDz1SruTtOkBhGirE4PI61p9fT9SOqOGiQxosfWLN+lUdZBEyqiyG+MfiZCBOa17mgalKqcwZ/5Q/nsL4lpq6aPI78rY6gBQmj4DDuimA3+40mG+u9GJjbZgTCDdYUmVJfYQhL2naw/eYHh9J73D/x7/TqgB/O6ljIZ05OgkNc/q5QGp31Pii1YXVnyJbTDcBSqhDYbL0lF5orBMhnmD5bnSOyhvGxAvOXrkzUQGkgypaXlRTYK8EA9920/7hXQ57t7DJIii36iM/rSC3qNhABTaVZf+gGOYruVZcptc5+DB/C8Lq+qCJYmGTrw2Qv+AeNrOXDJxmuV0yp9gSQbMHd9d64MHUH7YkHQ0jpEICOLLViPWSJQ8QPRWAYZ8a8TEXjVqRRwAkXbIUtds0ViLKudJ2BCMtXhWzsMMTAJrcIlQvsB/CAwA4GLFCqpo6HJICxF68MjWvMMaXsa/5lyhvsHVcQTQ7HirGnYAEW2TZFw+a5oD1D1vmB/QbPwYAAEFqKxg7d1bhIqav9KUNPbmglYM8yLeTXddMYVZY2+HrzKD6m7HrfSBkloCT8tXvj+PgSBbf+Ag0STtgAAAAAAAAAAAAAADB/sXPNNvPD+aXZSLtMvWbhkCIv2xDZvNNnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZuriBAAAHhuQAAAAAAAAAAAAADfo2sDQzkyEZsawvDzeEGGC3Ak96CgYkDS67TMGEyYyWxcKCv3AjYOHQvwxs8/qhNFKlFyDg8WCGCK+iNviYuOhfhjZ5/VCaKVKLkHB4sEMEV9EbfExcdC/DGzz+qE0UqUXIODxYIYIr6I2+Ji46F+GNnn9UJopUouQcHiwQwRX0Rt8TFx0L8MbPP6oTRSpRcg4PFghgivojb4mLjoX4Y2ef1QmilSi5BweLBDBFfRG3xMXHQvwxs8/qhNFKlFyDg8WCGCK+iNviYuOhfhjZ5/VCaKVKLkHB4sEMEV9EbfExcdC/DGzz+qEd50/iv4DXlnwZrAvB0C6cxAAArAF8nOJbEPTxd49sRF73IUlo55dTmR30s2ZTWryCvR5GCltXf6EIx18MFLau/0IRjr4YKW1d/oQjHXwwUtq7/QhGOvhgpbV3+hCMdfDBS2rv9CEY6+GCltXf6EIx18MFLau/0IRjr4YKW1d/kkJm4ZRCHsqw5GaiFeZPrI+AAABHZIzQAAAAAABGhCMS+NwEoQAAlQLuQAkH02xNeWzsFNmNkFYu12pqDBpRml7LNnHMZUO3I5/QmUX0VgXCBzwyrEldPFpvHQwiK6c+E00wKlEITrUKEQAJ3drKKJApDdDeOW3hIoN/yKSCKB2bV6LnGiMyxhRkvG9Zn4+U/TnUPGn7TpNY9K1juaDwTJ77UVkNugIIJTvB95MG65berw/ric8SKM7W42/desaRB5/gMpSMLMTRccJ5woaqjBtk5XDPOsr1x5OQg+ucoKLpqfGjF57jpLIlEYAs36SMWSHir0i5Hs+YZdH5KsZ89oseVbmfqSAsaR56ZDW5PcT7X4QKt2HVYIvjylM5cWSdbdX73ATe/xFkl2gZTcKSKtdzKJEBe05qtki2emVUPhZ0sFCYj1YU9NfkroOBIly3kUfZw1EohLZzcm2QazxpMgbRt4V3VHolfwx/+x96wuv88uHdDkSmpaZqyuPtFxkDO8BUrvuHqavL/H05Cs/Vk4dLBC0ZT7/gcJ82z2weiioKieFeQgRnvat16537x3hHoaUgDO/11pcURctULztxXwQSmNGk7PdcuQTfFTwskw0zV5KT4rkjFxIhfrYNlE9/yYnxtn+pkKffhb0qvTpbxVid9J0IkWW91rFo8HTPpOI0dQ9DEoruU5reLCMo7ip+cbArjKDOFbNzZVTxg9H6+EkLuz+Zv11JqCjL94+IfcF2D5J7uIiojuc96+DQyHm26t2Re81caiffbrup6QkdmEfmZJVMIR1YjHKZ9EAAnoO62AcdmRuIEEhn55F+e0B36VmnjU5J/zW8m/pQatZl39ZXsdU7WYTO3+X7YfL26vgTNFS7jSjlBkw7LvUems8t7p3wvKKmP0AFDVgJySROY96SIloRtFRhiCvmrSGkgd0dSSIuQNyOCjerfZPkkP7rkkTiDdMICQLBj4rCsqhrvmTssnSJPGYSzPTFe9uF25By04xlno1K9jD4QlIf6+nRSiBQk9LcLH3zHzq9FcZLNwuyyK5VWAbFEPv5GP7BZUrfglVHqJPCdLB4L8G6qTxNlyCLbt2DgJi14lInbhoeqviy2mgZIGf3wRhz3ux73LfMle5uvyth3MV2joUDbR/QqviKHq5Z3YH98qa8CRFJAXJMH1K82XHOXbQxr2QYTP6soVvg+M+oqBbxi8OgS/hgh2gm74HRigBJaLwxc1qUEE30jyI4RyVnswIN0G1AllBGIRiTjCszECUBA9MOeaGV3HkrdwLGd56NlZ5SaOAG1JBkINqpgAAJ47jgAAAAJ32eKl6+wIAACevEiznCi4op/LwiOH0ynpdRTv5Qg/EguO7b72eMtP3z6dNzPUakAhCJwE0BWAACAt77rjeqS05D3KdpZBgUSW6EBPKhSj9X3EfZvjRojGeNHFpeHmrwdFrwzxRAp9Vxe+733K0IGbdOq2rhYbyjyujIDU8rXbRaY+4tP9tmY4Z6Mb5SrjW3CMH41dwWwUkU3iJk/eGoKOUN4IgcSCimD8z2NncgvQgC94LEeDUhZG3wtCmcRjaYMbZ9A/wZt/QjdqLy9imUNDH9HW8vh++7NNLweAEV+7sNl+dehzgBKRLRbi/I96zcAEQOkUNeXKOhEsmiZ6MLFrD0uCf1191O6jOF/R2ictmH6s5vq9rLzyTchZGRMQqI7P4qVyoWG2OETilIHCX5ME7l2fTqJqdVyPVhES2UN4W8DOcQ/t6hBr9vY4hoLz3tvHwgAAVpIf8QAALdBLNYGKBCHzv3t0PyNYUvJ37AI8/DYZtdAvR2rIGKVPn4AiMMkenLs031wnU6smpNGo0KuLyYkDQWQN1up1z8yhQw3KbKzR0ON652sowRDc0/2/ZJF7Y5lUn+9EafcDV0NQ0cuGzmEh8cAFTuf3X8huaey0EBLknan5ippbpGHL+f5ELLCUjSJdTgh1iPrG1RpZoKCxeOhqC7hDN0qit4VXoigPfqfukXMulnPbVAXhrzMt4jh8Imnlj0gnueWOZ8m69Xmth4iFlkKC0mJ66XrTKpzolIZbhJAnWUlDc4c8qL2UkJGCYCPd5uj258DQkG8FImXkGqS/kqsW9rJUBX/ixipCgjdOnbMIVyN+IYd3ChOJ/wAAbRS8wKAABPYT1wZzh2e/rXFntiwsc1layWawQMxZcXBEvc26NDXKAzGSgDPPvS5bHXxNDhR1Uck6iM5fg32oRKN4sefcD7BzwrAq1VXo4FFVyvwUc4Y3+hNlS2mjY3QPL8umr0eoEAQHabtmrpacJ/V3JZkwAnShKKo0L5CcwqsPnwD22zcBKREaQc8gFJNJIqlNhTIT2v/4FqqGgQxp/EDliB4+HmHtHGY7YGWRp5miPDBqjfB0uRdVlkBVVSm5fWdQTb6sBAaHpl3wJ9EPDorCMKWJ8jYOEzP+3jtnfvpb7clr5JdLxhPU7wYzSec3cokicanepm186bGRz8WGZZj/XaRKgxo4N/3MQDrROnqhrKVouQJm6ezgz3X1u0GSjz6e26NTd7ON3jubuIWNLOKHh08SZeJE1Gqzq+8Qm/xBKq22YKlGAKgKCUAjmtVAaPp/8X4kZ6hM1SB6hUorZq87umAOXAXjz/ihD634bjwWihAlBWhM5h/OSO+Zy5hdACp+Xnw7Efkutx14CLm0QaRp9zhXuoVns0JwswcDUyxBbCoBu+9DHjHB51tMlHjpQhjlTT65ctp5zeq8wAAGkrgRV9bctYCVwoY3waKr8brGHE1EXc98y8qbpBOTFYOmGKSoDhGxr9dhpC5nAe/Lsua2cVqLeWiCAzTSYOTqmhHCjwe155a43Hh98k2QM+7HecPP5NvQIc8WQ/5yS+r9zfUZUmHoqnWxi2hX0BjHewkHUhmdA2HkzX0LHKmRpsw03NNEJ7DBsVj30pOuufbB3OSpXMPmqj7c/t8YGzYpBoTEJbWAxgX7585Dz98pywMrZYwRVkrO4lwQLHjA044M4j6qvLa1SVh9kwQi79WqpcLGi4BITjqL7eWy9uvjyzWlIYo+1QwNih8nlhtUDHpWLREAPQWyqABcgSYc4Foxk1DZMXz/m5poYG7DvAZXdImAzQbxOP5YQ76bHBIzv+8sc2SH63hmttMepMcE4O3tIjzLuLiQG02ltfYyIpL5qh7Gu+AaoY+FvKpPflymJCX43TuvvM8rGdXyPW8SlP0Jf/vvmT6N05fIJcraRYmFen82DfWY3nfy4HoZSrVD+aFoyR/6Lq4Mgr6m+A6CeNXjczZdqcAgyU08g30E+NpprHRrDVPwpR5+gFDR0y+cHd6f9p5JI6mzuk5feDTC6DJ6d2F3vVm7Nzs8LfCwSpV6ZAEWlfcMHaGzPGmfSjRpYqbaNyvLMjcCsh7mcOo8Igu3bqT++P4XrvxUrFCW2V61/SJ59JshtFgevkF2x2UYP3dgSTTA/Ru3JmlWpLv+MOPth/7O+l9tLvKDUDkzFmFCyxZufTLMMcfFXblXPPj75/Fzz0qU0eonIc1DqwpqMq6FsTHuIUC1Hv6KcezF6M6rO1vF6bGXS/MLsBpXJipznP7h5DeBA5KEDXIT0IMi5DUSU/lcCTYCMuPFlDdLplOmA6c1DTEssqN9Lrb4WcuBDY/1UXflJmJugt2TrzP0jqh+pIFEOTHw4492vMpDL6iG3aHhdFYJVph2vplC9MO1ty9D9vXBYPR306Q7MVV9mGIG39WIKMoE6/03tEKoQCQGSAMBzggXMyzhsOZYYRjcA1qi4NzUzycHJtzdaiMFSjF2LeYFe4yKSBANIA5pzZls25f4j+p03VszLLAUTlGB1j6i6Y0vVKrrL7Pok3G2M0+Phd3KTeIMcrnF4MC3vfr9wUIElE1+LxYhhUhvU/yfDr6/HHs8DCln+K0wiQhpKwXtdezZFq6qBrlYUsF909Q+GLEoBPTFnjiY3Yl+4z/ZZq567dXfet4lHD3nAdMGYckdDuvKFdjsw1O+aHZDPwBFg8mrdqKaSMwogQnBG+OaAyVjGCmB+4LUzL53n3Ku0Ah5wpr9AeOwIHg6TG2a449neHsbAeCjoRObc3aadMg+Z5cS5noFB8bOVVsaTAWHAToUqcw6Tq2dC+AOK04wN+F18+MyzFeTXzQKA80Hh+2vxNvE41/okIvwoNWZtpjQwTyo3guN4xvTCYO8W2cg5ukmal1O+XQeV1PEq5Ui1422k+kWnLinsm5a/yqv6d4L4N/otHJbn9g3xQ5rErmyvw4af5sPuaZwgzN4TzLPcuchC5kV1IqkK2XgmgIbSyWNFaae1RDtfFbP5BUbzzufi9aSv+f+KjZz0UnChRU0jhCAbtW1mXtEclQGjYHjaIjscRFLImoUVCTgfQV9nLvnlXIKU2vX0TmQ461HbcoUKf87hljFSW0k8l3KpUlMnBO2HpApLn8rTmwUf55d4b/jv7EKkGJjd7bAPsl+wcSyBdWjN2g+kRY4Et6mvxxX8wTDIC5QXkald5OQH6xyyvE8G3hYxDRswZrpUHBBWKQE2OSfwzHPUMKWNK+kTocMEb04CuUeLDq00nwgFNRTgrNSpFYSQmigIt+hp5jM1F2+zxXnlakXwtnA2T3TDMS5ZQb3TXVCXSOZX1+/oRqGA/Cvtjdo1O0A8cuK4FaboOWX2BF9ufH5g8nHIVBD2Oj3fZflRvGvN585RxLb200vvCCN+fMOgDctKZKM16gFxFW38XIPP51gxcAJxtF1qgdlh5ba/P008nYdGH4PCy/4t496EMq7KCEA86fQFOPpICKF4UvJ387bQLHsiBE6oyj1uNcnVNc4L2qRDxOhwqPgKjFECPw763NKTrlyQfD8zfCVjiLVsNtFuYVjwVqH+JewXnYLbVB987t5owQRGj3K9uafh8l7LkdvnSlCfXPfnFwBxjyWUpfjYnrEsxld+Sgf5P3rc+UQuidy17Xix52YeWPri45S775ASVw1SWuijV8P7t6c01EDogv9BOmjLelwgnwtx4xAKgQy3MHleMIqdkNyq0iV0u2V3daUscOHBfwbGxsBSwRm8hVVqvkoxohMTwmvPIlrAvXYEGW1uy/K+fOYq9qmFzIEwPCMddlUvraPzTz0+1VxTxzUmbpDZxNIucw8cIkr8Q+FAevdJZb0mUNEEqkcoKKFJynJRDcsamJ1gBVV87riqEwv2/9v8yNsG/mJAduMskcV+h+LFFRrqPMsqiIfzRW/2dZ3Etx9XuJP2ObU4iVpTBA8mQ4t3jncynjyrKi1Gbq6P9rVpPOgldBmxbS31QcHsrrb++Yd5pF8EsHRIRvClDpOYNtgLtnRMwEE+vEVf9bPPwB6rapfPlxZ4ixuo07ac9lLCL/GqM+UbXU0BghRrtqOw0R3U/0d65IhwMkQqkYO2n2Xm5yPjByoEY+SGlJR1eue0oxzz4C77HvNyx0n7gGk95EqfT0w7W3Lz8DRpD1X+lXRtME7MW3imO+Ws1jjT0WOEMy2fHgbpFs3+xIzwHyIoB9ENlZn0fdWbGG1rQh7BczH6edTtXk4owOLqxuLPZtIYnTgwBeuw4OvJuUYjPETxTpfGMU/Xy2cPIyQ9zfgoHkvR3TZKLF3Gg7I60z4VekDckr9oGKfcJGM096GzrwkWzeVAgXUwgxP6vKkN8IxtwW094Hajsh9qPgVuDdIHrGdAKn3LXDGcdu59KeSxg8Oh/xSN01ULY7AZI8LsE7bRzR6sXGc5LmpUKgrj0yP7+kwp73+ILF9nfUsYy+pBFG98Ro+m54ar7CVMMBiG2Qcv8GS3zYqKntFqjHMyPxXKe/4eNDseEuzHPiUe3lYxZcO7SAoGthCIzeXI2g0eZEKPJX9SnCgGTM/hY3IHUSTX9NoTQ5NuOgn3oUy0ODEXKzf17G2gWdQ+w95ciQFYTZeOEYEryfkj6QhSuWP3yszKsxOAN6GVBbmli41fYW+FKBNkhEcmqa1K8dlulHDZUeXE94tPhCqiLYb+WxLgCk39cJDBPF0g9yQZ/+rl7dbuU9EFivrZ3MOWWrYKzINBxc6nRZszd6D2SbZ3qvYHNf8DQtYN3rJK4HpdoSQ5ktwn7B1CdNbBm3/DCJhUVwdaB/ammclleQ09GPgVWDETDfjwOZB+bgpeSMbKbgskSZumkryJC3BD5ofhSc7YWXCDEZlu40BLhOLSN+hjS8pBklANFWmf3WHmqNk+PUXeHjfuZvTcJaQ4VcU1+oEV5laFO6IlIeixy9EqyrtlPW7wRwAAOzodmpY/asUbBZg3LagtS0nxwyJ8HT3qmpZKWvdP4Dow36at/MzE5YyHU57SMO2zMHWyIdgAgEt/X5uv711cQoGXxRM13k90qNDc+TUAiyki9Li3ZBJSSzrNiplhY57gfx4sxZHRfBwHX03H8K0wwLNYQAH76qA65kYbV1xgeGckGhWGkvzy8I6L4nObEk/n4MO9wPy+MKyfoA/0ihWcvkmwLrXKG1SzJc6TdX7lcf9+xmQEjQtgPO86gcktsb3AhnXisIz45DoGz3HcEYwxm4NcOVeX/wX57BwBKvxEgXEk1O0He0ZoN+UctQDZq70rs4GY/KgwTfkuxmfNHV1/MYe+hBUchdju8tnxg8+o/0MEOfgy07PxD5A5onYEFcAJ6+7wc3dGns9Btbxb1OcEJWvE9mnUkKRWD0GHuzuPeHkDo/9LKS99ifUe8KS1RbgrYsROd0bARm7Mna5zQ9rc1VqwDMHANzAiKEWWCZHDWdzLOyNZ3OkLOMH+7pjxgXdkmWV9Y/rCUJxhf1/aVr4H+l8SnY8A7js0DhQi1Gwwx1YKUou/kY/1G1ZyAbT344FITre5Nk4iqv9fF2xxpBgXY6kqTMtXoySp9YIzzWY79XgwXjsX7Oe4JNJVlYZ5jQY+sy/VZMVrFbsXthJxQwJleBhUmskthpf838FlDIZvLl7IlEy48lxRK0lzlqjqOfRGmhSddYyc6my6P2WAbA0LznqBYkWAN7w52RyIj3KeCDvuIWPmkhs+YlzvYUROYpVJUzpKbBbqCbDmAZjPuKOzwmEO2cPwtspJbRrEJ35ww/ky0dODI7UNdrnyiu3K77N24MSr6NwoFkxB9HaeMBPX4rVSBypklQ/nMUZFwboSpzl03s+e0kmN4rFORFJOTH6Flim4zCPUHjP2JnSxrznJtvMveSQBjhMYBASwilTQQID4Ctj0EaxgeFMISK427YWa4EAyPNm+EbuuFX74EFyOGDAwKCOkoKEpmF+G/hDjKypp4FqcM9pYyliga68KKN2autqxcHQyrxpEEXj0VguJTmIV8qIQpAnJAcrCq1p03em9rtjJBSFqhPSXhcWQetfPhakr0XT0CVMZsEw4QXSSYz0exLuRnSF0qLZvGvStD/vPSK2GvPGqqHVR3EGXBz1A/5EbWvn4K+WczrIiggyzzrnbrp7kLuHesn8GX6g4kl9lSwxRwPwFxwvNP2ZKLgG7ATdOYwvTwycVdjI2/ttv1BWWPCniZuq6dGMlDJ4yk+CavGroNbK6Ur0tv4bSkjOSBKuYU5kavt/iFkRp3scZA2abI/LV9TEX/dgrw/bjfqOCX/lvSqx/gv0QUy8IRswcXIZZxorJeYvJWnQ9/4/Z/brSOnkrovCvRH5JITlochS2EaJlEh493veU215cA8DnGqQqa53Z7qnPeCjM6TRECXFYAPKaMjDQSLPsfidKEbKp29mfJkS5dyeD15ZxEa3SlelxBegvx+JIMyUxZpzVpgZgpeGhG0Gb1yUuExKIt7VwkfKIckZdu86tKuWp2zqAhl+alBv7U8NqEfCX3JfkqPUiZ+aehV+S7ehJcWwWIoHvK3M40/dOUXLdJRAsLB4OFZw9AcvpDSaccFXWMANiUf7UXdEX6YQof3JB9ImpOZDI3da767j2dJ6MbN7odglGuAR7/lIVtkWHfKQsIVdweJ5PEW3rPgBDVJZkzXzqC2VShykWZt3j7DOSdZofd7lXs9I1CsASyQak1rHx6PbTEtZJQMgOvihvXGBl9cdcW3975Thh34i3npAy2mPL6RcdE6m74PkBZTeBh/GvsKoA5Ns5l872svqzjegU255xfbMSUnV6eaQt14ylbjj15LWRqVE4Z8Fp/xfxhOB/IqpCI+SBqZZBcdTMOp02viMkaabijyMYIbTzGVMoJIWEi5zXBP9IeaXrikZKVr13Zp0BCb/QEc3E1C56y/pu2LO5JBeIHOoOaB28+ZQ2K6PVm+p+p26cwP9cyK8EowU3r7TJv/zfwWUMhm8uXpgj0ZDS6/GJOXicMjr6s8F6v37dujgkWDmfbGglmx9bUBp2iIE9lnHWimExKtaxUs+WWd6vtH8meUg3Vp/seVfPQTxpLFVpUfuoEDFSIO3VPHdu/3gyC8Ox0npe/3KqkBBpAnFS4pvfQXlEFoKhDzF+X9cJ5EoZgmGF399UYqRUqd1r4jAxsS6dkJqp3to/PIwYADDHtQ32VEwFI0ErWuM5UTXvYNRBEUXjOKSDFB5xAa3ieldCjcefUVFVVIRMuZjxW1GkQcFV5BtGYcGsk0STey7xcQWj63Fff6ugMn8F7JkWv6w8ZRevozWESD486b2ne8bCZaGeE/bHA/tKo0DLmuAyIkvDdCLq400NAhXg+k8HIOJIo69g1S2IlRXb5EvblVxItKi3ahfQw+62EXiAVsp5l7GWRPOJbaLd2tjYkiKkbxOpO//uxKPFdEK0gIWVCzzQfdkcKjJmLpvp21jTJhBhrn82OWb2eezRW3mRMPukO16dvG3vnUs50SsVB+GvzMxACmFj25QAAJ7CfFca+k5q9rnP/3tG4bpNlmvV5VX2LmCUOFaTc20qW2mMxzah7AP5ZuZoKngw7qDA1IjfTuCoKzgRS90/uJaPNONkgJRDLZ9TAO08kqzIuw/9yK0uyNGF+MMWZ2GLNWGrrJKT8QlN65Rug1Mdz0VvtHGll0pM+tdVe90mQG+p1ZmLayTg27EzTyMJA38nhypukbmfLS19OuphRlZ0WML85zcPtAQ5xSuDitrwfkLnfKsfKhxJfIIAkq73EQT1Pj3EkKs4qhAv+qJCQ4HaeSVDZsSSE/DGjGw/v0pwy8ebHdirECHnIlrXBhEdJhyVjGCyCFGE9om57LtPPHsVnRSoSdImLJ2lMZMbsjXsG4wgUcCKSkDa4pN6SmKNV1B0LS3zzsy4AsQLRrroe28gS2+d1c9QeZX+jLhIXul30g4/pFj4x+dWd4iM1VDjKMt0JCyTtyNV5iKx6afuknna57FGL2iCVtK64fRbFTBDJarx0mqE2p5Aorf2AawXs6V5XERMJ0dJwqlqiNiglgFRW7wRwAAO0X6sNZzxNXlTlZZxsOlmZNbw1zirDmuNbvxZgYl9flYgBWSuI9PVPDXE/Hj83BoTskFKxozv/c1xgSdXXKa2QP3359RvXvZR//0rX23DU95b0LtEpp/5rvdkvZOQefYx0vbB8nPOQm6bDQo3XHSg3Qnhjlykk39thx0jzsStayhtpCxT6+LV5U+jF6mIlSexOSBKYJyPdcO4sG7QvQpHblMzMYRzM7qlGeRHEztdgRTgPHcVXJPmpE5lu7w585UYGccz6DNktyT/2xWnMQRSId2QHW/B0PfkV/yzfhYt2H6MdRM4eXirG1n4zbNNM5b+ClHdQnEetoOBXVf0iXVuj5be1ZD8wuqo+eOEGSqjPQzVtctdwcdXCk0uQIp5CRMLczcinvvtctjhEDSUnymRCU6WuQxDGNM1xTR6IhUKT3AwjiOePTctqlDXMcSkM4bw6oQNzg64puvoyMp43cXEr3NiDEtjNZClpySyIdQ4yMFzEXUL2a268n9h25jjPwdQxoOqi+KOuWTU4cH7qGULI9HE/bgX6RB6gjjc+pY02OhCL0ZeMSPN3ZZzXLHUBj2k6Leqg32XOi8V1W1ptWb5mSo+/RHPlp6IfdBpkHZJ5/HnpBkQA89sTDdzvB2WxEHC6LGBeQ2I0w2GmGzGkO/JtKHeRAx0u1dXNB+Ml3dE4SapT5ezKbWh20OalcbJ7ZXqVUCU6uOqwgjklxAxePMmhWip5j4tQZJZom7tdtWdCdtVHUVyzwNyrrgeSBl4GEClGaHs1s9L/ZupxwNSKNe/9WfwI1/P0r4C79WgdaefirmvdCZJ1JlxdopWvCVAJz8iAcOv2/Hh0JhGYHA7zVLqCiRTixSscsF2Qpkg3FvDFKef9QwmDMTh7x9mKt2qT/cnjERwZx3rTl1V2OPAs554hjTRXxVwxTIKsO6v4NZoOaJU6HcAF+UnMVrivmW5deMFzUPpb1hNO3bsc+gfsWBxd5yzBaA51B+uUZjyz1OozuWfEn6JchtEjxgRwnNuTuyKRjdb3bqMLoKcq1FcGaLagO2ffs9vjovAsm8stJZOU312nJgFieSxpTDSL3BkKtnBSXkFfLd7sxAFs/WBNEVkUltOr4oNYyEH1MiGDIdZ1RdnqWMOQoG6+/mJTr8JGZXEQXk3tcvXIzruat6djHtV99cWekB3LP2qSD61g+4khMGUSkz9VxPWcuvv74peH5iVsW2boN9qRKKPgWvIrR5EeMyffhfSM8lqbYyyKchvzPZwDhe2lVpuyW8EjYbGjaq0xvp8z+66x/vp2SNDj5KF/815apT2M6exvyLAI8rohS6NKSztsl/onsGnf5evQ6jHtYy15B9lTuYl28j1Kmh6lg1qUds/84b6aXEOjWwa3TlVH2ammCKmdGg84+isEe3xBUtlAI8Wz2JmHFKVgGyp9s4CbtRbFkvd3dTVGpn8RyInk+caayGO+nK8j++brJBxhZky+f7EZdd7tdqluluYfT16lTEzW9SNz8sO5McjdiXKLZRD9zW9SYoEm31H7DUpUHbpNJxrjEbemYNJgavTykFbinBKy7O6LxrmqK/OBafY+BnilWM+cI9Z3137jpZ4cjrAp49rPdLJK2LANzKgzBvznEtYGcVJ5JZ1ARunuCrF482vGhxvW9D1BHN5N4BbhTvORDswDjXxruQm7LxBKvYAq+1IQWFDgKCUvPpGQ4m9bk2KSmyVAKJF1HZIK1jT+4hIQ0l247tY7E95e/aBOuknthu69GZaTLNyhSiXa4nMffYHdBhScOrFafCyIDikZAmMtnTcDBxFsvCyQrDRbDIH8ITgVjxw38K4cjs0m1YJ16+j8IqhJT9FmpbjCOwVDYtd9JBdAzP7gzQR8jWX+VPotHGb2UtXxaUYJY9fYaZc07unyG0aKqWN+togguTeXWInUJR6IhozS+BxmMelZOdm2w2O5SlKpboraCl/SKxJMrHFCAEg34Ju43luJPuaFnXC+DP4ZF7SjUxAkz+EWVsrPx9YAIvZkfCtqDXBdJWYXJLOWV52t6aV04XafYW9ISOBbJieNsfxQnIrMOewralQbATe2UDtcwZjkdrmO1h15dbE4E9AJ/T632u40vMviuk84qxGw6sCwWrR6oADl2f1lCYZImSBz8A4Xaab40+3iKfqF8bWeLEEgrx0yd6LznxaJW69g7HSpxIF2YXH5O/cnIafI2ZvDxv9WfjrEEzaKkddWEgNvyH7l/Z3GLTns31KMXMithZY72UJO/+ahpSLmeWLktiQEdrusTj1KI2NWC0CK1SDzq42JORLaE6zyKoMnSEXrtupRh7jzTN3Qmcp4WUuvANjbpcf0A6tK89PLAcIPMOk8hpfUgbjEk/HprZOya9xx1TAxdf+IEkH6lxEY6spMp9F6MVNkFi8a0y/XFDD0lX0ehc6NGkqat0oNqb1ld9tFmFC/4Rtcs2MdBXVZupaEu63+P/tWvNB5UlaXu4xBxzihX/ca+UvhHazTUYjXk+Pnw2sn/5SUwJBCjNtl5yUM2n6D1xBFAbrLSMSgVcIg6QR1eof7J/hDtbRueRdCGgq8+Da/xT7dmA0tOYFcTwYiduF7UrY1HcYX8PCw+IGj+f2WrN3TV6T7F4gYMUzxKrS8Bgai2eQWUIN6WPeAxguQ9DxC/w86d0kMHxWIJnKIhZ7BLdQa+HRHBXUt14Knb7YsVNJdWw1kSZ+4CH2H3qyz4macDNcbo1icP4HIM0wxYQHqC2dsHgxz3dat1lzH5xPZGIs4TQ+OxkgKyh8h92xfu5H1mmPINK6iA2CNWGimHtzilC4oADAZNxs0uFir4H9C/qGN/dyweKWpHOqqlLNdbtROODEqhywlkJ5U0OvMMKnUY14mQ83wWYe5Fa/bjs/O/6QWAaMlhkvlEfkGO7lLSqlspKDMACRJXq7p6eW3bLzLPB6zPPxrQY1nYpGP3kE3MFvokOqDN5yKQV3S861A+MHsXeuZD+lLV4E+yqIM32qJRDg1hFaL53GQldEerWRSescQIC8fAXo4rLmb1jJMB0U44D8UoAEvRLVgOmAznRI+ZSkwD6jTmJ1O87VEuIRy1NJIKHbpdUG+Yb7U8JjaBNtGzIHvlgJl38H0lzygM+pAyvKURhm8F3cfvJO79YqWx3LrbSO5BCDwDKUyGvSy6dBH9xV65jT/f43BgwKuTlXjmKM+6c9EO9W3ddBvPLXA9JX6gWuongqX5s37ZzjE2ziLMxwQlAAAnpmAAAAAFPW7wRwAAO0g3rB98u3XPiIcO73q8ZqwB4UAZXDmvQA6Lqv+HNegAI15NzTrNSdaONKCyU3HoUAACevHBM9lTFo+UAeVNt5IfWeVbaQXDzKG2CiIUPJYOpffkXxNLpI1PPirV/bwA0bYvFVgQvFQon9pRD+zyI7ICiya1HOeEwpCrH/rJ3K7F/AWzZXfwnHiX6G4BOlDoAPsD8Kq5CW7ZwIMhcfL8QJukDViTKDuEAQ1N30t63OYmojd+wwEMG7OQ5nIKHa0LKtwykbSfkk8/pssZHXiKi3Tw0pHSzcKLESMYCmB3kPWkdOne5HsRDU3OnHyx5nvnElq+5JSRJJZ0I74ayVs/wz+pLgp/33WP23pJn0bXybcAZ6jpg3WMBAH64880PCBRF2H9ZkNt9htf0wxaswr9un6H1w2iFqEgT64duGAOLyfnHuAskyAAAEmxbOy8D8v5Gldj1yyhWtbvBHAAA7OjwgW1wstyfYrh9QPQ7q4EiUqpjvbFOklyj32yVNUDIVwaE6VWkZJXGLkphuAfizu0hLX7m3YEZR3uxQ34wGn7Nr4jV+W9OExY/kX9kzSMVoPddnKZb8B8/1igYK1jO0Fy9iCLzq8vGZ9GeZs1KezaV0Cpne8V3pQqaut9DHk2k1u75MQX2RnNDWHuUnjd+EzO9JXR3Zw75H3R9olT26wDEd3UtaMuKHZ9aBJ697pGbfzxFBFk85fRVXpsVfjEKj9jJCajwX9QhYe88GVJD8f1R56RH9Zbt+3FENIOZ7oSYi/hRObG/aJtnyiYQEobsUvjcYN8Li735eZ0weGzwoCqkMUGtvJ6eZGCU4qp8D/G4WSQfjcuN6zEF6Ai5aN71/B0yMx3AbD50IgSAkZ3Q4dn+urbvGKv94IWGelJqaBPx7tg/0KEjm1TqLo3BhHJ89AO3lKZ4mK6CsL3/gw2NhlJsSEZGnsbqOZSQNOnc7klzKzbxsI9lO3Mfd+/9UU5hbzkpRe437UfHG9OU1UfP2b2yuHpfRbeqEdV5dSh/c+M1QWpFtRfHV2zXUj+xX6R7G8VIBCSMjKgixodAJgqsI4u6jV5iP9uJ8nEZ4Rxg5aJziX561+j+0F7kRJ+GmAcx35mYeDNR9+YcOID5OyWbDPJOhnI1r5yo0+iCheDib5EdCfxisrisGUjdjCHgqorDMjYyRUyuXkKbEL/sGT6r4cU38XEyh6M8hSqkWeM6gtt/6yFAHdo9yQXT74qRdPHkPUb2n55X9SxYTFu6uxiXy395xK9/GuhAd3PbfuXGgk3fHVvld3rNLHf7RTn+tlkP23IStgPZzGtFrG4UhFcJ8gGNVy4lxWA2dGRc+MaCxdF9Xm58ed/NfYEVUzKfjk41zLTZEBiLH7s0rYNV1BTf1WJ6XMIMB0FVMbJt/nnW53TDAQY2ofS9nAXHy/cfaWthZexLIvCL9k5nbr3Xd3A9jod5PmgdWvrNtNU116RRxTowgnWZWkX8jsLlqgiZ+Np/mZ/fjNlN/7UQTvMG3bHhvCz2IQK10Yh50NuxI04SUmhIQNPYofaxKYCJLIqut0K7bOCB5gWFZqu18h5zNur8+FFGmt0NbZJW6MQMcbQU32/VAQobNKgiiqhO7zHBCUAACewnYp6lU8DDvB13n7vgMaQrYOD/KIUyNEWYdRLxr8Fm58C7f9jR0UsM3qVnZrK6N05tBT8/+kv3Pt53ojNvvTtSb2qlM/nnA5jPcodzWXl+Ty8JUeR7AFuKKS4Ln1Rmr24A/CdCPlQrbzG7nG5x1pckhOb9oY/D3oPoQND+d8vQoVsJItPe1rkd3AGGoK+9XZf9SKKVf454rWYQYBealAniAsLX2g6Sa0QrvygvStTMKzyS75Y4SBbnhFZGnwLNgr36G7Bs99oH+RfVL+g3or7RpYDyNveuVRkGDLjnYoO//lShJRy5Qksxl6Joy/Pw4aMHOMi7dyIQPz6fe0zTLlOhFZNBtzN2blbMGi/C+EMURR29VLrx+sxGRIGjjHhxcXGl/ZgLrRecajSp05Hjs6Oq6N/ef8bAuF38zQrUSOx7BBj6PhNfTWsywqD9oWgp47Mzf1Lsuzz57bRkv/APiznYODcS3J8KxOds36gFMjC9L68RIp8kK2MmBjtbKe6b3mnZDWPad6QhAcxNmWARw2NpiPN/SPD+8X5hizAaFQSbbVUzoFX/Qr5LVyZPVk9sbD9cdEM7Yavyk1qPm5poSs8Io0R6dgpXGJanFHOTNcZ5Ba2V7rX4HNpjEDmlx5wMF9S7SXsbw8LzbwzccO1ECFxRCcRsZM6QN7tN0396ECJYWY7lUVaBETxvZlEq0hPHC+hODwMn3PegZVI49zQFcGZfP7sY5TgQHTmyojQw+wpBE+b4mGxvBGWl7J8zbamNlnGNmH1MLwJ9QH5GYEQ/jeD/iV0rCjBPaWvmX1d0cd7QSh8HKh/N+Dvn+YHxn7l/ahghYZ0TbPI61DftpDP/HzM7D2iUwLSm3feuNH6bHoM0mSOE0OGHo3SrjC2AWE+QHyYRBEkS65TGXhuMgXvGnuMs34Bp8IdH6rqyXheSVpBUrznhHsaon+OAs+s7i9XlLfHSq8KkgXzChTTVl3y5ov6NU1hdtB2/UCkzbYnScFtlRxd75DLmwG1RWx/sPNQp6Kvv1yTnfqGaowhN4N0WOlu3GMoIT7iA7V5nxQlXgzJfbIfT3Z1O/1BzC20E3mzNpkDlZikcS3zBCEcgVbHQXE88sZZsZOaX2WiR2MGej4ItLoiWWS3doFZinAXmrYi/oWw8hj5WBrlRyxyr7xUEFlVMY9nxkC0y9XH9kKadXGDVqwFVfTjhSH+4OME7PUE38EeN1XmIjaYsDYXTM+V4Mtye4XFxTi4y5Ef/YrjbEqeEQBM3Glqqs7MHqmq81S2o0Yzu94mWppFQL8BxHvNDSGe+rnyUGrugcw0tMArBqUrPe12/8oyZwO6qXNCu/S7qlmnV9P65jLKQTth8GEH8/cFR+nF77QIKhPrM5AiMLORbBcMKe+z9t/FpChJPEv1sJuXJfwDADR2ziqeOIR1Vrpb41CgfG+O6NiBooWbg9uNuBdNbjDvtBX3dT+tmnBM4U6ZQX4rtVBzMkdByh+nFekr7YLeR2wi8WV8k9K/XaUj+bH9hNN4B8VvOn9tT6Vm0/fUWBKLI25WWMu5bU3qUcjb3fonQEVsVV5qx9GI9ZSPkG+2+DyzsUM1sk+QSzrpO7TtNYjHln8hKbQfLLKzQeaax3/AEiG3GQSEbM1P2Hjr05/KBRO254deNN3Mt3vHDLNkMWegWzO0XJq4epHx9iU6AN6qt979MGtylRtwse2S2qjLG5lE7a4Ix/12I5XhWu4OKiX/RdoQIlhEH4WJ+tf8mH8GxYurn6tv0TRTsLFgVEIKlk1Ki/2z/+J3AUwSXsUxjdf/iXgzQ7wCv2sOZrmoWFzxB08gFi7ga/p6wNsjUx+K0oow5OPktI3LuwIRcHfYFJkv5j4gMXovXqO2mqEHbsMsEgVKJoOmhx5MqqFoWaG4zb2NsjIUNkfOtM76J/q4OXtJa3h/G5IrrGpfk0RblwgkfIDaDyfdTxwMGGoQl7HPj15GPPSBjt/P/Acd7wZtSufkytILBnrwoaXnGCSy+uUVyaYbWnVCcqdR5NdCKqwEIl/l4tsWqLuyYbk6QkbMh8j0gSBrfd6Q08j595AzIxbHdWqc6H0NT9fgyBzXw29PM5zjdNXBudlhVmiV6Fr0uI+LvnlAvU0ZJttUoQwKrMkeSdJUtUL1cDctBRkFtcWxeZNznFKmQjdTEdwmatQxzBUdpovqNZ/dywbcze9c0/msh/JVQBrimABY1ziM2WxTwIjDjQ556DTaIOVLQ9bHpenzfopS+Tjk9QT/zyjM9WjXO96oahc66DwP/IkWvrCJLcICRcnyv0P8nUeERBCcLz9QKOlM3dw3UV1cFft+9u+7xDUOzj7gWHYtN/+X2mmZbRslMrjlrKYNfRyIHtBEjN3R+qCRfXm9M58HtvF4KkBfPy7cj58SVAV8GHw1qhGEEtwQ7Gnz1wk+oYzVdJKsE2s8YgKdGDt5J4RiFTvwySBzUQTI5HY9TGlEVg86oCP8JZjxPfGIMw6dYVHMXstPmWAVvo9BeBAYDFijEKZXYNtPstIM3WiOrg4NFSV3TJhkO9d1rvAGBgsOWP1T+Vrq2lA49h45TEzI6fK5cTPEynd3Yw13R/rEw0YAzcufKgHLT130BM1A0L53eduu8hW5Zz7PjBzf+MkXhc3RrE7nvSaNIr5IFB+R34ljmIRi6aAy/uzZfLFmARsWEvfoTk7hWtmcUlThqHqYO3UxreD9NAlqodn38bwFpqTecqmg+wZJT6oDYTSoGv4UoAAE9eOQMBlyDESnHqKhY3/3+98LlmWbgmV8hddolQQvaXm1Pr/Uy69xxPcC+PP+F/I/91xWfQX+dqA6FUsor/uzmZbIvyhRHGfwnpjvOHMXfTnrKoPuyuIxiaL9OgEvPm5ZV97XTVkVkkMf+epdUl38PV3KG2/tIMW+Z7CdYP8vlGwFXF2DOA7B4xLIB6sBvk4RAAeDRE3/zln4pMfrDQ0OTg3EcNl9G2Q7wzg+j40bOYDdBC9Nm0inHHPcJIOzAB4UoeSyWP4C/Mzh4V0aRDdQscjwgm6++j0VCzPuvT6ejIGBTYQMSnvlBFVGUjxCb1dqSVJySwQjW9df9NUFC/2jz9L5GTa8teoFw0/dtRVahlXk84UKv07cvR58f3BE8YTf8K0NAVbsc+axSD7idC1pi4WBn7pXvCNJWi1AAYGH/M/0cAN01IG+ceUog/rlLOkBu21kcLXB4daK7V6nE39Pv+WfozkWJo6hWvA9C9xsMYt445DhdSAyFseDOW3yzZE8XHpbUmg4lBGt+gOvOujzdv49/ICX+yrP4hAGoZkeSHwf7uoImqYAWjuZQe0oJkLl7HkAqURFBAP8fWGvqDJESvXWj8qHxw6LOTJFWKtpoTH6zmA7FaixZUPGGxcHwIUZDdNHym+V4qYZhFVUmrwnXx4YkWTrYiVdAywWTrgtocJ23eMlPAJvzb/d1w7o2jFInUSZyMjZZNYAQsx8xKtNKe25xSgAAT01+WuMBFQF4AGDLWDOv4emqePYPRDcws9BJugWBAAAH+H+8QMCwYD10sgCgeLQ4JxaWOAAB2kCgAAAOuX1XmAAA0lbygfvxt9WcFfQhygxisKnc9S1NJXzJb+7xzI/aAC51LwD+u3u0YlpzxtUySP1XlZSBUbdLVQtsFFLl5K3i3zIjoYbEH7PXMww0IC3y2nOmxN1zRu/T6mwSd7/OcOg3PBf0Twen+PyY1rHQPxGK42axo16fdWBxTAgbQ0CzSCgOxZ1ls32sA3NJ8L1F9zaZhu/Zc/umyDU+FhH+TGmgKZK2f6MvhRBSaDBKnz2cs7rJZ7/pK5+MrBlUioMZceC4ohfe+M7aI8ExxrjfRXYlXJWK8LZag4hAEmvjyWy7P6e/rS0TB7sT9Yz8I6SukBIWTLgwh+v1AsRqwBi1if16KTX5I+oRW3lbO4mE4Wm7NxbvWko8xYQLBefQRqg2EmgKFT/EI+SCkJCBvl0DSwfN5zLfSY0T5l+9ZQtTyJ5v+HW+9w6L0/8WYd580CC6QjcN29DsCg/gBXn6GgJ30Y2k87rIIwYNZyR6uhdYuogO5GvDq13ihSc112RBCvknPEqSjH+KxfoOaPJZDRnujNyWuDRS2zpSkHjqeBlqsWQSpaLWxGzLXH/xggfBY1g5A75nyrY4kDQrP3a/VJXxgMjidPwjRszF4YSnGEzQPPmY9wKSIukFTd4G6O2L+c2iiYH7jnKw1ngx+Cy8ESUGENRgkRTaHxT+mQxZrKEyR0stOm9ePYah1nhmepNW6BI9yDFEIQRvAADwdgd5gAANIq4x8oOJXMXz2jsiLPROsG6NkDoMo6dkCB5yrJ30/O3izUdxNfaYBU3ap80wwjOwTpKVkLI3E5pOkBGRmvQTYJOYye0QbH6JAz9I6DnD78qttodEs+soO35d490HOVb1oU2w18i9QVWyvBBsIelayoYsFMu8lbWU2iBR6Y5BJ9oQ7vEjAZZD/bCcbBje5SMNT/iWFWu7bbxQi/nRJP69U1/bKo2oTaSFfh5rmOJsPWuhvPa247cUXgAvRmDI4hyGdkxlTvwHgRfujEkYfMMy8jgaGC7MY18o8Ls1P2nmtVWsfyyLeDfNROaVxJDpiyeNp4I2UjidvIqFyqIysaU4wswgQ2Kcz9VS4RHPXTn1GaNN2idrq7lkp2alvHVEHnEeQ/r20flXNtwNdZhOU6yeYERFeCl7ZIFSUsgv6EdN66RSYv/q2ZEjZt7zcXpOzF00C8pmUwBiQJxZQ4PdY236EOcjEakUjPhRaL2E1mbraPRj1rnX+xfOmaXRpscchLX+81uyxddrQzPjnRB4HFMstmP7LhzrkXTrFHL7R/t4mt5zdoJhBD/8BWMT5Rk//0w/llhhVwMjD40uULEiFUuzVx1vOQvcqxWg3J98R1yIe0ek62w4INPKMcRJ+v4sIsF4igteXUI/b+AYoKc6frcn9qLbxaq0oF4VIPxiBXmqSIgZgo1ogSJZc8MNtTUzXdEDxqJxE4s2vjw4lzOIZ8MIbp7qz1IX01GAR/cqzWH5dW9O3AFeRwZiCDhH1bQhajSq4XQP9FqGiv9ICqq2F1QDtcYVmqmK3n32MU3ZCsuXcWmT8dUn0XR8R5e6tYD9nE0c656bwdjhCSDu6UP9kW0wfJfyvyvTe1u/0C0ifFlejwsaJGdT439TRbiag1TYz9ikRjS+zYqSiOAWCq4FEGORh3sMvxvpetgUxEpzy+EZ++Tg+/ku/Id/tpD8MUNSu55Jk4OUOrK76kVQ7hVjqDE1uUk6pNpiS/icY2s30uZqvycfBUBXAdK1W8BF7TfGk+94rOa5cK0JuM/kSi98RjpDKr6V+Y/J7frW4mCVmdz6aOwEXltRXbca0ayna5CZelMBB753E+SvXzyFQ5TezjG39biGMlIox+KIPrs8Ybnk9ZFTcH7dwvTO8zIQwrjeaMNP3MGOx/ou4pTPs3TW5yzCGCfzqKJL+20qpFq8Rr5mppIViFwzqiK7UrW4V0vCFne3HSU74TedObD4VvYYJGaKp6/rUBIMrxU0bixKp1Sk/1N+lZp0TdG2mt4hJPkFRmZjkC2YvbejJjgDvJUOpsBppz7Cvy2kx1wREvua5apsuxuo3/0CnCftLAgKOYFXAgJ+175fhReOp/1aPIYYm9prmvUWdRzBiS9ueRaRYKFpyvjSmRi0pkLBCuLnUeqw/MYuQZ6+mBlRyyg1eQ9W8S3k2kuQ5tHv6JQCO3P36FvzCDzCNUccoCK0567duOLaqvzIVl8uq+5bj6Pi6mk/rBm8ACJ7DLUwAAGkxM+f9R7ECOyZ1YXzlMQtYsI6zkDv2/b9v2/ffcSUfxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxcXFxQQDbhDrsYGYAADSVqwAAAAAABamOCEoAAE9OgquNY++52sy8COHIoyC7xTizaMsZf105anjWyQXp++2Seq1D3WbrynvLrc+f720BjnU3nkXJvtTyTVnRnY1Lf6PH0gAtjqge7Y0SsGU4A0K2wNDeMEciRgbPP5Ov7C1t0duXYUmdBJDuO+o3/onrCg63XUXbIPuonB+3/cDizImJKPPbL5lo944mNYuG6uwTSfjtg98CP26nNcJWGcu6lEvWtm2JAxgPdEhOjQRof1Eli/bZwM6ECSJVuWvzPHImEmXoab3Yqu+PATxeYl0Gt1Kl2OS8iKnf+qSg5d/Ayzkf83C38yelAngzDGA06fnIH/tJL/gDQHSCwMn63PheFPe80mqUJpTxh4xfl0FKJN304gr9+7Vol1RWHWkb3wJ7/ka9JEHxne6MQD5p7zKikuSoA1zW35AXpsPfdwmgLrDn7WFKI3jq9Jrm03FdMJzkco2ffya8LOPlN5vvT7vvM8alHYurVFli8HF6Vw9X6s4ppgJcuF14m2L0l2+walX1DYi2LDU8bOKcX7wKQFjPC1YNzxXiNJfxATxVSlZ7GOrykxaeVNj5zefE1JAVtUm/iPxBGDIQ/NWsXjlezuWqcPmEcTazBTOEidgxv3AE1uX3LxZoPOKPBQP2JVLp5pNXgSMxM30leJvfpH2g5aajTKfKhL5lSAlMYE9s0iMihz6qJmKN7V7IFP8DyUA+SFn6JxXpGdqjPOAWI5HSrZDCkfLMB/6X+4D2MDx9zPK8ZA1a5IZejux2V8YYgPJ67BSLT7OYB21G/ptBwrwdqE6Qoi2E6cnPe8pLHDazNJvkQ1KNK35of75gM2BcmQV5srJ+eWjKROsQMXgHskvQ5/H+V79H/EL2oCmx7aci8wYgTbj1SuXBNjao21DP2ER/LQeQHFWBpF21+Q6ihy7aN1rx8pL14AifhytyIHGa20nDavgTHVoKAT9sy9yC5sSGZX7JM7iwzJhJRn4Hq1Yl7TUemUbguTtuFCjQofY6XncfIqODHkErKLe4D0rcLivwcFdZ7tuAMcHOVQFrnPgksuuCT+FIg8+U9eDMuv494ZnhQMgA7vdAsMWAv+hapcD2ixLckRUDCaQcDRuwWhvQHkzRElaVUxL3Ibx02am7+FM4LLQWpoRDw5o545cqJQu4K9kZcoLFGk8zQlzc/W710Mc2v83BJIlBQ+yXeWLBO61RYyNLUZYC0QxGGlt+0koOu/Qbl2nOkCYyO3HejUti2ypejE+SoqHvHWE8ZTzL4UEetCY5PCxxWq3eMN8+ayFrJjewgZ/oGyPwFyYjU+X4UrNfbaLLtDtrcX2R/DozfPe+YeLHD3dgO2svuJs124e/2XCBVPwoLEaMpjfrSbjEFcoK3uuBbxDcDXdglMtrETeldbqkK08KrXmTNWp9fwnW0YmXPg26f41iejRq2C9zd2L34q+v0c5P3e+6bFPs6MefiERrtavTtLv85uJq42ycv4PINeYxhEJG2ihk/VoNMzAANAd9nFAAAnsKkzph0CUMqLnd9B0nye+jDhZY1wBp2qJOcHg5gL8A+w/mMWyJshet9d0ylq2KBMrHoh/E1fEVtKRYYEdGKtwoxjTowWOHbiyyRJCuNzzrkolNpT+HSibXzzhOTqtwhMZ3pEUzfDk9GGy6G4UJxDmZk/9MnAlErftmwDafx25Vf3kBdA5BRz0p+hmph93tM5IaB0y4tZGIwNPmlWeHjO2oqqYP7QecIjc2XrWdOssE0nbcYDAwMDAwMDAwMDAwMBjCarycMd56BEfGhCH+OcoNCGJU56BQdbhy7ZRWKO8SaxrtZm6nv7OD6ccyRq37EoYN7rSz3Gs7Nco/efGFKmSecioTw6rHV6j07uLBc8eG32CsUAkvCkYMKdv/ot5IHCUweUsMfXeeUuk0nSYI++ZsDclF8Kux9ibbOjhNaoxIXkoTQ0tp3Fy5CPHzfKTl2cpOXZyk5dnKTl2cpOXycYHiK1RbWXy+QVwDk/9X1+my9iGHKxwAAO0X3K5La+iAaxdNHLGYVGjUusREEh4huzpH1UKlgB0HnpDBP/FwSLhdr1V742PmPnmyrvd7g3XbMFyzlJz11X/D9KXAILyUDvbqxwM4YeL9nCVzClLr2swz0eCc89iGNzUnMam1SYreATXDi5vGxgAZ0JxTjkdGh9MlDET62AVHzwLjL7+f47NxxnXNMuepKTk4KNsDEjCqaaDBTFkcuSfsWigEFEMIBsdkmwZJH+Ga01MVZ3HpTR0xtZ1Z/u8j+elCGl6J9/lkSU+QAABOHyD3sjJrCskjq+pgBqQWmYBi3UIie5QNFZ/WZfkTu6e08nMpc17kpOZS5r3JScylzXuSk5lLmvdJ/VClRuL56mBAYKSxDyC82MItOYvsHKCkYjxtbrxCEdhuxqcK9oiLWOvX0xBgydLpt/6k+Zxy1BzB82rfvJyaQ+WMhtY3XUW+xRBINedAe2cYWKMnzN3FYX/Pj0EmNNSw18eIYr+ylpPZf4KqY/twwOJncM++5rHrpdWW7zR2VZkTdvsMi1j4EEpYPbI5C2E/h5vJIJIlumARQ6bSEJ9HGTnjL2WYaB8HtEohIUiT0hv+kU4RKRv5pDv/qp1KpgMuyesHB6C6ljn3hDjhWDqzCYgENKqxGxL5+oOboU2yc/290Wv5AybIOMGQi0U3pInDIttGcTzxy1a8bO8glEo2u8cj9JncII6xTTwD5xjUvL+vNoEjAfgd7q5AsINxoElHeRqxk9r5HPNd+1SqTC+CMGI9jq5O8agC0fcrqgt9mqMKoG4Yl6b0JnGmQX1CB0px8DlfiWt6aR+K08Hv70y4ttfCWw2HHghQbPJzaNDCzhWggIhgLp8aMRoiqHg7i6q7rD846PwILKj97kPESoMetasrS45Gzo1/N2sGdp6XQK0jKE33OaIOBQ8iAkqfBTNvT8A4SevqZyk1b5hlGU9qEAWvFiFPjo+/2+VPQNKZPKl/2sCGi9wRnXdQsl2y2OtjTXeNBUk3qX3kQbeNEj8I9cDSufUhF+t7sM8BruCRHcFmsiK3R9QoNGubGoMMDj8RsOueczFpweEiqE326oj+QZ5cuRsKxx8o4FdUclHHFaghKJPlWa0FE8RNYt1vdfSBnI+IXvwbyxePgyB1j6/6feRewPWS1BBrKZkl2U8AgXDy1SvBvMMVAKMDl8I6OU67plMmlSRSLVt+6SnBNhuWkrR2RaSZisYcfe7unMo9iBJMmZkabQjnhRrWgd0N+H6fErcdndt1KORfo9e5bKDz0OQ8LXggj2V/FF4NZSfol9XI0HtZM4CGvJfNxTfYQmdDaiABa7gBD9xoElJmR/sRyuXbeQyMwPFexCLsIkt3Hl2fwMaJvrAcBs9JwvxSUtAHkLFYf9W2otfXdxADIEtKgr4AfiXmzzk61ncsKBSQjOTXYlgGLLyC2X3tuokmKyuhpw9JbEzO/nR+JLEj5Ilwcn1TBTrwxZClL8tpqfvxP6okrFtPm9mF2rqu+J4AJ2Uy0+uezCsA66BU1osiehupN10/nISRv2RPJu8JRfXYWnxxPe1XGDIMNCbNsWVBqhXUXWToUSwXWP5SyczaOpJfXp0NTC58xx+WcRqwQTsogHGy/SV/pZXKFNvtsz/+q9FdSOCcWH4+VzhY4WRD2QUDKz5HDQq2jnb8azIUrTvqsP09EOuJznKE+v3/AVYyoVe2KIlB71MAEpyqAECKO2ZN6YRGvJNIfN32cQ13FdtjfKrf0hnisPsLuOLJ6dKbOoMNN1H0dcqQ4pY3Ak0PaRaQkvo9lStfba460vkVEE2JM30xqs/XKfny9qB/ZjC8Ukbkz1ZCOSE+7ugXxYhjnHDnintCw/naqZC8JmRmO0mOK48t5Qt/FWaZk52mUOcrK2/v970SNYmyl8lyxMNbwWXBvEh8/UQ0qXoBJ1pg0aAARE4eS/f7kE6ZOgF1GVrZhvadSV4aLf1cFymdG2Jc7TnsOtjfN4J8LRDO0BNUVMGLhSHxFeIV7gn49vB7EL0MA6eCKRDpiheltJx45/Dp1T6EZZ07sA8rrvIAuoTV1C8pYskFouRtsG3OqUmJzfb0QDV14FAj67jUUcJuNn+S08b4BvOA/U2Qazh/De97UHkM75Q0EEgJvs5W7BDaFRycylaEF9Vp3svOtC9DMy6h04OdsKZ4/E68Lagq/ruIgmc1KOIXKQcRjevFMM2QjtHI6/Hytz/LJTpcD9xEHQooSYE6KtWnTcJWEKiplsE52qnMqldDhu8mca7qCIJ2MnCNs2h0TKOhi7JpoYNxhMgeRuRqpKd8OoKyQSr0LqOFU2N1t1Q6o4L9KG3fSxvX9YN8HgbCHWNcWBnldTVgnf4jMOCs9C6P2C3/ui6LEfI/u3g4zebvqKCZ31QvrF0RixnBwoTi2TP4z10WWiuvVlFjnbjSpAA5SUSuz8LMU0kI62OgOaEisAuihEbkBetJsWSyWgwIgy8Q9qxBN7e3t7e3t7e3t7e3t7e3t7e3t7e3t7e3t8n/yNvUCAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" alt="Documento aberto com os campos já preenchidos a partir do negócio" style="width:100%;display:block">
          </div>
          <p style="margin:16px 0 0;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:rgba(232,224,204,.5)">O documento abre com as partes, o imóvel e os valores já aplicados</p>
        </div>
      </div>
    </div>
  </section>

  <section id="documentos" style="background:#F7F3EA">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">§ 03 · O que você gera</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:30px"></div>
      <h2 data-anim style="margin:0;max-width:760px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(32px,4.4vw,52px);line-height:1.06;letter-spacing:-.02em;color:#0E0E0E">
        16 documentos. Da autorização de venda à <em style="font-style:italic;color:#7a6435">entrega das chaves.</em>
      </h2>
      <p data-anim style="margin:22px 0 0;max-width:600px;font-size:16px;line-height:1.75;color:#5A544C">Cada modelo é redigido para a operação brasileira, com a fundamentação do Código Civil e a cláusula de corretagem já no lugar. E nenhum começa em branco: todos puxam do dossiê do negócio.</p>

      <div data-anim style="margin-top:52px;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1px;background:#DDD5C7;border:1px solid #DDD5C7">
        <div style="background:#FDFBF6;padding:clamp(26px,3vw,36px)">
          <p style="margin:0 0 8px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">5 documentos</p>
          <h3 style="margin:0 0 14px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:23px;line-height:1.15;letter-spacing:-.01em;color:#0E0E0E">Captação e pré-contrato</h3>
          <p style="margin:0;font-size:13.5px;line-height:1.7;color:#5A544C">Autorização de Venda · Proposta e Reserva · Recibo de Sinal · Contrato de Corretagem · Checklist Documental</p>
        </div>
        <div style="background:#FDFBF6;padding:clamp(26px,3vw,36px)">
          <p style="margin:0 0 8px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">6 variações</p>
          <h3 style="margin:0 0 14px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:23px;line-height:1.15;letter-spacing:-.01em;color:#0E0E0E">Promessas de compra e venda</h3>
          <p style="margin:0;font-size:13.5px;line-height:1.7;color:#5A544C">Financiada · À vista · Com FGTS · Com dação em pagamento · Simplificada · Permuta</p>
        </div>
        <div style="background:#FDFBF6;padding:clamp(26px,3vw,36px)">
          <p style="margin:0 0 8px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">5 documentos</p>
          <h3 style="margin:0 0 14px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:23px;line-height:1.15;letter-spacing:-.01em;color:#0E0E0E">Execução e encerramento</h3>
          <p style="margin:0;font-size:13.5px;line-height:1.7;color:#5A544C">Entrega de Chaves e Posse · Entrega das Chaves · Transmissão da Posse · Recibo de Comissão · Distrato</p>
        </div>
      </div>

      <p data-anim style="margin:clamp(32px,4vw,44px) 0 0;font-size:15.5px;line-height:1.75;color:#5A544C"><a href="/documentos" style="color:#7a6435;border-bottom:1px solid rgba(201,168,76,.5);padding-bottom:1px">Ver o que cada um resolve</a>, um por um, com quando usar cada modelo.</p>
    </div>
  </section>

  <section style="background:#F3EBE0;border-top:1px solid #DDD5C7">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">A prova está no documento</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:30px"></div>
      <h2 data-anim style="margin:0;max-width:820px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(32px,4.4vw,52px);line-height:1.06;letter-spacing:-.02em;color:#0E0E0E">O documento é a primeira coisa que o cliente <em style="font-style:italic;color:#7a6435">vê do seu trabalho.</em></h2>

      <div data-anim style="margin-top:44px;background:#FDFBF6;border:1px solid #DDD5C7;padding:clamp(26px,3.6vw,48px)">
        <p style="margin:0 0 18px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">Cláusula 4ª · natureza das arras</p>
        <p style="margin:0;max-width:64ch;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,26px);line-height:1.5;color:#0E0E0E">As arras ora pagas têm natureza confirmatória, na forma dos artigos 417 a 419 do Código Civil, imputando-se ao preço em caso de conclusão do negócio.</p>
        <p style="margin:22px 0 0;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:#6B645B">Recibo de sinal · saída em .docx</p>
      </div>

      <div data-anim style="margin-top:40px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(24px,3.5vw,48px);align-items:start">
        <div>
          <p style="margin:0 0 10px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">Quem escreveu</p>
          <p style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:500;line-height:1.25;letter-spacing:-.01em;color:#0E0E0E">Prime Circle</p>
          <p style="margin:8px 0 0;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:#7a6435">CNPJ 58.409.058/0001-73</p>
        </div>
        <p style="margin:0;font-size:15.5px;line-height:1.78;color:#5A544C">Cada modelo aqui existe porque precisou existir em uma negociação de verdade: as cláusulas vieram do que faltou em contratos anteriores, os prazos do que deu problema, e as conferências do que o cartório apontou na hora errada.</p>
      </div>
    </div>
  </section>

  <section id="validador" style="background:#0E0E0E;color:#F5F1E6">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px);display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:clamp(40px,6vw,80px);align-items:center">
      <div data-anim>
        <p style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#C9A84C">§ 04 · Validador de minuta</p>
        <div style="width:44px;height:1px;background:rgba(201,168,76,.5);margin-bottom:30px"></div>
        <h2 style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(32px,4.4vw,52px);line-height:1.06;letter-spacing:-.02em;color:#F5F1E6">
          O contrato que chega pronto também <em style="font-style:italic;color:#C9A84C">precisa de leitura.</em>
        </h2>
        <p style="margin:26px 0 0;max-width:520px;font-size:16px;line-height:1.78;color:rgba(232,224,204,.78)">
          Cole o texto ou envie o arquivo que o outro lado mandou. A validação confronta a minuta com uma base jurídica curada e devolve o que está ausente, o que está desequilibrado e o que merece atenção. Você responde ainda hoje, com argumento na mão, em vez de pedir mais um prazo.
        </p>
        <p style="margin:22px 0 0;max-width:520px;font-size:14px;line-height:1.7;color:rgba(232,224,204,.52)">
          A leitura é um apoio à sua análise, não um parecer jurídico sobre o caso concreto.
        </p>
      </div>
      <div data-anim style="background:#161412;border:1px solid rgba(245,241,230,.10);padding:clamp(26px,3vw,36px)">
        <p style="margin:0 0 22px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.28em;text-transform:uppercase;color:rgba(232,224,204,.45)">Resultado da leitura</p>
        <div style="display:flex;flex-direction:column;gap:16px">
          <div data-apontamento style="display:flex;gap:14px;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid rgba(245,241,230,.08)">
            <span style="flex:none;width:6px;height:6px;border-radius:50%;background:#C9A84C;margin-top:7px"></span>
            <div><p style="margin:0 0 4px;font-size:14.5px;font-weight:500;color:#F5F1E6">Cláusula de arras sem natureza definida</p><p style="margin:0;font-size:13px;line-height:1.6;color:rgba(232,224,204,.6)">O texto não diz se são confirmatórias ou penitenciais. A consequência do arrependimento muda por completo.</p></div>
          </div>
          <div data-apontamento style="display:flex;gap:14px;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid rgba(245,241,230,.08)">
            <span style="flex:none;width:6px;height:6px;border-radius:50%;background:#C9A84C;margin-top:7px"></span>
            <div><p style="margin:0 0 4px;font-size:14.5px;font-weight:500;color:#F5F1E6">Prazo de outorga da escritura ausente</p><p style="margin:0;font-size:13px;line-height:1.6;color:rgba(232,224,204,.6)">Sem prazo, não há mora. A cobrança do vendedor fica sem data para começar.</p></div>
          </div>
          <div data-apontamento style="display:flex;gap:14px;align-items:flex-start">
            <span style="flex:none;width:6px;height:6px;border-radius:50%;background:rgba(232,224,204,.35);margin-top:7px"></span>
            <div><p style="margin:0 0 4px;font-size:14.5px;font-weight:500;color:#F5F1E6">Comissão citada sem percentual</p><p style="margin:0;font-size:13px;line-height:1.6;color:rgba(232,224,204,.6)">A cláusula menciona a corretagem, mas não fixa valor nem vencimento.</p></div>
          </div>
        </div>
        <p style="margin:24px 0 0;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.1em;color:rgba(232,224,204,.35)">Exemplo ilustrativo de apontamentos.</p>
      </div>
    </div>
  </section>

  <section style="background:#F7F3EA">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">Apoio de especialista</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:30px"></div>
      <h2 data-anim style="margin:0;max-width:820px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(32px,4.4vw,52px);line-height:1.06;letter-spacing:-.02em;color:#0E0E0E">Gerar resolve a rotina. Validar resolve o que chega pronto. <em style="font-style:italic;color:#7a6435">E o que não cabe em nenhum dos dois?</em></h2>
      <div data-anim style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(28px,4vw,56px);margin-top:44px;align-items:start">
        <p style="margin:0;font-size:16px;line-height:1.78;color:#5A544C">Toda negociação tem uma particularidade que foge do padrão, e é onde o corretor autônomo costuma ficar sozinho. Aqui a dúvida tem dois caminhos, e você escolhe pelo tamanho dela. <strong style="font-weight:600;color:#0E0E0E">No primeiro nível</strong>, um agente especializado responde na hora, ancorado na base jurídica da plataforma. <strong style="font-weight:600;color:#0E0E0E">No segundo</strong>, o pedido vai para um profissional experiente, com o negócio já anexado: sem sair da operação, sem recomeçar a explicação do zero.</p>
        <div style="display:flex;flex-direction:column;gap:1px;background:#DDD5C7;border:1px solid #DDD5C7">
          <div style="background:#0E0E0E;padding:24px"><h3 style="margin:0 0 8px;font-size:15px;font-weight:600;color:#F5F1E6">Isto não substitui o seu advogado</h3><p style="margin:0;font-size:14px;line-height:1.68;color:rgba(232,224,204,.75)">É apoio para decidir o próximo passo. A análise jurídica do caso concreto continua sendo caminho, e a plataforma não a dispensa.</p></div>
        </div>
      </div>
    </div>
  </section>

  <section style="background:#F3EBE0;border-top:1px solid #DDD5C7">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(72px,10vw,108px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">§ 05 · Para imobiliárias</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:30px"></div>
      <h2 data-anim style="margin:0;max-width:740px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(30px,4.2vw,48px);line-height:1.06;letter-spacing:-.02em;color:#0E0E0E">
        Dez corretores, dez modelos de contrato diferentes. <em style="font-style:italic;color:#7a6435">Até aqui.</em>
      </h2>
      <p data-anim style="margin:22px 0 0;max-width:620px;font-size:16px;line-height:1.75;color:#5A544C">Uma redação só na equipe inteira, a régua da validação sob controle do administrador da conta, e o dado do cliente restrito a quem cadastrou. <a href="/imobiliarias" style="color:#7a6435;border-bottom:1px solid rgba(201,168,76,.5);padding-bottom:1px">Ver como funciona para a equipe</a>.</p>
    </div>
  </section>

  <section id="preco" style="background:#0E0E0E;color:#F5F1E6;border-top:1px solid rgba(245,241,230,.10)">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px);display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(36px,5vw,64px);align-items:center">
      <div data-anim>
        <p style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#C9A84C">§ 06 · Preço</p>
        <div style="width:44px;height:1px;background:rgba(201,168,76,.5);margin-bottom:30px"></div>
        <h2 style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(40px,5.6vw,68px);line-height:1.02;letter-spacing:-.02em;color:#F5F1E6">15 dias <em style="font-style:italic;color:#C9A84C">grátis.</em></h2>
        <p style="margin:24px 0 0;max-width:520px;font-size:16px;line-height:1.78;color:rgba(232,224,204,.78)">A plataforma inteira liberada por 15 dias, sem cartão de crédito e sem limite de documentos. Terminado o teste, gerar documento e validar minuta pausam, e os seus negócios continuam acessíveis: nada do que você cadastrou fica preso aqui. Como não pedimos cartão, nada é cobrado sem que você peça.</p>
        <div data-anim style="margin:30px 0 0;padding:22px 0 0;max-width:560px;border-top:1px solid rgba(245,241,230,.12)">
          <p style="margin:0;font-size:15.5px;line-height:1.72;color:rgba(232,224,204,.78)">No mercado, uma única minuta avulsa custa de <strong style="font-weight:600;color:#F5F1E6">R$ 800 a R$ 2.500</strong>. Aqui, os 16 documentos e o validador de minuta <strong style="font-weight:600;color:#C9A84C">a partir de R$ 69 por mês</strong>, com uso avulso por operação para quem não quer assinar.</p>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:20px;align-items:center;margin-top:32px">
          <a href="/signup" style="display:inline-flex;align-items:center;height:52px;padding:0 32px;border-radius:999px;background:#C9A84C;color:#0E0E0E;font-size:15px;font-weight:600;transition:background 200ms cubic-bezier(.22,.61,.36,1),transform 200ms cubic-bezier(.22,.61,.36,1)" style-hover="background:#F5F1E6;transform:translateY(-1px)">Criar conta grátis</a>
          <a href="#perguntas" style="font-size:15px;color:#F5F1E6;border-bottom:1px solid rgba(201,168,76,.5);padding-bottom:2px;transition:color 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#C9A84C;border-bottom-color:#C9A84C">Ler as perguntas frequentes</a>
          <a href="/planos" style="font-size:15px;color:#F5F1E6;border-bottom:1px solid rgba(201,168,76,.5);padding-bottom:2px;transition:color 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#C9A84C;border-bottom-color:#C9A84C">Ver os planos e valores</a>
        </div>
      </div>
      <div data-anim style="display:grid;gap:0">
        <div style="display:flex;justify-content:space-between;gap:20px;padding:14px 0;border-bottom:1px dashed rgba(245,241,230,.2)">
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(232,224,204,.55)">Documentos</span>
          <span style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:19px;color:#F5F1E6">todos os 16, sem limite</span>
        </div>
        <div style="display:flex;justify-content:space-between;gap:20px;padding:14px 0;border-bottom:1px dashed rgba(245,241,230,.2)">
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(232,224,204,.55)">Validador de minuta</span>
          <span style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:19px;color:#F5F1E6">incluído</span>
        </div>
        <div style="display:flex;justify-content:space-between;gap:20px;padding:14px 0;border-bottom:1px dashed rgba(245,241,230,.2)">
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(232,224,204,.55)">Cartão de crédito</span>
          <span style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:19px;color:#F5F1E6">não pedimos</span>
        </div>
        <div style="display:flex;justify-content:space-between;gap:20px;padding:14px 0;border-bottom:1px dashed rgba(245,241,230,.2)">
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(232,224,204,.55)">Período de teste</span>
          <span style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:19px;color:#F5F1E6">15 dias</span>
        </div>
      </div>
    </div>
  </section>

  <section id="perguntas" style="background:#F7F3EA">
    <div style="max-width:900px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">§ 07 · Perguntas</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:40px"></div>
      <div data-anim style="border-top:1px solid #DDD5C7">

        <div data-faq style="border-bottom:1px solid #DDD5C7">
          <button type="button" data-faq-botao style="display:flex;width:100%;align-items:baseline;justify-content:space-between;gap:20px;background:none;border:0;padding:24px 0;text-align:left;cursor:pointer;font-family:inherit">
            <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,24px);font-weight:500;color:#0E0E0E">Sai em Word mesmo? Consigo editar depois?</span>
            <span data-faq-sinal style="flex:none;font-family:'JetBrains Mono',monospace;font-size:16px;color:#8B7340;transition:transform 200ms cubic-bezier(.22,.61,.36,1)">+</span>
          </button>
          <div data-faq-corpo style="overflow:hidden;transition:max-height 220ms cubic-bezier(.22,.61,.36,1),opacity 200ms cubic-bezier(.22,.61,.36,1)">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#5A544C">Sim. O arquivo baixa em .docx, aberto. Você ajusta o que for específico do negócio, imprime ou manda para assinatura da forma que já usa.</p>
          </div>
        </div>

        <div data-faq style="border-bottom:1px solid #DDD5C7">
          <button type="button" data-faq-botao style="display:flex;width:100%;align-items:baseline;justify-content:space-between;gap:20px;background:none;border:0;padding:24px 0;text-align:left;cursor:pointer;font-family:inherit">
            <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,24px);font-weight:500;color:#0E0E0E">Preciso entender de direito para usar?</span>
            <span data-faq-sinal style="flex:none;font-family:'JetBrains Mono',monospace;font-size:16px;color:#8B7340;transition:transform 200ms cubic-bezier(.22,.61,.36,1)">+</span>
          </button>
          <div data-faq-corpo style="overflow:hidden;transition:max-height 220ms cubic-bezier(.22,.61,.36,1),opacity 200ms cubic-bezier(.22,.61,.36,1)">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#5A544C">Não. Cada documento é apresentado em português do dia a dia, com uma explicação do que ele é e de quando usar. Onde a escolha muda a cláusula, como na natureza das arras, você lê o efeito antes de decidir.</p>
          </div>
        </div>

        <div data-faq data-faq-aberto style="border-bottom:1px solid #DDD5C7">
          <button type="button" data-faq-botao style="display:flex;width:100%;align-items:baseline;justify-content:space-between;gap:20px;background:none;border:0;padding:24px 0;text-align:left;cursor:pointer;font-family:inherit">
            <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,24px);font-weight:500;color:#0E0E0E">Isso substitui o advogado? E os documentos têm validade?</span>
            <span data-faq-sinal style="flex:none;font-family:'JetBrains Mono',monospace;font-size:16px;color:#8B7340;transition:transform 200ms cubic-bezier(.22,.61,.36,1)">+</span>
          </button>
          <div data-faq-corpo style="overflow:hidden;transition:max-height 220ms cubic-bezier(.22,.61,.36,1),opacity 200ms cubic-bezier(.22,.61,.36,1)">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#5A544C">Não, e não é essa a proposta. O que sai daqui é o documento de rotina da intermediação, redigido com fundamentação no Código Civil, que você deixa de terceirizar a cada negócio. Quando a operação foge do padrão, você leva o caso ao Especialista sem sair da plataforma, e a análise de um advogado continua sendo o caminho. A ideia não é tirar o advogado da operação, é tirar ele da papelada repetitiva. Sobre validade: os modelos são redigidos com fundamentação no Código Civil e nas práticas da intermediação imobiliária, e, como em qualquer contrato, ela depende das partes, do objeto e da forma no caso concreto.</p>
          </div>
        </div>

        <div data-faq style="border-bottom:1px solid #DDD5C7">
          <button type="button" data-faq-botao style="display:flex;width:100%;align-items:baseline;justify-content:space-between;gap:20px;background:none;border:0;padding:24px 0;text-align:left;cursor:pointer;font-family:inherit">
            <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,24px);font-weight:500;color:#0E0E0E">Serve para locação?</span>
            <span data-faq-sinal style="flex:none;font-family:'JetBrains Mono',monospace;font-size:16px;color:#8B7340;transition:transform 200ms cubic-bezier(.22,.61,.36,1)">+</span>
          </button>
          <div data-faq-corpo style="overflow:hidden;transition:max-height 220ms cubic-bezier(.22,.61,.36,1),opacity 200ms cubic-bezier(.22,.61,.36,1)">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#5A544C">Ainda não. Os dezesseis documentos cobrem compra e venda, da captação ao encerramento. Se a sua carteira é de locação, o que existe aqui hoje não vai te atender, e preferimos dizer isso antes de você criar a conta.</p>
          </div>
        </div>

        <div data-faq style="border-bottom:1px solid #DDD5C7">
          <button type="button" data-faq-botao style="display:flex;width:100%;align-items:baseline;justify-content:space-between;gap:20px;background:none;border:0;padding:24px 0;text-align:left;cursor:pointer;font-family:inherit">
            <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,24px);font-weight:500;color:#0E0E0E">E os dados dos meus clientes?</span>
            <span data-faq-sinal style="flex:none;font-family:'JetBrains Mono',monospace;font-size:16px;color:#8B7340;transition:transform 200ms cubic-bezier(.22,.61,.36,1)">+</span>
          </button>
          <div data-faq-corpo style="overflow:hidden;transition:max-height 220ms cubic-bezier(.22,.61,.36,1),opacity 200ms cubic-bezier(.22,.61,.36,1)">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#5A544C">Ficam na sua conta. Nenhum outro corretor e nenhuma imobiliária têm acesso ao seu cadastro de partes, aos seus negócios ou aos documentos que você gera: a regra de acesso é por dono do registro e roda no servidor, não é uma configuração de tela que alguém pode virar. Os registros da validação de minutas são apagados automaticamente após 30 dias, por compromisso de LGPD.</p>
          </div>
        </div>

      </div>
    </div>
  </section>

  <section style="background:#0E0E0E;color:#F5F1E6">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(84px,12vw,136px) clamp(20px,5vw,60px);text-align:center">
      <div data-anim style="display:flex;justify-content:center;margin-bottom:32px">
        <svg viewBox="0 0 100 100" role="img" aria-label="Prime Circle" style="width:44px;height:44px;flex:none"><circle cx="36" cy="50" r="30" stroke="#C9A84C" stroke-width="4" fill="none"></circle><circle cx="64" cy="50" r="30" stroke="#F5F1E6" stroke-width="4" fill="none"></circle><circle cx="50" cy="50" r="4" fill="#C9A84C"></circle></svg>
      </div>
      <h2 data-anim style="margin:0 auto;max-width:760px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(34px,5vw,60px);line-height:1.04;letter-spacing:-.02em;color:#F5F1E6">
        Gere o próximo contrato aqui e <em style="font-style:italic;color:#C9A84C">compare com o seu.</em>
      </h2>
      <p data-anim style="margin:24px auto 0;max-width:540px;font-size:16.5px;line-height:1.75;color:rgba(232,224,204,.75)">
        O cadastro leva menos tempo do que trocar os nomes num modelo antigo: você cria a conta, confirma pelo link que chega no e-mail e entra. Ninguém precisa aprovar nada. Depois disso, os documentos da sua próxima operação saem prontos.
      </p>
      <div data-anim style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center;align-items:center;margin-top:40px">
        <a href="/signup" style="display:inline-flex;align-items:center;height:54px;padding:0 34px;border-radius:999px;background:#C9A84C;color:#0E0E0E;font-size:15px;font-weight:600;transition:background 200ms cubic-bezier(.22,.61,.36,1),transform 200ms cubic-bezier(.22,.61,.36,1)" style-hover="background:#F5F1E6;transform:translateY(-1px)">Criar conta grátis</a>
        <a href="#documentos" style="font-size:15px;color:#F5F1E6;border-bottom:1px solid rgba(201,168,76,.5);padding-bottom:2px;transition:color 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#C9A84C;border-bottom-color:#C9A84C">Ver os 16 documentos</a>
      </div>
      <p data-anim style="margin:26px 0 0;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;color:rgba(232,224,204,.72)">15 dias grátis. Sem cartão. Sem instalação.</p>
    </div>
  </section>

${DESIGN_RODAPE}

</div>`

// A maquinaria (revelacao, hover, acordeao, cabecalho que condensa, parallax)
// olha o DOM a partir da raiz e nao sabe qual pagina esta dentro dela. Por isso
// ela virou componente com o HTML por parametro: a abertura e as paginas de
// apoio usam a MESMA implementacao, e um conserto aqui vale para as tres.
export function PaginaDesign({ html }: { html: string }) {
  const navigate = useNavigate()
  const raiz = useRef<HTMLDivElement>(null)

  // Trocar de pagina no SPA preserva a rolagem. Sem isto, quem clica em "Ver os
  // 16 documentos" no meio da abertura cai no meio da /documentos, sem titulo
  // na tela, e a pagina parece quebrada.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [html])

  useEffect(() => {
    const no = raiz.current
    if (!no) return
    const limpar: (() => void)[] = []
    const reduz =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // style-hover: usado nos links do menu e nos botoes. Guarda o style base e
    // devolve na saida, sem reescrever o atributo inteiro.
    Array.from(no.querySelectorAll<HTMLElement>('[style-hover]')).forEach((el) => {
      const base = el.getAttribute('style') || ''
      const hov = el.getAttribute('style-hover') || ''
      const entra = () => el.setAttribute('style', base + ';' + hov)
      const sai = () => el.setAttribute('style', base)
      el.addEventListener('mouseenter', entra)
      el.addEventListener('mouseleave', sai)
      el.addEventListener('focusin', entra)
      el.addEventListener('focusout', sai)
      limpar.push(() => {
        el.removeEventListener('mouseenter', entra)
        el.removeEventListener('mouseleave', sai)
        el.removeEventListener('focusin', entra)
        el.removeEventListener('focusout', sai)
      })
    })

    // Superficies de cartao: fundo, filete de ouro e 1 px de subida, com a
    // saida animada e o mesmo estado no foco por teclado.
    Array.from(no.querySelectorAll<HTMLElement>('[data-card]')).forEach((el) => {
      const escuro = !!el.getAttribute('href')
      const base = {
        background: el.style.background,
        borderTopColor: el.style.borderTopColor,
        borderLeftColor: el.style.borderLeftColor,
        transform: el.style.transform,
      }
      const entra = () => {
        el.style.background = escuro ? '#1A1713' : '#F3EBE0'
        el.style.borderTopColor = '#C9A84C'
        el.style.borderLeftColor = '#C9A84C'
        el.style.transform = 'translateY(-1px)'
      }
      const sai = () => {
        el.style.background = base.background
        el.style.borderTopColor = base.borderTopColor
        el.style.borderLeftColor = base.borderLeftColor
        el.style.transform = base.transform
      }
      el.addEventListener('mouseenter', entra)
      el.addEventListener('mouseleave', sai)
      el.addEventListener('focusin', entra)
      el.addEventListener('focusout', sai)
      limpar.push(() => {
        el.removeEventListener('mouseenter', entra)
        el.removeEventListener('mouseleave', sai)
        el.removeEventListener('focusin', entra)
        el.removeEventListener('focusout', sai)
      })
    })

    // FAQ em acordeao. A altura anima por max-height medido, entao a resposta
    // continua inteira, sem corte.
    const itens = Array.from(no.querySelectorAll<HTMLElement>('[data-faq]'))
    const fechar = (item: HTMLElement) => {
      const corpo = item.querySelector<HTMLElement>('[data-faq-corpo]')
      const sinal = item.querySelector<HTMLElement>('[data-faq-sinal]')
      const botao = item.querySelector<HTMLElement>('[data-faq-botao]')
      if (corpo) {
        corpo.style.maxHeight = '0px'
        corpo.style.opacity = '0'
      }
      if (sinal) sinal.style.transform = 'rotate(0deg)'
      if (botao) botao.setAttribute('aria-expanded', 'false')
      item.removeAttribute('data-faq-aberto')
    }
    const abrir = (item: HTMLElement) => {
      const corpo = item.querySelector<HTMLElement>('[data-faq-corpo]')
      const sinal = item.querySelector<HTMLElement>('[data-faq-sinal]')
      const botao = item.querySelector<HTMLElement>('[data-faq-botao]')
      if (corpo) {
        corpo.style.maxHeight = corpo.scrollHeight + 'px'
        corpo.style.opacity = '1'
      }
      if (sinal) sinal.style.transform = 'rotate(45deg)'
      if (botao) botao.setAttribute('aria-expanded', 'true')
      item.setAttribute('data-faq-aberto', '')
    }
    itens.forEach((item) => {
      const botao = item.querySelector<HTMLElement>('[data-faq-botao]')
      if (!botao) return
      if (item.hasAttribute('data-faq-aberto')) abrir(item)
      else fechar(item)
      const clique = () => {
        const aberto = item.hasAttribute('data-faq-aberto')
        itens.forEach((outro) => {
          if (outro !== item) fechar(outro)
        })
        if (aberto) fechar(item)
        else abrir(item)
      }
      botao.addEventListener('click', clique)
      limpar.push(() => botao.removeEventListener('click', clique))
    })

    // Menu mobile: abrir e fechar e puro CSS (checkbox), para o menu existir
    // mesmo com o script quebrado. O JS so fecha ao tocar num link; sem ele, o
    // proprio X fecha.
    const caixaMenu = no.querySelector<HTMLInputElement>('[data-menu-caixa]')
    const painelMenu = no.querySelector<HTMLElement>('[data-menu-mobile]')
    if (caixaMenu && painelMenu) {
      const fecharMenu = () => {
        caixaMenu.checked = false
      }
      painelMenu.addEventListener('click', fecharMenu)
      limpar.push(() => painelMenu.removeEventListener('click', fecharMenu))
    }

    // Cabecalho que condensa depois de 120 px de rolagem.
    const interno = no.querySelector<HTMLElement>('[data-header-inner]')
    const sub = no.querySelector<HTMLElement>('[data-header-sub]')
    if (interno) {
      let condensado = false
      let pedido: number | null = null
      const aplicar = () => {
        pedido = null
        const alvo = (window.scrollY || 0) > 120
        if (alvo === condensado) return
        condensado = alvo
        interno.style.height = alvo ? '56px' : '72px'
        if (sub) {
          sub.style.opacity = alvo ? '0' : '1'
          sub.style.maxHeight = alvo ? '0px' : '14px'
          sub.style.marginTop = alvo ? '0px' : '5px'
        }
      }
      const aoRolar = () => {
        if (pedido === null) pedido = requestAnimationFrame(aplicar)
      }
      window.addEventListener('scroll', aoRolar, { passive: true })
      aplicar()
      limpar.push(() => {
        window.removeEventListener('scroll', aoRolar)
        if (pedido !== null) cancelAnimationFrame(pedido)
      })
    }

    if (!reduz) {
      // Revelacao por elemento, em cascata de 70 ms dentro de cada grupo de irmaos.
      const alvos = Array.from(no.querySelectorAll<HTMLElement>('[data-anim]'))
      if (alvos.length && 'IntersectionObserver' in window) {
        alvos.forEach((el) => {
          el.style.opacity = '0'
          el.style.willChange = 'opacity, transform'
        })
        const ordem = new Map<Element | null, number>()
        const obs = new IntersectionObserver(
          (entradas) => {
            entradas.forEach((e) => {
              if (!e.isIntersecting) return
              const el = e.target as HTMLElement
              const pai = el.parentElement
              const i = ordem.get(pai) || 0
              ordem.set(pai, Math.min(i + 1, 5))
              el.style.animation = 'pcSubir 620ms cubic-bezier(.22,.61,.36,1) ' + i * 70 + 'ms both'
              el.addEventListener(
                'animationend',
                () => {
                  el.style.willChange = 'auto'
                },
                { once: true },
              )
              obs.unobserve(el)
            })
          },
          // threshold 0 + rootMargin: basta um pixel entrar na tela. Com fracao,
          // um elemento mais alto que a viewport nunca alcanca o limite e fica
          // preso em opacity 0.
          { threshold: 0, rootMargin: '0px 0px -8% 0px' },
        )
        alvos.forEach((el) => obs.observe(el))
        // Rede de seguranca: nada nesta pagina pode depender do observer disparar.
        const destravar = window.setTimeout(() => {
          obs.disconnect()
          alvos.forEach((el) => {
            if (el.style.opacity === '0') {
              el.style.opacity = '1'
              el.style.animation = ''
            }
          })
        }, 2500)
        limpar.push(() => {
          obs.disconnect()
          window.clearTimeout(destravar)
        })
      }

      // Faixa de dados: cada numero conta de zero ao valor, uma unica vez.
      const numeros = Array.from(no.querySelectorAll<HTMLElement>('[data-count]'))
      if (numeros.length && 'IntersectionObserver' in window) {
        const obsN = new IntersectionObserver(
          (entradas) => {
            entradas.forEach((e) => {
              if (!e.isIntersecting) return
              const el = e.target as HTMLElement
              obsN.unobserve(el)
              const fim = parseInt(el.getAttribute('data-count') || '0', 10) || 0
              const t0 = performance.now()
              const passo = (t: number) => {
                const p = Math.min((t - t0) / 900, 1)
                el.textContent = String(Math.round(fim * (1 - Math.pow(1 - p, 3))))
                if (p < 1) requestAnimationFrame(passo)
              }
              el.textContent = '0'
              requestAnimationFrame(passo)
            })
          },
          { threshold: 0.4 },
        )
        numeros.forEach((el) => obsN.observe(el))
        limpar.push(() => obsN.disconnect())
      }

      // Profundidade na arte do hero: so transform, com teto de 14 px para a
      // etiqueta nao descolar do cartao.
      const camadas = Array.from(no.querySelectorAll<HTMLElement>('[data-parallax]'))
      if (camadas.length) {
        let pedido: number | null = null
        const aplicar = () => {
          pedido = null
          const y = window.scrollY || 0
          if (y > 900) return
          camadas.forEach((el) => {
            const f = parseFloat(el.getAttribute('data-parallax') || '0') || 0
            const d = Math.max(-14, Math.min(14, (y * f) / 100))
            el.style.transform = 'translate3d(0,' + d + 'px,0)'
          })
        }
        const aoRolar = () => {
          if (pedido === null) pedido = requestAnimationFrame(aplicar)
        }
        window.addEventListener('scroll', aoRolar, { passive: true })
        limpar.push(() => {
          window.removeEventListener('scroll', aoRolar)
          if (pedido !== null) cancelAnimationFrame(pedido)
        })
      }
    }

    return () => limpar.forEach((fn) => fn())
  }, [])

  // CTA "/signup" e "/login" pelo router (sem reload); ancoras "#" seguem nativas.
  const aoClicar = (e: React.MouseEvent<HTMLDivElement>) => {
    const alvo = (e.target as HTMLElement).closest('a')
    if (!alvo) return
    const href = alvo.getAttribute('href') || ''
    if (href.startsWith('/')) {
      e.preventDefault()
      navigate(href)
    }
  }

  return (
    <div ref={raiz} onClick={aoClicar}>
      <style dangerouslySetInnerHTML={{ __html: DESIGN_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  )
}

export function Abertura() {
  return <PaginaDesign html={DESIGN_HTML} />
}

export default function Signup() {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) {
      toast.error('A senha deve ter no mínimo 8 caracteres.')
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, name)
    if (error) {
      toast.error(getErrorMessage(error))
    } else {
      // O "/" cai no ProtectedRoute, que mostra a tela "Confirme seu e-mail".
      // O toast antecipa o próximo passo para não parecer erro.
      toast.success('Conta criada! Enviamos um e-mail de confirmação: é só clicar no link.')
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <Card className="w-full max-w-md shadow-elevation border-0 md:border md:border-border/60 animate-fade-in-up">
      <CardHeader className="space-y-1 pb-8 text-center">
        <div className="flex justify-center mb-2">
          <FileText className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-2xl font-semibold tracking-tight text-primary">
          Criar Conta
        </CardTitle>
        <CardDescription>
          Cadastre-se para gerar documentos. Você recebe um e-mail de confirmação e o acesso libera
          na hora.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full h-11 text-base font-medium">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Criando...
              </>
            ) : (
              'Cadastrar'
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Faça login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
