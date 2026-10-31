# Referência para nova landing page de agentes

Coletado em 31/10/2026 de:

- https://naiaos.denderson.ai/brand (marca original: **Naia OS**, Instituto Avalanche)
- https://agentes.primecircle.app.br/ (white-label: **Prime Circle Agentes**, orquestradora **Sônia**)

**Os dois domínios são o mesmo app.** Mesmo bundle (`index-kn6DZcmA.js`), mesmo CSS, mesmas
imagens dos agentes (conferido byte a byte). A troca de marca é feita pelo `brand-init.js`, que
só substitui 4 variáveis de cor (`--accent`, `--accent-soft`, `--accent-line`, `--accent-ink`),
nome do produto, nome da agente, logo e avatar.

## Estrutura da pasta

```
imagens/
  agentes/              22 retratos 480x480 WebP (21 especialistas + orquestradora Naia)
  cena-orquestradora/   time-naia.webp (1536x864, cena do time inteiro) e orquestradora-realism.jpg (800x800)
  depoimentos/          5 capas de vídeo (antonio, cadu, fernando, aluna, marcio)
  pet-mascote/          spritesheets do mascote animado (q2-time, q5-reuniao, spritesheet)
  marca-primecircle/    logo.png (1600x400) e avatar-sonia.jpg (1024x1024)
conteudo/
  curriculos-naia-pt.txt                 currículo completo dos 22 agentes (modal "Ver currículo")
  curriculos-sonia-primecircle-pt.txt    o mesmo na versão Prime Circle
  pagina-naia-texto-pt.txt               texto integral da página Naia (com FAQ aberto)
  pagina-primecircle-agentes-texto-pt.txt
  copy-landing-pt-BR.json / en.json / es.json   arquivo de copy que o app carrega (/landing/copy/<lang>.json)
screenshots/            página inteira a 1440 px e 390 px, das duas versões
```

## Agentes: imagem, cargo e área

Ordem em que aparecem na página. Cada currículo em `conteudo/curriculos-*.txt` tem as mesmas
seções: **O que faz, Habilidades, Plataformas, Como trabalha (passo a passo), Turnos, Resultados,
Treinamentos, Como pedir (exemplos de pedido)**.

| # | Agente | Cargo | Área | Imagem |
|---|---|---|---|---|
| 1 | Naia / Sônia | Orquestradora, gerente da operação de IA | Comando e operação | `agentes/orquestradora.webp` (Naia) · `marca-primecircle/avatar-sonia.jpg` (Sônia) |
| 2 | Juliana | Braço direito e subgerente de operações | Comando e operação | `agentes/juliana-ops.webp` |
| 3 | Rafael | Gestor de projetos | Comando e operação | `agentes/rafael-projetos.webp` |
| 4 | Paulo | Desenvolvedor full-stack | Produção | `agentes/paulo-dev.webp` |
| 5 | Clone do dono | SDR, atendimento no Direct e no WhatsApp com a voz do dono | Squad de vendas | `agentes/clone-do-dono.webp` (silhueta) |
| 6 | Jonathan | Redator (copy) e pesquisador | Produção | `agentes/jonathan-copy.webp` |
| 7 | Bianca | Analista de vídeos virais do Instagram | Produção | `agentes/bianca-viral.webp` |
| 8 | Amanda | Gestora do CRM | Produção | `agentes/amanda-crm.webp` |
| 9 | Estrategista de tráfego | Gestor de tráfego pago | Tráfego e clientes | `agentes/estrategista-trafego.webp` |
| 10 | Davi | Líder do squad, vendas no WhatsApp | Squad de vendas | `agentes/davi-sdr.webp` |
| 11 | Amanda | SDR | Squad de vendas | `agentes/amanda-sdr.webp` |
| 12 | Bianca | SDR | Squad de vendas | `agentes/bianca-sdr.webp` |
| 13 | Carolina | SDR | Squad de vendas | `agentes/carolina-sdr.webp` |
| 14 | Felipe | SDR | Squad de vendas | `agentes/felipe-sdr.webp` |
| 15 | Lucas | SDR | Squad de vendas | `agentes/lucas-sdr.webp` |
| 16 | Matheus | SDR | Squad de vendas | `agentes/matheus-sdr.webp` |
| 17 | Márcia | Financeiro e contabilidade | Produção | `agentes/marcia-financeiro.webp` |
| 18 | Maria | Tributário e notas fiscais (inclui reforma IBS/CBS) | Produção | `agentes/maria-tributario.webp` |
| 19 | Aline | Jurídico: contratos, LGPD, marca no INPI | Produção | `agentes/aline-juridico.webp` |
| 20 | Geane | RH, ciclo completo dentro da CLT | Produção | `agentes/geane-rh.webp` |
| 21 | Ruth | Prospecção, encontra e aquece novos clientes | Tráfego e clientes | `agentes/ruth-prospeccao.webp` |
| 22 | Boris | Engenheiro de software, sistemas complexos (ERP, CRM, SaaS) | Produção | `agentes/boris-engenharia.webp` |

