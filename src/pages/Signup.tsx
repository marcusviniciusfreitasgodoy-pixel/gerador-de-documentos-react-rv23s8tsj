import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, FileText } from 'lucide-react'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getErrorMessage } from '@/lib/pocketbase/errors'

// ─────────────────────────────────────────────────────────────────────────────
// PORTA DE ENTRADA (pagina de abertura) — REVISAO DE AGOSTO/2026
//
// Quem chega em www.documentos.primecircle.app.br sem conta ve o componente
// `Abertura`; o ProtectedRoute o mostra na rota "/" quando nao ha sessao, e o
// Layout suprime o proprio cabecalho/rodape nessa rota (a Abertura traz os seus).
// Logado, "/" segue mostrando o hub de documentos, intacto.
//
// O QUE MUDOU NESTA REVISAO (e por que):
//
// 1. HERO ENXUTO. Acima da dobra ficaram cinco elementos: eyebrow, titulo,
//    subtitulo, UM botao de ouro e a arte. O par "Gerar / Validar" desceu para o
//    § 02 (onde explica, em vez de competir) e a fileira de chips mono saiu,
//    porque a linha sob o botao ja diz "gratis nesta fase, sem cartao".
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

// RESPONSIVIDADE (revisao mobile): abaixo de 900 px os links do menu e o botao
// do cabecalho saem (a barra fixa inferior ja leva Entrar e Criar conta, e os dois
// juntos ficavam apertados e duplicados) e a barra cai para 60 px; abaixo de
// 620 px a arte do hero sai, senao ela empurraria o CTA para fora da primeira
// tela. Todas as grades usam auto-fit com minimo em px, entao viram coluna unica
// sozinhas, sem media query. body com overflow-x hidden por causa da etiqueta
// "Pronto em Word", que fica deslocada para fora do cartao.

const DESIGN_CSS = `html { scroll-behavior: smooth; }
body { margin: 0; background: #F7F3EA; color: #0E0E0E; font-family: Manrope, system-ui, sans-serif; font-weight: 300; -webkit-font-smoothing: antialiased; overflow-x: hidden; }
* { box-sizing: border-box; }
p { text-wrap: pretty; }
h1, h2, h3 { text-wrap: balance; }
a { color: #7a6435; text-decoration: none; }
a:hover { color: #0E0E0E; }
a:focus-visible, button:focus-visible, summary:focus-visible { outline: 2px solid #C9A84C; outline-offset: 3px; }
@keyframes pcSubir { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes pcRegua { from { transform: scaleX(0); } to { transform: scaleX(1); } }
[data-cta-fixo] { display: none; }
@media (max-width: 900px) {
  [data-cta-fixo] { display: flex; }
  /* No celular a barra fixa ja leva Entrar e Criar conta: os links do menu e o
     botao do cabecalho sairiam apertados e duplicados. Fica so a marca. */
  [data-nav-links], [data-nav-cta] { display: none !important; }
  [data-header-inner] { height: 60px !important; }
}
@media (max-width: 620px) {
  /* A arte do hero e decorativa: no celular ela empurraria o CTA para baixo da
     dobra. O documento continua sendo mostrado na secao da prova. */
  [data-hero-art] { display: none !important; }
}
@media (min-width: 901px) { footer { padding-bottom: 0 !important; } }
@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; } }`

