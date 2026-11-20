// Pedido 1133, itens A, B e C: os hooks do Docs num PocketBase local, com dados fictícios e o Prime Circle falso.
// Ver README.md desta pasta. Rodar: PB_BIN=/caminho/pocketbase node --test pocketbase/tests/integracao-prime-circle.test.mjs
import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'

import { assinaturaEsperada, servidor, subirPocketBase } from './harness.mjs'

const BIN = process.env.PB_BIN
const PORTAS = { pb: 18090, pc: 18091, ia: 18092 }
const pular = BIN ? false : 'defina PB_BIN com o caminho do binario do PocketBase 0.23.x'

const RESPOSTA_IA = {
  choices: [
    {
      message: {
        content: JSON.stringify({ status: 'green', resumo: 'Minuta em ordem.', conformidade: [], riscos: [], recomendacoes: [] }),
      },
    },
  ],
}
const PLANOS_URL = 'https://sistema.primecircle.app.br/planos'

describe('Docs: cota única, passe por imóvel e limite do CRECI', { skip: pular }, () => {
  let pb
  let pc
  let ia
  // Estado do Prime Circle falso e da IA falsa, mexido por cada teste.
  const prime = { modo: 'ok', debitos: new Set(), confirmadas: new Set(), estornadas: new Set(), falhasConfirmar: 0, assinaturasInvalidas: 0 }
  const iaEstado = { modo: 'ok', chamadas: 0 }
  let seq = 0

  before(async () => {
    pc = await servidor(PORTAS.pc, (reg) => {
      const acao = reg.url.split('/').pop()
      if (reg.headers['x-docs-assinatura'] !== assinaturaEsperada(reg.headers, acao, reg.json)) {
        prime.assinaturasInvalidas++
        return [401, { error: 'assinatura' }]
      }
      if (acao === 'reservar') {
        if (prime.modo === 'fora') return [503, {}]
        if (prime.modo === 'naovinculado') return [200, { vinculado: false, motivo: 'sem_conta' }]
        if (prime.modo === 'esgotado') {
          return [200, { vinculado: true, permitido: false, motivo: 'cota_esgotada', mensagem: `Você usou todas as análises de documento do seu plano do Prime Circle neste mês. Veja os planos para ter mais: ${PLANOS_URL}`, planos_url: PLANOS_URL }]
        }
        const repetida = prime.debitos.has(reg.json.chave)
        prime.debitos.add(reg.json.chave)
        return [200, { vinculado: true, permitido: true, repetida, origem: 'plano', saldo: { restante: 9, limite: 50 }, modelo: 'claude-sonnet-5-5' }]
      }
      if (acao === 'confirmar') {
        if (prime.falhasConfirmar > 0) {
          prime.falhasConfirmar--
          return [503, {}]
        }
        prime.confirmadas.add(reg.json.chave)
        return [200, { ok: true, status: 'confirmada', repetida: false }]
      }
      prime.estornadas.add(reg.json.chave)
      prime.debitos.delete(reg.json.chave)
      return [200, { ok: true, status: 'estornada', repetida: false }]
    })
    ia = await servidor(PORTAS.ia, () => {
      iaEstado.chamadas++
      return iaEstado.modo === 'ok' ? [200, RESPOSTA_IA] : [502, { error: 'falha' }]
    })
    pb = await subirPocketBase({ bin: BIN, portaPb: PORTAS.pb, portaPc: PORTAS.pc, portaIa: PORTAS.ia })
  })
  after(async () => {
    await pb?.parar()
    await pc?.fechar()
    await ia?.fechar()
  })

  const reset = () => {
    prime.modo = 'ok'
    prime.debitos.clear()
    prime.confirmadas.clear()
    prime.estornadas.clear()
    prime.falhasConfirmar = 0
    iaEstado.modo = 'ok'
    iaEstado.chamadas = 0
    pc.chamadas.length = 0
  }
  const agoraMais = (ms) => new Date(Date.now() + ms).toISOString().replace('T', ' ')
  const DIA = 86_400_000

  /** Usuário fictício criado pelo superusuário (na criação os campos de plano passam; a guarda só age em update). */
  async function usuario(campos = {}) {
    const n = ++seq
    const email = `u${n}-${Date.now()}@teste.local`
    const r = await pb.api('POST', '/api/collections/users/records', {
      email, password: 'Senha-de-teste-1', passwordConfirm: 'Senha-de-teste-1', verified: true, name: `Usuario ${n}`, ...campos,
    }, pb.suToken)
    assert.equal(r.status, 200, JSON.stringify(r.json))
    const login = await pb.api('POST', '/api/collections/users/auth-with-password', { identity: email, password: 'Senha-de-teste-1' })
    return { id: r.json.id, email, token: login.json.token }
  }
  const comPlano = (plano = 'corretor', extra = {}) => ({ plano, plano_renova_em: agoraMais(20 * DIA), ...extra })
  const validar = (u, texto = `Minuta de teste ${++seq}`, tipo = 'Genérico') =>
    pb.api('POST', '/backend/v1/validar-minuta', { document_text: texto, document_type: tipo }, u.token)
  const chamadasPc = (acao) => pc.chamadas.filter((c) => c.url.endsWith(`/${acao}`))
  const pendencias = async (u) => (await pb.api('GET', `/api/collections/prime_cota_pendencias/records?filter=${encodeURIComponent(`user="${u.id}"`)}`, undefined, pb.suToken)).json.items

  // ── A: cota única ─────────────────────────────────────────────────────────

  describe('A: validação de minuta desconta da cota única do Prime Circle', () => {
    it('com saldo: reserva antes da IA, confirma depois, e as chamadas vão assinadas', async () => {
      reset()
      const u = await usuario(comPlano())
      const r = await validar(u)
      assert.equal(r.status, 200, JSON.stringify(r.json))
      assert.equal(r.json.status, 'green')
      assert.equal(iaEstado.chamadas, 1)
      assert.equal(chamadasPc('reservar').length, 1)
      assert.equal(chamadasPc('confirmar').length, 1)
      assert.equal(chamadasPc('estornar').length, 0)
      const reservar = chamadasPc('reservar')[0].json
      assert.equal(reservar.email, u.email.toLowerCase())
      assert.equal(reservar.docs_user_id, u.id)
      assert.equal(chamadasPc('confirmar')[0].json.chave, reservar.chave)
      assert.equal(prime.debitos.size, 1)
      assert.equal(prime.confirmadas.size, 1)
      assert.equal(prime.assinaturasInvalidas, 0)
      // A ordem importa: a reserva vem antes da chamada à IA e a confirmação depois (confirmar só existe se a IA entregou).
      assert.ok(pc.chamadas.findIndex((c) => c.url.endsWith('/reservar')) < pc.chamadas.findIndex((c) => c.url.endsWith('/confirmar')))
    })

    it('sem saldo: bloqueia com a mensagem e o link dos planos, antes de chamar a IA', async () => {
      reset()
      prime.modo = 'esgotado'
      const u = await usuario(comPlano())
      const r = await validar(u)
      assert.equal(r.status, 402)
      assert.equal(r.json.code, 'QUOTA_EXHAUSTED')
      assert.ok(r.json.error.includes(PLANOS_URL), r.json.error)
      assert.equal(r.json.planos_url, PLANOS_URL)
      assert.ok(!/[—–]/.test(r.json.error), 'sem travessão em texto visível')
      assert.equal(iaEstado.chamadas, 0, 'a IA não pode ser chamada sem saldo')
      assert.equal(chamadasPc('confirmar').length + chamadasPc('estornar').length, 0)
    })

    it('a mesma validação repetida usa a mesma chave e não desconta duas vezes; outro texto desconta', async () => {
      reset()
      const u = await usuario(comPlano())
      const texto = 'Minuta idêntica enviada duas vezes pelo corretor.'
      assert.equal((await validar(u, texto)).status, 200)
      assert.equal((await validar(u, texto)).status, 200)
      const chaves = chamadasPc('reservar').map((c) => c.json.chave)
      assert.equal(chaves.length, 2)
      assert.equal(chaves[0], chaves[1])
      assert.equal(prime.debitos.size, 1, 'duas chamadas, um desconto')
      assert.equal((await validar(u, 'Outra minuta, outro texto.')).status, 200)
      assert.equal(prime.debitos.size, 2)
      // A chave não vaza o texto da minuta (LGPD): só um resumo (hash) dele.
      assert.ok(!chaves[0].includes('idêntica'))
    })

    it('a IA falha: o 1 é devolvido (estornar com a mesma chave) e o corretor recebe o erro da IA', async () => {
      reset()
      iaEstado.modo = 'falha'
      const u = await usuario(comPlano())
      const r = await validar(u)
      assert.equal(r.status, 502)
      assert.equal(chamadasPc('estornar').length, 1)
      assert.equal(chamadasPc('estornar')[0].json.chave, chamadasPc('reservar')[0].json.chave)
      assert.equal(chamadasPc('confirmar').length, 0)
      assert.equal(prime.debitos.size, 0)
    })

    it('Prime Circle fora do ar: NÃO bloqueia o corretor, e a falha fica registrada para conciliar', async () => {
      reset()
      prime.modo = 'fora'
      const u = await usuario(comPlano())
      const r = await validar(u)
      assert.equal(r.status, 200, JSON.stringify(r.json))
      assert.equal(iaEstado.chamadas, 1)
      assert.equal(chamadasPc('confirmar').length, 0, 'nada foi reservado, nada a confirmar')
      const p = await pendencias(u)
      assert.equal(p.length, 1)
      assert.equal(p[0].acao, 'sem_reserva')
      assert.equal(p[0].resolvida, false)
    })

    it('o aviso de confirmação que falha fica pendente e é repetido na próxima validação do usuário', async () => {
      reset()
      prime.falhasConfirmar = 1
      const u = await usuario(comPlano())
      assert.equal((await validar(u)).status, 200)
      let p = await pendencias(u)
      assert.deepEqual(p.map((x) => [x.acao, x.resolvida]), [['confirmar', false]])
      const chavePendente = p[0].chave

      assert.equal((await validar(u)).status, 200)
      p = await pendencias(u)
      assert.equal(p.find((x) => x.acao === 'confirmar').resolvida, true)
      assert.ok(prime.confirmadas.has(chavePendente), 'o Prime Circle recebeu a confirmação atrasada')
    })

    it('usuário sem vínculo com o Prime Circle segue a regra do Docs: valida e nada é confirmado nem estornado', async () => {
      reset()
      prime.modo = 'naovinculado'
      const u = await usuario(comPlano())
      assert.equal((await validar(u)).status, 200)
      assert.equal(chamadasPc('reservar').length, 1)
      assert.equal(chamadasPc('confirmar').length + chamadasPc('estornar').length, 0)
      assert.equal((await pendencias(u)).length, 0)
    })

    it('avulso: sem vínculo vale a regra local (1 validação); vinculado, quem manda são as 5 análises do passe', async () => {
      reset()
      prime.modo = 'naovinculado'
      const semVinculo = await usuario(comPlano('avulso', { avulso_validacoes: 1 }))
      const bloqueado = await validar(semVinculo)
      assert.equal(bloqueado.status, 402)
      assert.ok(bloqueado.json.error.includes('já foi usada'))
      assert.equal(iaEstado.chamadas, 0)

      reset()
      const vinculado = await usuario(comPlano('avulso', { avulso_validacoes: 1 }))
      const r = await validar(vinculado)
      assert.equal(r.status, 200, JSON.stringify(r.json))
      assert.equal(iaEstado.chamadas, 1)
      assert.equal(prime.confirmadas.size, 1)

      reset() // Prime Circle fora: o avulso cai na regra local, que é a conservadora
      prime.modo = 'fora'
      const fora = await usuario(comPlano('avulso', { avulso_validacoes: 1 }))
      assert.equal((await validar(fora)).status, 402)
    })

    it('teste de 15 dias, plano vencido e admin não chamam o Prime Circle', async () => {
      reset()
      assert.equal((await validar(await usuario())).status, 200) // sem plano: teste
      const admin = await usuario({ isAdmin: true })
      assert.equal((await validar(admin)).status, 200)
      const vencido = await validar(await usuario({ plano: 'corretor', plano_renova_em: agoraMais(-DIA) }))
      assert.equal(vencido.status, 402)
      assert.equal(pc.chamadas.length, 0)
    })

    it('o contador local de validações (ia_contador) continua contando para a tela', async () => {
      reset()
      const u = await usuario(comPlano())
      await validar(u)
      const dados = (await pb.api('GET', `/api/collections/users/records/${u.id}`, undefined, pb.suToken)).json
      assert.equal(dados.validacoes_no_mes, 1)
    })
  })

  // ── B: CRECI usa o plano `corretor` do Docs ───────────────────────────────

  describe('B: o que o corretor do Plano CRECI tem hoje no Docs (plano `corretor`)', () => {
    async function admin() {
      return usuario({ isAdmin: true })
    }
    it('carimbar `corretor` dá teto de 10 operações por mês, que só avisa (não bloqueia) e zera na virada do mês', async () => {
      reset()
      const adm = await admin()
      const u = await usuario()
      const carimbo = await pb.api('POST', '/backend/v1/admin/usuarios/plano', { user_id: u.id, plano: 'corretor', meses: 1 }, adm.token)
      assert.equal(carimbo.status, 200, JSON.stringify(carimbo.json))
      const dono = (await pb.api('GET', `/api/collections/users/records/${u.id}`, undefined, pb.suToken)).json
      assert.equal(dono.plano_limite_negocios, 10)
      assert.ok(new Date(dono.plano_renova_em.replace(' ', 'T')).getTime() > Date.now() + 27 * DIA, 'um mês de calendário')

      // 12 operações novas: o contador sobe além do teto e NENHUMA é recusada.
      for (let i = 0; i < 12; i++) {
        const r = await pb.api('POST', '/api/collections/negocios/records', { owner: u.id, titulo: `Operacao ${i}`, partes: [], imovel: { endereco: `Rua ${i}, ${i}`, cidade: 'Rio' } }, u.token)
        assert.equal(r.status, 200, `operação ${i}: ${JSON.stringify(r.json)}`)
      }
      const depois = (await pb.api('GET', `/api/collections/users/records/${u.id}`, undefined, pb.suToken)).json
      assert.equal(depois.negocios_no_mes, 12)
      assert.equal(depois.plano_limite_negocios, 10)
      assert.equal(depois.contador_mes, new Date().toISOString().slice(0, 7))
    })

    it('a validação de minuta do corretor CRECI não tem teto local: quem limita é a cota do Prime Circle (20 por mês no CRECI)', async () => {
      reset()
      const u = await usuario(comPlano('corretor', { validacoes_no_mes: 500, ia_mes_ref: new Date().toISOString().slice(0, 7) }))
      assert.equal((await validar(u)).status, 200)
    })
  })

  // ── C: passe avulso só para o imóvel, por 30 dias exatos ──────────────────

  describe('C: passe avulso só para o imóvel do passe', () => {
    const imovelDoPasse = (extra = {}) => ({ ref: 'imv-1', titulo: 'Apto Leblon', logradouro: 'Rua Dias Ferreira', numero: '45', bairro: 'Leblon', cidade: 'Rio de Janeiro', cep: '22431050', ate: new Date(Date.now() + 30 * DIA).toISOString(), ...extra })
    const criar = (u, endereco, extra = {}) =>
      pb.api('POST', '/api/collections/negocios/records', { owner: u.id, titulo: 'Dossie', partes: [], imovel: endereco === null ? {} : { endereco, cidade: 'Rio de Janeiro' }, ...extra }, u.token)

    it('o carimbo do passe guarda a validade EXATA (30 dias) e os imóveis, e zera a lista ao trocar de plano', async () => {
      reset()
      const adm = await usuario({ isAdmin: true })
      const u = await usuario()
      const fim = new Date(Date.now() + 30 * DIA)
      fim.setMilliseconds(0)
      const r = await pb.api('POST', '/backend/v1/admin/usuarios/plano', { user_id: u.id, plano: 'avulso', meses: 1, renova_em: fim.toISOString(), imoveis: [imovelDoPasse({ ate: fim.toISOString() })] }, adm.token)
      assert.equal(r.status, 200, JSON.stringify(r.json))
      const dono = (await pb.api('GET', `/api/collections/users/records/${u.id}`, undefined, pb.suToken)).json
      assert.equal(dono.plano, 'avulso')
      assert.equal(new Date(dono.plano_renova_em.replace(' ', 'T')).getTime(), fim.getTime(), 'validade exata, não mês de calendário')
      assert.equal(dono.plano_limite_negocios, 1)
      assert.equal(JSON.parse(dono.avulso_imoveis)[0].logradouro, 'Rua Dias Ferreira')
      const lista = (await pb.api('GET', '/backend/v1/admin/usuarios', undefined, adm.token)).json.usuarios.find((x) => x.id === u.id)
      assert.equal(JSON.parse(lista.avulso_imoveis).length, 1, 'a plataforma lê o carimbo para não recarimbar à toa')

      const outro = await pb.api('POST', '/backend/v1/admin/usuarios/plano', { user_id: u.id, plano: 'corretor', meses: 1 }, adm.token)
      assert.equal(outro.status, 200)
      assert.equal((await pb.api('GET', `/api/collections/users/records/${u.id}`, undefined, pb.suToken)).json.avulso_imoveis, '')
    })

    it('validade fora do razoável é recusada; avulso sem validade (carimbo manual) segue como sempre, sem restrição de imóvel', async () => {
      reset()
      const adm = await usuario({ isAdmin: true })
      const u = await usuario()
      for (const renova_em of [new Date(Date.now() - DIA).toISOString(), new Date(Date.now() + 45 * DIA).toISOString(), 'ontem']) {
        const r = await pb.api('POST', '/backend/v1/admin/usuarios/plano', { user_id: u.id, plano: 'avulso', meses: 1, renova_em, imoveis: [] }, adm.token)
        assert.equal(r.status, 400, renova_em)
      }
      const manual = await pb.api('POST', '/backend/v1/admin/usuarios/plano', { user_id: u.id, plano: 'avulso', meses: 1 }, adm.token)
      assert.equal(manual.status, 200)
      const dono = (await pb.api('GET', `/api/collections/users/records/${u.id}`, undefined, pb.suToken)).json
      assert.equal(dono.avulso_imoveis, '')
      assert.equal((await criar(u, 'Qualquer rua, 1')).status, 200, 'sem lista de imóveis, o avulso antigo não é tocado')
    })

    it('o usuário não consegue apagar nem trocar a lista de imóveis do próprio passe', async () => {
      reset()
      const u = await usuario(comPlano('avulso', { avulso_imoveis: JSON.stringify([imovelDoPasse()]) }))
      const r = await pb.api('PATCH', `/api/collections/users/records/${u.id}`, { avulso_imoveis: '', plano_renova_em: agoraMais(900 * DIA) }, u.token)
      assert.equal(r.status, 200)
      const dono = (await pb.api('GET', `/api/collections/users/records/${u.id}`, undefined, pb.suToken)).json
      assert.equal(JSON.parse(dono.avulso_imoveis)[0].numero, '45')
      assert.ok(new Date(dono.plano_renova_em.replace(' ', 'T')).getTime() < Date.now() + 25 * DIA)
    })

    it('dossiê do imóvel do passe passa (com abreviações e complemento); outro imóvel, outro número e outra cidade não', async () => {
      reset()
      const u = await usuario(comPlano('avulso', { avulso_imoveis: JSON.stringify([imovelDoPasse()]) }))
      for (const ok of ['Rua Dias Ferreira, 45', 'R. Dias Ferreira nº 45 apto 301', 'rua DIAS ferreira 45 - Leblon']) {
        assert.equal((await criar(u, ok)).status, 200, ok)
      }
      for (const nao of ['Rua Dias Ferreira, 450', 'Rua Dias Ferreira, 4', 'Rua Bartolomeu Mitre, 45', 'Avenida Atlântica, 1500']) {
        const r = await criar(u, nao)
        assert.equal(r.status, 403, nao)
        assert.ok(r.json.message.includes('imóvel do passe'), r.json.message)
        assert.ok(r.json.message.includes('Rua Dias Ferreira, 45'))
      }
      const outraCidade = await pb.api('POST', '/api/collections/negocios/records', { owner: u.id, titulo: 'x', partes: [], imovel: { endereco: 'Rua Dias Ferreira, 45', cidade: 'Niterói' } }, u.token)
      assert.equal(outraCidade.status, 403)
    })

    it('dossiê novo sem endereço é aceito, mas gravar outro imóvel nele não; editar outra coisa continua livre', async () => {
      reset()
      const u = await usuario(comPlano('avulso', { avulso_imoveis: JSON.stringify([imovelDoPasse()]) }))
      const vazio = await criar(u, null)
      assert.equal(vazio.status, 200)
      const troca = await pb.api('PATCH', `/api/collections/negocios/records/${vazio.json.id}`, { imovel: { endereco: 'Rua Outra, 9', cidade: 'Rio de Janeiro' } }, u.token)
      assert.equal(troca.status, 403)
      const certo = await pb.api('PATCH', `/api/collections/negocios/records/${vazio.json.id}`, { imovel: { endereco: 'Rua Dias Ferreira, 45', cidade: 'Rio de Janeiro' } }, u.token)
      assert.equal(certo.status, 200)
      const titulo = await pb.api('PATCH', `/api/collections/negocios/records/${vazio.json.id}`, { titulo: 'Novo titulo' }, u.token)
      assert.equal(titulo.status, 200)
    })

    it('passe vencido: não cria dossiê novo, não troca o imóvel, e continua vendo e corrigindo o que já tem; a validação é recusada', async () => {
      reset()
      // Conta com passe que venceu há uma hora e um dossiê do imóvel feito enquanto valia.
      const u = await usuario({ plano: 'avulso', plano_renova_em: agoraMais(-3_600_000), avulso_imoveis: JSON.stringify([imovelDoPasse({ ate: new Date(Date.now() - 3_600_000).toISOString() })]) })
      const existente = await pb.api('POST', '/api/collections/negocios/records', { owner: u.id, titulo: 'Feito no passe', partes: [{ nome: 'Maria' }], imovel: { endereco: 'Rua Dias Ferreira, 45', cidade: 'Rio de Janeiro' } }, pb.suToken)
      assert.equal(existente.status, 200, JSON.stringify(existente.json))

      const novo = await criar(u, 'Rua Dias Ferreira, 45')
      assert.equal(novo.status, 403)
      assert.ok(novo.json.message.includes('terminou'))
      const vazio = await criar(u, null)
      assert.equal(vazio.status, 403, 'nem dossiê vazio depois do vencimento')

      const lista = await pb.api('GET', '/api/collections/negocios/records', undefined, u.token)
      assert.equal(lista.status, 200)
      assert.equal(lista.json.items.length, 1, 'continua vendo o que já gerou')
      assert.equal((await pb.api('GET', `/api/collections/negocios/records/${existente.json.id}`, undefined, u.token)).json.partes[0].nome, 'Maria')
      assert.equal((await pb.api('PATCH', `/api/collections/negocios/records/${existente.json.id}`, { titulo: 'Corrigido' }, u.token)).status, 200)
      const troca = await pb.api('PATCH', `/api/collections/negocios/records/${existente.json.id}`, { imovel: { endereco: 'Rua Outra, 9', cidade: 'Rio de Janeiro' } }, u.token)
      assert.equal(troca.status, 403)

      assert.equal((await validar(u)).status, 402)
      assert.equal(iaEstado.chamadas, 0)
    })

    it('com dois passes, vale cada imóvel até a data dele; o que venceu sai da lista', async () => {
      reset()
      const u = await usuario(comPlano('avulso', {
        avulso_imoveis: JSON.stringify([
          imovelDoPasse({ ref: 'a', logradouro: 'Rua A', numero: '1', ate: new Date(Date.now() - 1000).toISOString() }),
          imovelDoPasse({ ref: 'b', logradouro: 'Rua B', numero: '2' }),
        ]),
      }))
      assert.equal((await criar(u, 'Rua B, 2')).status, 200)
      assert.equal((await criar(u, 'Rua A, 1')).status, 403, 'o passe da Rua A já venceu')
    })

    it('conta que não é avulso, e admin, não passam por esta conferência', async () => {
      reset()
      const corretor = await usuario(comPlano('corretor', { avulso_imoveis: JSON.stringify([imovelDoPasse()]) }))
      assert.equal((await criar(corretor, 'Qualquer rua, 99')).status, 200)
      const adm = await usuario({ isAdmin: true, plano: 'avulso', plano_renova_em: agoraMais(DIA), avulso_imoveis: JSON.stringify([imovelDoPasse()]) })
      assert.equal((await criar(adm, 'Qualquer rua, 99')).status, 200)
    })
  })
})