Diferença de conteúdo entre as versões: na Prime Circle, "CRM Avalanche" virou só "CRM" e o nome
da orquestradora é Sônia. O resto dos currículos é idêntico.

## Estrutura das páginas (seções, na ordem)

| Seção | Naia OS | Prime Circle Agentes |
|---|---|---|
| Hero | "100k/mês recorrente usando e revendendo agentes de IA. Sem contratar mais nenhum funcionário humano." + vídeo "Assista antes de decidir" | "Uma agente de IA com um time inteiro trabalhando por você. Sem contratar..." + CTA "Quero a minha Sônia" |
| Números (prova social) | +7.000 empresas, +253.000 tarefas, +750 bi tokens, +R$ 32,6 mi economia em folha, +R$ 25 mi faturamento | ausente |
| Carta aberta | Carta do Denderson Rodrigues + 3 cards "Por que isso vira renda recorrente" | ausente |
| Cena do time | `time-naia.webp` "A Naia orquestra. O time inteiro trabalha junto." | ausente |
| Time | Orquestradora em destaque + grade de 21 cards com "Ver currículo" (modal) | igual |
| Economia | Tabela de 14 cargos: salário médio, custo total CLT (+68%), custo/hora (220 h), "24/7". Total R$ 144.045/mês, R$ 1.728.535/ano. Fontes: Salario.com.br (CAGED), Jooble, Buk, Contabilizei | igual |
| Depoimentos | 5 vídeos (Antônio, Cadu, Fernando, aluna, Márcio revenda) | ausente |
| Planos | Starter R$ 1.497/ano (5 agentes) · Elite R$ 2.497/ano (16) · Magnata R$ 9.997/ano (22). Pix ou 12x | igual, com nome Prime Circle Agentes |
| Dois caminhos | "Ter a minha Naia" vs "Ser agência" (revenda white-label) | ausente |
| Formulário | Nome, e-mail, WhatsApp, interesse, consentimento LGPD | ausente |
| FAQ | 6 perguntas | 5 (sem "agente vs agência") |
| Fechamento + aviso | "Não há promessa de faturamento garantido..." | igual |

## Sistema visual

- **Tipografia:** Bricolage Grotesque (títulos e corpo), DM Sans, JetBrains Mono. Todas Google Fonts livres.
- **Tema claro da landing:** fundo `oklch(95.5% .022 225)` (azul gelo), tinta `#142d46`, blocos
  navy `#183653`, papel creme `#fffaf0` / `#f4e6c7`, destaque amarelo-mostarda `#edc76a` nos títulos,
  botão coral `#e9584f`. Cards com borda escura e sombra deslocada (estilo "neo-brutalista suave").
- **Acento por marca:** Naia `oklch(49% .105 220)` (azul petróleo); Prime Circle `oklch(55% .14 75)` (dourado).
- **Arte dos agentes:** ilustração 3D estilo Pixar, todos no mesmo escritório com vista de skyline,
  plantas e monitores azuis. Retratos 480x480, meio corpo, segurando celular, tablet ou papel.

## Alertas antes de reaproveitar

1. **Arte de origem Avalanche.** Uso coberto pela revenda autorizada white-label (informado pelo
   dono em 31/10/2026). Ponto que sobra é de marca, não de direito: a orquestradora
   Naia (ruiva, centro de `time-naia.webp`) e a **Juliana** (primeiro card da grade, inclusive na
   Prime Circle) usam moletom vermelho com um "A" dourado (logo Avalanche), o que contradiz a
   marca própria. Vale pedir à Avalanche versões sem o "A" ou retocar.
2. **Vazamento da marca original na versão Prime Circle:** o plano Elite promete "Acesso à
   Comunidade de Estudos de IA Avalanche".
3. **Logo da Prime Circle quase invisível:** `logo.png` tem texto creme e dourado, feito para fundo
   escuro, mas o cabeçalho da landing é creme. Veja `screenshots/primecircle-agentes-1440.jpg`.
4. Os números da Naia (+7.000 empresas, R$ 25 mi) são da plataforma, não da Prime Circle. Só
   use atribuídos à plataforma ("a tecnologia por trás da Sônia já roda em +7.000 empresas") e
   com autorização escrita da Avalanche.
6. Público: esta página é para qualquer empresa. Uma página específica para o mercado imobiliário
   virá depois.
5. As capas de depoimento são de pessoas reais. Não reutilize sem autorização delas.