const DESIGN_HTML = `<div style="background:#F7F3EA">

  <header data-header style="position:sticky;top:0;z-index:50;background:#0E0E0E;border-bottom:1px solid rgba(245,241,230,.10);transition:height 220ms cubic-bezier(.22,.61,.36,1)">
    <div data-header-inner style="max-width:1120px;margin:0 auto;padding:0 clamp(20px,5vw,60px);height:72px;display:flex;align-items:center;justify-content:space-between;gap:20px;transition:height 220ms cubic-bezier(.22,.61,.36,1)">
      <a href="#topo" style="display:flex;align-items:center;gap:11px;color:#F5F1E6;flex:none">
        <svg viewBox="0 0 100 100" role="img" aria-label="Prime Circle" style="width:30px;height:30px;flex:none"><circle cx="36" cy="50" r="30" stroke="#C9A84C" stroke-width="4" fill="none"></circle><circle cx="64" cy="50" r="30" stroke="#F5F1E6" stroke-width="4" fill="none"></circle><circle cx="50" cy="50" r="4" fill="#C9A84C"></circle></svg>
        <span style="display:flex;flex-direction:column;line-height:1">
          <span style="font-size:15px;font-weight:700;letter-spacing:-.01em;color:#F5F1E6">Prime Circle</span>
          <span data-header-sub style="font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.34em;text-transform:uppercase;color:#C9A84C;margin-top:5px;transition:opacity 200ms cubic-bezier(.22,.61,.36,1),max-height 200ms cubic-bezier(.22,.61,.36,1);overflow:hidden;max-height:14px">Documentos</span>
        </span>
      </a>
      <nav style="display:flex;align-items:center;gap:clamp(12px,2vw,26px);overflow-x:auto;scrollbar-width:none">
        <a data-nav-links href="#preco" style="flex:none;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(232,224,204,.72);transition:color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#F5F1E6">Preço</a>
        <a data-nav-links href="#funciona" style="flex:none;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(232,224,204,.72);transition:color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#F5F1E6">Como funciona</a>
        <a data-nav-links href="#documentos" style="flex:none;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(232,224,204,.72);transition:color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#F5F1E6">Documentos</a>
        <a data-nav-links href="#validador" style="flex:none;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(232,224,204,.72);transition:color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#F5F1E6">Validador</a>
        <a data-nav-links href="/login" style="flex:none;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(232,224,204,.72);transition:color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#F5F1E6">Entrar</a>
        <a data-nav-cta href="/signup" style="flex:none;display:inline-flex;align-items:center;height:40px;padding:0 22px;border-radius:999px;background:#C9A84C;color:#0E0E0E;font-size:13px;font-weight:600;transition:background 200ms cubic-bezier(.22,.61,.36,1)" style-hover="background:#F5F1E6">Criar conta grátis</a>
      </nav>
    </div>
  </header>

  <section id="topo" style="background:#0E0E0E;color:#F5F1E6;overflow:hidden">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(64px,10vw,116px) clamp(20px,5vw,60px) clamp(72px,11vw,124px);display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:clamp(36px,5vw,64px);align-items:center">
      <div style="min-width:0">
        <p style="margin:0 0 10px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#C9A84C;opacity:0;animation:pcSubir 560ms cubic-bezier(.22,.61,.36,1) 60ms both">Para corretores e imobiliárias</p>
        <div style="width:56px;height:1px;background:rgba(201,168,76,.6);transform-origin:left;margin-bottom:26px;animation:pcRegua 520ms cubic-bezier(.22,.61,.36,1) 200ms both"></div>
        <h1 style="margin:0;max-width:17ch;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(38px,4.8vw,58px);line-height:1.04;letter-spacing:-.02em;color:#F5F1E6;opacity:0;animation:pcSubir 700ms cubic-bezier(.22,.61,.36,1) 280ms both">
          Todo negócio termina em documento. <em style="font-style:italic;color:#C9A84C">O seu não devia terminar em improviso.</em>
        </h1>
        <p style="margin:26px 0 0;max-width:500px;font-size:clamp(15.5px,1.4vw,17px);line-height:1.7;color:rgba(232,224,204,.80);opacity:0;animation:pcSubir 700ms cubic-bezier(.22,.61,.36,1) 400ms both">
          Você apresenta um contrato à altura do negócio, fundamentado no Código Civil, com segurança para todas as partes. Cadastre uma vez e gere na hora, sem esperar por ninguém.
        </p>
        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:22px;margin-top:34px;opacity:0;animation:pcSubir 700ms cubic-bezier(.22,.61,.36,1) 520ms both">
          <a href="/signup" style="display:inline-flex;align-items:center;height:54px;padding:0 32px;border-radius:999px;background:#C9A84C;color:#0E0E0E;font-size:15px;font-weight:600;transition:background 200ms cubic-bezier(.22,.61,.36,1),transform 200ms cubic-bezier(.22,.61,.36,1)" style-hover="background:#F5F1E6;transform:translateY(-1px)">Criar conta e gerar meu primeiro documento</a>
          <a href="#documentos" style="font-size:15px;color:#F5F1E6;border-bottom:1px solid rgba(201,168,76,.5);padding-bottom:2px;transition:border-color 180ms cubic-bezier(.22,.61,.36,1),color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#C9A84C;border-bottom-color:#C9A84C">Ver os 16 documentos</a>
        </div>
        <p style="margin:18px 0 0;font-size:13px;line-height:1.6;color:rgba(232,224,204,.55);opacity:0;animation:pcSubir 700ms cubic-bezier(.22,.61,.36,1) 620ms both">Grátis nesta fase, sem cartão. Você confirma o e-mail e entra: ninguém precisa aprovar nada.</p>
      </div>

      <div data-hero-art style="position:relative;min-width:0;opacity:0;animation:pcSubir 800ms cubic-bezier(.22,.61,.36,1) 700ms both">
        <div data-parallax="-4" style="background:#FDFBF6;padding:clamp(22px,3vw,34px);box-shadow:0 40px 90px -24px rgba(0,0,0,.85);will-change:transform">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:14px;border-bottom:1px solid #E8E0CC">
            <span style="font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">Prime Circle · Documentos</span>
            <span style="font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.16em;color:#6B645B">.DOCX</span>
          </div>
          <p style="margin:22px 0 6px;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,26px);font-weight:500;line-height:1.2;color:#0E0E0E;text-align:center">Promessa de Compra e Venda</p>
          <p style="margin:0 0 24px;font-family:'JetBrains Mono',monospace;font-size:8.5px;letter-spacing:.2em;text-transform:uppercase;color:#6B645B;text-align:center">Modalidade financiada</p>
          <div style="display:flex;flex-direction:column;gap:9px">
            <div style="height:6px;background:#EFE8D7"></div>
            <div style="height:6px;background:#EFE8D7;width:94%"></div>
            <div style="height:6px;background:#E8E0CC;width:48%"></div>
            <div style="height:6px;background:#EFE8D7"></div>
            <div style="height:6px;background:#EFE8D7;width:76%"></div>
            <div style="height:6px;background:#E8E0CC;width:62%"></div>
          </div>
          <div style="display:flex;gap:18px;margin-top:30px">
            <div style="flex:1"><div style="height:1px;background:#0E0E0E"></div><p style="margin:7px 0 0;font-family:'JetBrains Mono',monospace;font-size:7.5px;letter-spacing:.14em;text-transform:uppercase;color:#6B645B">Vendedor</p></div>
            <div style="flex:1"><div style="height:1px;background:#0E0E0E"></div><p style="margin:7px 0 0;font-family:'JetBrains Mono',monospace;font-size:7.5px;letter-spacing:.14em;text-transform:uppercase;color:#6B645B">Comprador</p></div>
          </div>
        </div>
        <div data-parallax="5" style="position:absolute;right:-6px;bottom:-22px;display:flex;align-items:center;background:#C9A84C;color:#0E0E0E;padding:11px 18px;box-shadow:0 14px 34px -10px rgba(0,0,0,.7);will-change:transform">
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
        <p style="margin:10px 0 0;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;color:rgba(232,224,204,.6)">fases da operação cobertas</p>
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
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">Você não tem departamento jurídico. Então ou usa um modelo de origem incerta, ou paga honorários toda vez que precisa de um contrato que já é rotina na sua carreira. Sai do mesmo bolso de onde vem a comissão.</p>
        </div>
        <div data-card style="background:#FDFBF6;padding:32px 28px;border-top:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1),transform 180ms cubic-bezier(.22,.61,.36,1)">
          <p style="margin:0 0 14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:#C9A84C">02</p>
          <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;letter-spacing:.01em;color:#0E0E0E">O modelo que circula no grupo</h3>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">Um arquivo de origem incerta, trocado de mão em mão. Você substitui os nomes e torce para não ter sobrado nada do negócio anterior no meio do texto.</p>
        </div>
        <div data-card style="background:#FDFBF6;padding:32px 28px;border-top:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1),transform 180ms cubic-bezier(.22,.61,.36,1)">
          <p style="margin:0 0 14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:#C9A84C">03</p>
          <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;letter-spacing:.01em;color:#0E0E0E">Os mesmos dados, cinco vezes</h3>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">Nome, RG, CPF, estado civil, matrícula, comarca. Redigitados a cada documento da mesma operação, com uma chance nova de erro em cada um.</p>
        </div>
        <div data-card style="background:#FDFBF6;padding:32px 28px;border-top:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1),transform 180ms cubic-bezier(.22,.61,.36,1)">
          <p style="margin:0 0 14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:#C9A84C">04</p>
          <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;letter-spacing:.01em;color:#0E0E0E">A minuta que chegou pronta</h3>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">O outro lado mandou o contrato e quer resposta hoje. Ou você paga alguém para ler a tempo, ou assina sem saber, com segurança, o que está escrito ali dentro.</p>
        </div>
        <div data-card style="background:#FDFBF6;padding:32px 28px;border-top:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1),transform 180ms cubic-bezier(.22,.61,.36,1)">
          <p style="margin:0 0 14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:#C9A84C">05</p>
          <h3 style="margin:0 0 12px;font-size:16px;font-weight:600;letter-spacing:.01em;color:#0E0E0E">A comissão no fio do combinado</h3>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">Sem contrato de corretagem assinado, a sua remuneração depende da memória das partes. O Código Civil protege o corretor, mas só quem tem documento consegue provar.</p>
        </div>
        <a href="/signup" data-card style="display:flex;flex-direction:column;justify-content:center;background:#0E0E0E;padding:32px 28px;color:#F5F1E6;border-top:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1),transform 180ms cubic-bezier(.22,.61,.36,1)">
          <p style="margin:0 0 14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;color:#C9A84C">→</p>
          <h3 style="margin:0 0 12px;font-family:'Cormorant Garamond',Georgia,serif;font-size:26px;font-weight:500;line-height:1.15;letter-spacing:-.01em;color:#F5F1E6">E se nada disso fosse assim?</h3>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:rgba(232,224,204,.75)">Crie a conta e gere o próximo contrato aqui. Grátis nesta fase, sem cartão.</p>
        </a>
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

      <div data-anim style="margin-top:clamp(48px,6vw,72px);border:1px solid #DDD5C7;background:#FDFBF6;padding:clamp(30px,4vw,52px)">
        <p style="margin:0 0 16px;display:flex;align-items:center;gap:12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#8B7340">O dossiê do negócio<span style="display:block;width:40px;height:1px;background:rgba(201,168,76,.5)"></span></p>
        <h3 style="margin:0;max-width:840px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(26px,3.2vw,40px);line-height:1.1;letter-spacing:-.02em;color:#0E0E0E">Modelo de contrato qualquer um tem. <em style="font-style:italic;color:#7a6435">O dossiê é a diferença.</em></h3>
        <p style="margin:22px 0 0;max-width:660px;font-size:15.5px;line-height:1.75;color:#5A544C">Uma pasta de modelos obriga você a redigitar as mesmas partes e o mesmo imóvel em cada documento, com uma chance nova de erro em cada um. Aqui a operação é cadastrada uma vez e todos os documentos daquele negócio bebem dela.</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1px;background:#DDD5C7;margin-top:34px;border:1px solid #DDD5C7">
          <div style="background:#FDFBF6;padding:26px 24px">
            <h4 style="margin:0 0 10px;font-size:15px;font-weight:600;color:#0E0E0E">Cadastrou uma vez</h4>
            <p style="margin:0;font-size:14px;line-height:1.68;color:#5A544C">Partes, imóvel, valores e prazos ficam guardados no negócio, e não presos dentro de um documento.</p>
          </div>
          <div style="background:#FDFBF6;padding:26px 24px">
            <h4 style="margin:0 0 10px;font-size:15px;font-weight:600;color:#0E0E0E">Vale para os dezesseis</h4>
            <p style="margin:0;font-size:14px;line-height:1.68;color:#5A544C">Qualquer documento daquela operação abre já preenchido a partir do dossiê, do recibo de sinal ao distrato.</p>
          </div>
          <div style="background:#FDFBF6;padding:26px 24px">
            <h4 style="margin:0 0 10px;font-size:15px;font-weight:600;color:#0E0E0E">Corrigiu num, corrigiu em todos</h4>
            <p style="margin:0;font-size:14px;line-height:1.68;color:#5A544C">O ajuste que você faz volta para o dossiê, e o próximo documento já nasce com ele.</p>
          </div>
        </div>
      </div>

      <div data-anim style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1px;background:#DDD5C7;border:1px solid #DDD5C7;margin-top:clamp(40px,5vw,64px)">
        <div style="background:#FDFBF6;padding:30px 28px">
          <h3 style="margin:0 0 12px;font-size:17px;font-weight:600;color:#0E0E0E">O negócio mudou? O documento acompanha.</h3>
          <p style="margin:0;font-size:15px;line-height:1.75;color:#5A544C">O financiamento não saiu e virou recurso próprio. A parcela única virou três. A posse mudou de data. Você troca o documento sem redigitar uma linha, porque as partes e o imóvel continuam no dossiê.</p>
        </div>
        <div style="background:#FDFBF6;padding:30px 28px">
          <h3 style="margin:0 0 12px;font-size:17px;font-weight:600;color:#0E0E0E">Faltou um dado? Salva assim mesmo.</h3>
          <p style="margin:0;font-size:15px;line-height:1.75;color:#5A544C">A certidão sai amanhã, o estado civil ainda está em confirmação, o PIX vem depois. O negócio fica salvo pela metade e você volta nele quando o dado chegar.</p>
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
      <p data-anim style="margin:22px 0 0;max-width:600px;font-size:16px;line-height:1.75;color:#5A544C">Cada modelo é redigido para a operação brasileira, com a fundamentação do Código Civil e a cláusula de corretagem já no lugar. E nenhum deles começa em branco: todos bebem do dossiê do negócio.</p>

      <div data-anim style="margin-top:56px;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1px;background:#DDD5C7;border:1px solid #DDD5C7">
        <div style="background:#FDFBF6;padding:clamp(28px,3.4vw,40px)">
          <p style="margin:0 0 20px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">Captação e pré-contrato</p>
          <h3 style="margin:0 0 12px;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(24px,2.6vw,30px);font-weight:500;line-height:1.15;color:#0E0E0E">Autorização de Venda</h3>
          <p style="margin:0;font-size:15px;line-height:1.72;color:#5A544C">O primeiro passo: o proprietário autoriza você a anunciar e vender o imóvel dele. Pode ser exclusiva ou não, e já define a sua comissão e o prazo.</p>
        </div>
        <div style="background:#FDFBF6;display:flex;flex-direction:column">
          <div data-card style="padding:20px 24px;border-bottom:1px dashed #DDD5C7;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Proposta e Reserva</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Registra a oferta do comprador e segura o imóvel antes da promessa.</p>
          </div>
          <div data-card style="padding:20px 24px;border-bottom:1px dashed #DDD5C7;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Recibo de Sinal</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Comprova a entrada e define as arras, com a consequência de cada natureza na tela.</p>
          </div>
          <div data-card style="padding:20px 24px;border-bottom:1px dashed #DDD5C7;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Contrato de Corretagem</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Fixa percentual, vencimento e exclusividade da sua remuneração.</p>
          </div>
          <div data-card style="padding:20px 24px;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Checklist Documental</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">A conferência das certidões antes de o cartório apontar o que falta.</p>
          </div>
        </div>
      </div>

      <div data-anim style="margin-top:40px;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1px;background:#DDD5C7;border:1px solid #DDD5C7">
        <div style="background:#FDFBF6;padding:clamp(28px,3.4vw,40px)">
          <p style="margin:0 0 20px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">Promessas de compra e venda</p>
          <h3 style="margin:0 0 12px;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(24px,2.6vw,30px);font-weight:500;line-height:1.15;color:#0E0E0E">Promessa financiada</h3>
          <p style="margin:0;font-size:15px;line-height:1.72;color:#5A544C">O comprador paga parte com recursos próprios e o restante com financiamento bancário. A promessa acompanha o processo até o banco liberar o valor. É o núcleo do negócio, e são seis variações dela.</p>
        </div>
        <div style="background:#FDFBF6;display:flex;flex-direction:column">
          <div data-card style="padding:18px 24px;border-bottom:1px dashed #DDD5C7;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">À vista</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Recursos próprios, sem banco. Sinal, reforço e saldo.</p>
          </div>
          <div data-card style="padding:18px 24px;border-bottom:1px dashed #DDD5C7;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Com FGTS</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Uso do saldo do fundo, sem financiamento bancário.</p>
          </div>
          <div data-card style="padding:18px 24px;border-bottom:1px dashed #DDD5C7;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Com dação em pagamento</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Parte do preço paga com outro bem, avaliado no contrato.</p>
          </div>
          <div data-card style="padding:18px 24px;border-bottom:1px dashed #DDD5C7;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Simplificada</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Versão enxuta, para o negócio direto que não pede tudo.</p>
          </div>
          <div data-card style="padding:18px 24px;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Permuta</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Troca de imóveis, com a torna calculada quando há diferença.</p>
          </div>
        </div>
      </div>

      <div data-anim style="margin-top:40px;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1px;background:#DDD5C7;border:1px solid #DDD5C7">
        <div style="background:#FDFBF6;padding:clamp(28px,3.4vw,40px)">
          <p style="margin:0 0 20px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">Execução e encerramento</p>
          <h3 style="margin:0 0 12px;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(24px,2.6vw,30px);font-weight:500;line-height:1.15;color:#0E0E0E">Entrega de Chaves e Posse</h3>
          <p style="margin:0;font-size:15px;line-height:1.72;color:#5A544C">O caso mais comum: o comprador quitou, recebe as chaves e assume o imóvel na mesma data. Um documento só, com a relação de chaves, a leitura dos medidores e a autorização de mudança.</p>
        </div>
        <div style="background:#FDFBF6;display:flex;flex-direction:column">
          <div data-card style="padding:20px 24px;border-bottom:1px dashed #DDD5C7;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Entrega das Chaves</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Só a entrega física das chaves, quando a posse ainda não passa.</p>
          </div>
          <div data-card style="padding:20px 24px;border-bottom:1px dashed #DDD5C7;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Transmissão da Posse</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Passa a posse ao comprador, quando as chaves já foram entregues antes.</p>
          </div>
          <div data-card style="padding:20px 24px;border-bottom:1px dashed #DDD5C7;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Recibo de Comissão</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Quitação por parcela recebida, amarrada ao negócio que a gerou.</p>
          </div>
          <div data-card style="padding:20px 24px;border-left:2px solid transparent;transition:background 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)">
            <h4 style="margin:0 0 4px;font-size:14.5px;font-weight:600;color:#0E0E0E">Distrato</h4>
            <p style="margin:0;font-size:13.5px;line-height:1.6;color:#5A544C">Encerra o contrato de comum acordo, com quitação recíproca.</p>
          </div>
        </div>
      </div>

      <p data-anim style="margin:clamp(36px,4vw,52px) 0 0;font-size:15.5px;line-height:1.75;color:#5A544C">Faltou o documento que você usa? <a href="/signup" style="color:#7a6435;border-bottom:1px solid rgba(122,100,53,.4)">Diga qual, que ele entra.</a></p>
    </div>
  </section>

  <section style="background:#F3EBE0;border-top:1px solid #DDD5C7">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">A prova está no documento</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:30px"></div>
      <h2 data-anim style="margin:0;max-width:820px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(32px,4.4vw,52px);line-height:1.06;letter-spacing:-.02em;color:#0E0E0E">O documento é a primeira coisa que o cliente <em style="font-style:italic;color:#7a6435">vê do seu trabalho.</em></h2>
      <p data-anim style="margin:26px 0 0;max-width:660px;font-size:16px;line-height:1.78;color:#5A544C">Ninguém avalia um corretor pelo esforço que ele teve para fechar. Avalia pelo que chega à mesa. O contrato que abre certo, com a qualificação completa das partes, a cláusula que responde à dúvida antes de ela ser feita e o prazo que não precisa ser explicado dizem, sem você falar nada, que ali tem método.</p>

      <div data-anim style="margin-top:44px;background:#FDFBF6;border:1px solid #DDD5C7;padding:clamp(26px,3.6vw,48px)">
        <p style="margin:0 0 18px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">Cláusula 4ª · natureza das arras</p>
        <p style="margin:0;max-width:64ch;font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,26px);line-height:1.5;color:#0E0E0E">As arras ora pagas têm natureza confirmatória, na forma dos artigos 417 a 419 do Código Civil, imputando-se ao preço em caso de conclusão do negócio.</p>
        <p style="margin:22px 0 0;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.16em;text-transform:uppercase;color:#6B645B">Recibo de sinal · saída em .docx</p>
      </div>

      <div data-anim style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1px;background:#DDD5C7;margin-top:40px;border:1px solid #DDD5C7">
        <div style="background:#FDFBF6;padding:26px 24px">
          <h3 style="margin:0 0 8px;font-size:15px;font-weight:600;color:#0E0E0E">Chega pronto</h3>
          <p style="margin:0;font-size:14px;line-height:1.68;color:#5A544C">O cliente não espera você redigitar dados que ele já forneceu. O documento sai com tudo no lugar, na mesma conversa.</p>
        </div>
        <div style="background:#FDFBF6;padding:26px 24px">
          <h3 style="margin:0 0 8px;font-size:15px;font-weight:600;color:#0E0E0E">Escrito para o caso</h3>
          <p style="margin:0;font-size:14px;line-height:1.68;color:#5A544C">Cláusula fundamentada no Código Civil, não texto emprestado de outro negócio com o nome trocado.</p>
        </div>
        <div style="background:#FDFBF6;padding:26px 24px">
          <h3 style="margin:0 0 8px;font-size:15px;font-weight:600;color:#0E0E0E">Sem ponta solta</h3>
          <p style="margin:0;font-size:14px;line-height:1.68;color:#5A544C">O que costuma virar discussão depois, como a natureza das arras ou o prazo da escritura, já está resolvido no papel.</p>
        </div>
      </div>

      <div data-anim style="margin-top:40px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:clamp(24px,3.5vw,48px);align-items:start">
        <div>
          <p style="margin:0 0 10px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:.28em;text-transform:uppercase;color:#8B7340">Quem escreveu</p>
          <p style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:500;line-height:1.25;letter-spacing:-.01em;color:#0E0E0E">Prime Circle</p>
          <p style="margin:8px 0 0;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:#7a6435">CNPJ 58.409.058/0001-73</p>
        </div>
        <p style="margin:0;font-size:15.5px;line-height:1.78;color:#5A544C">Cada modelo aqui existe porque precisou existir em uma negociação de verdade. As cláusulas vieram do que faltou em contratos anteriores, os prazos vieram do que deu problema e as conferências vieram do que o cartório apontou na hora errada. Por isso a plataforma não pergunta o que um sistema acharia importante. Ela pergunta o que o negócio exige para sair do papel.</p>
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
        <p style="margin:0;font-size:16px;line-height:1.78;color:#5A544C">Toda negociação tem alguma particularidade que foge do padrão: a herança que ainda não foi partilhada, o vendedor que mora fora, a cláusula que o comprador exige e você nunca viu. Nessa hora o corretor autônomo costuma ficar sozinho, ou procurar às pressas alguém que atenda no mesmo dia.<br><br>Aqui a dúvida tem dois caminhos, e você escolhe pelo tamanho dela. <strong style="font-weight:600;color:#0E0E0E">No primeiro nível</strong>, um agente especializado responde na hora, ancorado na base jurídica da plataforma: serve para a dúvida conceitual que trava a próxima linha do contrato. <strong style="font-weight:600;color:#0E0E0E">No segundo</strong>, quando o caso foge do padrão, o pedido vai para um profissional experiente, com o negócio já anexado. Sem sair da operação, sem recomeçar a explicação do zero.</p>
        <div style="display:flex;flex-direction:column;gap:1px;background:#DDD5C7;border:1px solid #DDD5C7">
          <div style="background:#FDFBF6;padding:24px"><h3 style="margin:0 0 8px;font-size:15px;font-weight:600;color:#0E0E0E">O caso vai junto com o negócio</h3><p style="margin:0;font-size:14px;line-height:1.68;color:#5A544C">As partes, o imóvel e os valores já cadastrados seguem anexados ao pedido. Você descreve a dúvida, não a operação inteira.</p></div>
          <div style="background:#FDFBF6;padding:24px"><h3 style="margin:0 0 8px;font-size:15px;font-weight:600;color:#0E0E0E">A conversa fica registrada</h3><p style="margin:0;font-size:14px;line-height:1.68;color:#5A544C">O pedido e a resposta ficam guardados junto do negócio, e não perdidos num aplicativo de mensagem.</p></div>
          <div style="background:#0E0E0E;padding:24px"><h3 style="margin:0 0 8px;font-size:15px;font-weight:600;color:#F5F1E6">Isto não substitui o seu advogado</h3><p style="margin:0;font-size:14px;line-height:1.68;color:rgba(232,224,204,.75)">É apoio para decidir o próximo passo. A análise jurídica do caso concreto continua sendo caminho, e a plataforma não a dispensa.</p></div>
        </div>
      </div>
    </div>
  </section>

  <section style="background:#F3EBE0;border-top:1px solid #DDD5C7">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">§ 05 · Para imobiliárias</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:30px"></div>
      <h2 data-anim style="margin:0;max-width:740px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(32px,4.4vw,52px);line-height:1.06;letter-spacing:-.02em;color:#0E0E0E">
        Dez corretores, dez modelos de contrato diferentes. <em style="font-style:italic;color:#7a6435">Até aqui.</em>
      </h2>
      <div data-anim style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:clamp(26px,3.5vw,48px);margin-top:52px">
        <div style="border-top:1px solid #C9A84C;padding-top:22px">
          <h3 style="margin:0 0 10px;font-size:16px;font-weight:600;color:#0E0E0E">Uma redação só na equipe</h3>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">Todo mundo parte do mesmo modelo. O que sai com a marca da imobiliária tem sempre o mesmo padrão de cláusula.</p>
        </div>
        <div style="border-top:1px solid #C9A84C;padding-top:22px">
          <h3 style="margin:0 0 10px;font-size:16px;font-weight:600;color:#0E0E0E">A régua jurídica é sua</h3>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">A base que a validação usa fica sob controle do administrador da conta. O critério de revisão é o da casa, não o de um modelo genérico.</p>
        </div>
        <div style="border-top:1px solid #C9A84C;padding-top:22px">
          <h3 style="margin:0 0 10px;font-size:16px;font-weight:600;color:#0E0E0E">Apoio de especialista</h3>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">Quando o caso sai do padrão, o corretor abre um pedido de análise dentro da própria plataforma, sem sair da operação.</p>
        </div>
        <div style="border-top:1px solid #C9A84C;padding-top:22px">
          <h3 style="margin:0 0 10px;font-size:16px;font-weight:600;color:#0E0E0E">Dados tratados com regra</h3>
          <p style="margin:0;font-size:14.5px;line-height:1.72;color:#5A544C">CPF, RG e endereço de clientes ficam restritos ao dono do registro. Os registros de validação são expurgados em 30 dias, por compromisso de LGPD.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="preco" style="background:#0E0E0E;color:#F5F1E6;border-top:1px solid rgba(245,241,230,.10)">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px);display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:clamp(36px,5vw,64px);align-items:center">
      <div data-anim>
        <p style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#C9A84C">§ 06 · Preço</p>
        <div style="width:44px;height:1px;background:rgba(201,168,76,.5);margin-bottom:30px"></div>
        <h2 style="margin:0;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(40px,5.6vw,68px);line-height:1.02;letter-spacing:-.02em;color:#F5F1E6">Grátis <em style="font-style:italic;color:#C9A84C">nesta fase.</em></h2>
        <p style="margin:24px 0 0;max-width:520px;font-size:16px;line-height:1.78;color:rgba(232,224,204,.78)">A plataforma inteira liberada, sem cartão de crédito e sem limite de documentos. Quando houver preço, você será avisado com antecedência e decide se continua. Nada é cobrado sem que você saiba antes.</p>
        <div style="display:flex;flex-wrap:wrap;gap:20px;align-items:center;margin-top:32px">
          <a href="/signup" style="display:inline-flex;align-items:center;height:52px;padding:0 32px;border-radius:999px;background:#C9A84C;color:#0E0E0E;font-size:15px;font-weight:600;transition:background 200ms cubic-bezier(.22,.61,.36,1),transform 200ms cubic-bezier(.22,.61,.36,1)" style-hover="background:#F5F1E6;transform:translateY(-1px)">Criar conta grátis</a>
          <a href="#perguntas" style="font-size:15px;color:#F5F1E6;border-bottom:1px solid rgba(201,168,76,.5);padding-bottom:2px;transition:color 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#C9A84C;border-bottom-color:#C9A84C">Ler as perguntas frequentes</a>
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
          <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:rgba(232,224,204,.55)">Em troca</span>
          <span style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:19px;color:#F5F1E6">você diz o que faltou</span>
        </div>
      </div>
    </div>
  </section>

  <section id="perguntas" style="background:#F7F3EA">
    <div style="max-width:900px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">§ 07 · Perguntas</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:40px"></div>
      <div data-anim style="border-top:1px solid #DDD5C7">

        <div data-faq data-faq-aberto style="border-bottom:1px solid #DDD5C7">
          <button type="button" data-faq-botao style="display:flex;width:100%;align-items:baseline;justify-content:space-between;gap:20px;background:none;border:0;padding:24px 0;text-align:left;cursor:pointer;font-family:inherit">
            <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,24px);font-weight:500;color:#0E0E0E">Quanto custa?</span>
            <span data-faq-sinal style="flex:none;font-family:'JetBrains Mono',monospace;font-size:16px;color:#8B7340;transition:transform 200ms cubic-bezier(.22,.61,.36,1)">+</span>
          </button>
          <div data-faq-corpo style="overflow:hidden;transition:max-height 220ms cubic-bezier(.22,.61,.36,1),opacity 200ms cubic-bezier(.22,.61,.36,1)">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#5A544C">Nesta fase, nada. O cadastro está aberto, a plataforma inteira liberada e não pedimos cartão de crédito. Quando houver preço, você será avisado com antecedência e decide se continua; nada é cobrado sem que você saiba antes. O que pedimos em troca nesta fase é que você diga o que faltou.</p>
          </div>
        </div>

        <div data-faq style="border-bottom:1px solid #DDD5C7">
          <button type="button" data-faq-botao style="display:flex;width:100%;align-items:baseline;justify-content:space-between;gap:20px;background:none;border:0;padding:24px 0;text-align:left;cursor:pointer;font-family:inherit">
            <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,24px);font-weight:500;color:#0E0E0E">Como é o cadastro? Quanto tempo até o primeiro documento?</span>
            <span data-faq-sinal style="flex:none;font-family:'JetBrains Mono',monospace;font-size:16px;color:#8B7340;transition:transform 200ms cubic-bezier(.22,.61,.36,1)">+</span>
          </button>
          <div data-faq-corpo style="overflow:hidden;transition:max-height 220ms cubic-bezier(.22,.61,.36,1),opacity 200ms cubic-bezier(.22,.61,.36,1)">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#5A544C">Não há aprovação nem fila de espera. Você informa nome, e-mail e senha, clica no link de confirmação que chega no seu e-mail e o acesso abre na hora. O CRECI e o percentual de comissão ficam para depois, no perfil, e passam a entrar sozinhos na cláusula de corretagem de tudo que você gerar. Não há instalação, não há treinamento e não há migração de nada: com os dados do negócio à mão, o primeiro documento sai na mesma sessão.</p>
          </div>
        </div>

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

        <div data-faq style="border-bottom:1px solid #DDD5C7">
          <button type="button" data-faq-botao style="display:flex;width:100%;align-items:baseline;justify-content:space-between;gap:20px;background:none;border:0;padding:24px 0;text-align:left;cursor:pointer;font-family:inherit">
            <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,24px);font-weight:500;color:#0E0E0E">Isso substitui o advogado?</span>
            <span data-faq-sinal style="flex:none;font-family:'JetBrains Mono',monospace;font-size:16px;color:#8B7340;transition:transform 200ms cubic-bezier(.22,.61,.36,1)">+</span>
          </button>
          <div data-faq-corpo style="overflow:hidden;transition:max-height 220ms cubic-bezier(.22,.61,.36,1),opacity 200ms cubic-bezier(.22,.61,.36,1)">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#5A544C">Não, e não é essa a proposta. O que sai daqui é o documento de rotina da intermediação, redigido com fundamentação no Código Civil, que você deixa de terceirizar a cada negócio. Quando a operação foge do padrão, você leva o caso ao Especialista sem sair da plataforma, e a análise de um advogado continua sendo o caminho. A ideia não é tirar o advogado da operação, é tirar ele da papelada repetitiva.</p>
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
            <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,24px);font-weight:500;color:#0E0E0E">Os documentos têm validade jurídica?</span>
            <span data-faq-sinal style="flex:none;font-family:'JetBrains Mono',monospace;font-size:16px;color:#8B7340;transition:transform 200ms cubic-bezier(.22,.61,.36,1)">+</span>
          </button>
          <div data-faq-corpo style="overflow:hidden;transition:max-height 220ms cubic-bezier(.22,.61,.36,1),opacity 200ms cubic-bezier(.22,.61,.36,1)">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#5A544C">Os modelos são redigidos com fundamentação no Código Civil e nas práticas da intermediação imobiliária. Como qualquer contrato, a validade depende das partes, do objeto e da forma no caso concreto.</p>
          </div>
        </div>

        <div data-faq style="border-bottom:1px solid #DDD5C7">
          <button type="button" data-faq-botao style="display:flex;width:100%;align-items:baseline;justify-content:space-between;gap:20px;background:none;border:0;padding:24px 0;text-align:left;cursor:pointer;font-family:inherit">
            <span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(20px,2.2vw,24px);font-weight:500;color:#0E0E0E">E os dados dos meus clientes?</span>
            <span data-faq-sinal style="flex:none;font-family:'JetBrains Mono',monospace;font-size:16px;color:#8B7340;transition:transform 200ms cubic-bezier(.22,.61,.36,1)">+</span>
          </button>
          <div data-faq-corpo style="overflow:hidden;transition:max-height 220ms cubic-bezier(.22,.61,.36,1),opacity 200ms cubic-bezier(.22,.61,.36,1)">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.75;color:#5A544C">Cada registro é acessível ao seu dono e a mais ninguém. Os logs da validação de minutas são apagados automaticamente após 30 dias.</p>
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
      <p data-anim style="margin:26px 0 0;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;color:rgba(232,224,204,.72)">Grátis nesta fase. Sem cartão. Sem instalação.</p>
    </div>
  </section>

  <footer style="background:#0E0E0E;border-top:1px solid rgba(245,241,230,.10);color:rgba(232,224,204,.55);padding-bottom:88px">
    <div style="max-width:1120px;margin:0 auto;padding:44px clamp(20px,5vw,60px);display:flex;flex-wrap:wrap;gap:24px;align-items:center;justify-content:space-between">
      <div style="display:flex;align-items:center;gap:11px">
        <svg viewBox="0 0 100 100" role="img" aria-label="Prime Circle" style="width:24px;height:24px;flex:none"><circle cx="36" cy="50" r="30" stroke="#C9A84C" stroke-width="4" fill="none"></circle><circle cx="64" cy="50" r="30" stroke="#F5F1E6" stroke-width="4" fill="none"></circle><circle cx="50" cy="50" r="4" fill="#C9A84C"></circle></svg>
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.26em;text-transform:uppercase;color:rgba(232,224,204,.6)">Prime Circle · Documentos</span>
      </div>
      <p style="margin:0;font-family:'JetBrains Mono',monospace;font-size:10px;line-height:1.9;letter-spacing:.14em;text-transform:uppercase;color:rgba(232,224,204,.5)">Prime Circle<br>CNPJ 58.409.058/0001-73</p>
      <p style="margin:0;max-width:560px;font-size:12.5px;line-height:1.7;color:rgba(232,224,204,.72)">
        A plataforma gera documentos a partir de modelos fundamentados no Código Civil. A conferência final, a adequação ao caso concreto e a validação jurídica permanecem sob responsabilidade do usuário e de sua assessoria.
      </p>
    </div>
  </footer>

  <div data-cta-fixo style="position:fixed;left:0;right:0;bottom:0;z-index:60;background:#0E0E0E;border-top:1px solid rgba(201,168,76,.35);padding:10px 16px calc(10px + env(safe-area-inset-bottom));align-items:center;justify-content:space-between;gap:12px">
    <a href="/login" style="font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:.16em;text-transform:uppercase;color:rgba(232,224,204,.72)">Entrar</a>
    <a href="/signup" style="display:inline-flex;align-items:center;height:44px;padding:0 24px;border-radius:999px;background:#C9A84C;color:#0E0E0E;font-size:14px;font-weight:600">Criar conta grátis</a>
  </div>

</div>`

export function Abertura() {
  const navigate = useNavigate()
  const raiz = useRef<HTMLDivElement>(null)

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
      <div dangerouslySetInnerHTML={{ __html: DESIGN_HTML }} />
    </div>
  )
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
