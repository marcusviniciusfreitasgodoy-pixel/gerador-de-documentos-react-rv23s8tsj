import { PaginaDesign, montarCabecalho, NAV_APOIO, DESIGN_RODAPE } from './Signup'

// ─────────────────────────────────────────────────────────────────────────────
// PAGINAS PUBLICAS DE APOIO (/documentos e /imobiliarias)
//
// Estes dois blocos moravam dentro da abertura, e eram 2.863 px e 979 px de
// rolagem no celular. Os dois respondem a uma pergunta que o visitante so faz
// DEPOIS de se interessar ("quais sao os 16?", "e para a minha equipe?"), e
// pagar esse preco na primeira visita empurrava o preco e o cadastro para baixo
// da 20a tela. Na abertura ficou a chamada curta; o conteudo inteiro esta aqui.
//
// A moldura (cabecalho, rodape, CSS) e a maquinaria (revelacao, hover,
// cabecalho que condensa) vem do Signup.tsx, nao sao copias: cabecalho
// duplicado diverge na terceira edicao e ninguem percebe.
//
// O menu daqui NAO leva ancora de secao (#preco, #funciona): aquelas secoes
// vivem na abertura, e o link seria morto. Leva "Inicio", que volta para la.
//
// Regra de redacao do Marcus: sem travessao no texto visivel.
// ─────────────────────────────────────────────────────────────────────────────

const HTML_DOCUMENTOS = `<div style="background:#F7F3EA">

${montarCabecalho(NAV_APOIO, '/')}

  <section id="documentos" style="background:#F7F3EA">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">Catálogo · Os 16 documentos</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:30px"></div>
      <h2 data-anim style="margin:0;max-width:760px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(32px,4.4vw,52px);line-height:1.06;letter-spacing:-.02em;color:#0E0E0E">
        16 documentos. Da autorização de venda à <em style="font-style:italic;color:#7a6435">entrega das chaves.</em>
      </h2>
      <p data-anim style="margin:22px 0 0;max-width:600px;font-size:16px;line-height:1.75;color:#5A544C">Cada modelo é redigido para a operação brasileira, com a fundamentação do Código Civil e a cláusula de corretagem já no lugar. E nenhum deles começa em branco: todos puxam do dossiê do negócio.</p>

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

  <section style="background:#0E0E0E;color:#F5F1E6">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(64px,9vw,104px) clamp(20px,5vw,60px);text-align:center">
      <h2 data-anim style="margin:0 auto;max-width:640px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(30px,4.2vw,48px);line-height:1.06;letter-spacing:-.02em;color:#F5F1E6">
        Comece pelo <em style="font-style:italic;color:#C9A84C">próximo negócio.</em>
      </h2>
      <p data-anim style="margin:22px auto 0;max-width:520px;font-size:16px;line-height:1.75;color:rgba(232,224,204,.75)">
        Você cria a conta, confirma pelo link que chega no e-mail e entra. Ninguém precisa aprovar nada.
      </p>
      <div data-anim style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center;align-items:center;margin-top:36px">
        <a href="/signup" style="display:inline-flex;align-items:center;height:54px;padding:0 34px;border-radius:999px;background:#C9A84C;color:#0E0E0E;font-size:15px;font-weight:600;transition:background 200ms cubic-bezier(.22,.61,.36,1)" style-hover="background:#F5F1E6">Criar conta grátis</a>
        <a href="/planos" style="font-size:15px;color:#F5F1E6;border-bottom:1px solid rgba(201,168,76,.5);padding-bottom:2px;transition:color 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#C9A84C;border-color:#C9A84C">Ver planos e valores</a>
      </div>
      <p data-anim style="margin:24px 0 0;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;color:rgba(232,224,204,.72)">15 dias grátis. Sem cartão. Sem instalação.</p>
    </div>
  </section>

${DESIGN_RODAPE}

</div>`

export default function DocumentosPage() {
  return <PaginaDesign html={HTML_DOCUMENTOS} />
}

const HTML_IMOBILIARIAS = `<div style="background:#F7F3EA">

${montarCabecalho(NAV_APOIO, '/')}

  <section style="background:#F3EBE0">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(80px,12vw,128px) clamp(20px,5vw,60px)">
      <p data-anim style="margin:0 0 12px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:.34em;text-transform:uppercase;color:#8B7340">Para imobiliárias e equipes</p>
      <div data-anim style="width:44px;height:1px;background:#C9A84C;margin-bottom:30px"></div>
      <h2 data-anim style="margin:0;max-width:740px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(32px,4.4vw,52px);line-height:1.06;letter-spacing:-.02em;color:#0E0E0E">
        Dez corretores, dez modelos de contrato diferentes. <em style="font-style:italic;color:#7a6435">Até aqui.</em>
      </h2>
      <div data-anim style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(420px,100%),1fr));gap:clamp(26px,3.5vw,48px);margin-top:52px">
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

  <section style="background:#0E0E0E;color:#F5F1E6">
    <div style="max-width:1120px;margin:0 auto;padding:clamp(64px,9vw,104px) clamp(20px,5vw,60px);text-align:center">
      <h2 data-anim style="margin:0 auto;max-width:640px;font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:clamp(30px,4.2vw,48px);line-height:1.06;letter-spacing:-.02em;color:#F5F1E6">
        Comece pelo <em style="font-style:italic;color:#C9A84C">próximo negócio.</em>
      </h2>
      <p data-anim style="margin:22px auto 0;max-width:520px;font-size:16px;line-height:1.75;color:rgba(232,224,204,.75)">
        Você cria a conta, confirma pelo link que chega no e-mail e entra. Ninguém precisa aprovar nada.
      </p>
      <div data-anim style="display:flex;flex-wrap:wrap;gap:20px;justify-content:center;align-items:center;margin-top:36px">
        <a href="/signup" style="display:inline-flex;align-items:center;height:54px;padding:0 34px;border-radius:999px;background:#C9A84C;color:#0E0E0E;font-size:15px;font-weight:600;transition:background 200ms cubic-bezier(.22,.61,.36,1)" style-hover="background:#F5F1E6">Criar conta grátis</a>
        <a href="/planos" style="font-size:15px;color:#F5F1E6;border-bottom:1px solid rgba(201,168,76,.5);padding-bottom:2px;transition:color 180ms cubic-bezier(.22,.61,.36,1),border-color 180ms cubic-bezier(.22,.61,.36,1)" style-hover="color:#C9A84C;border-color:#C9A84C">Ver planos e valores</a>
      </div>
      <p data-anim style="margin:24px 0 0;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.08em;color:rgba(232,224,204,.72)">15 dias grátis. Sem cartão. Sem instalação.</p>
    </div>
  </section>

${DESIGN_RODAPE}

</div>`

export function ImobiliariasPage() {
  return <PaginaDesign html={HTML_IMOBILIARIAS} />
}
