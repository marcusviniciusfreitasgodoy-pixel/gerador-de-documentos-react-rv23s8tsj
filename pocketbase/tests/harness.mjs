// Harness do teste dos hooks no PocketBase local. Ver README.md.
import { spawn } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { createServer } from 'node:http'
import { createHmac } from 'node:crypto'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const aqui = dirname(fileURLToPath(import.meta.url))
const hooksDir = join(aqui, '..', 'hooks')
const migDir = join(aqui, '..', 'migrations')

export const HOOKS_TESTADOS = [
  'validar_minuta',
  'ia_contador',
  'plano_carimbo',
  'trial_carimbo',
  'negocio_limite',
  'negocio_agency_stamp',
  'admin_usuarios',
  'avulso_imovel',
]

export function prepararHook(codigo) {
  return codigo
    .replaceAll('$secrets.get(', '$os.getenv(')
    .replaceAll('$ai.chat(', 'require(`${__hooks}/ai_stub.js`).chat(')
    .replaceAll('instanceof SkipAiConfigError', 'instanceof require(`${__hooks}/ai_stub.js`).SkipAiConfigError')
    .replaceAll('instanceof SkipAiError', 'instanceof require(`${__hooks}/ai_stub.js`).SkipAiError')
}

export const SEGREDO = 'segredo-de-teste-do-harness'

/** Servidor HTTP simples; `tratar(req, corpo)` devolve [status, json]. */
export function servidor(porta, tratar) {
  const chamadas = []
  const srv = createServer((req, res) => {
    let corpo = ''
    req.on('data', (c) => (corpo += c))
    req.on('end', () => {
      let json = {}
      try { json = corpo ? JSON.parse(corpo) : {} } catch { json = {} }
      const reg = { url: req.url, headers: req.headers, json }
      chamadas.push(reg)
      const [status, saida] = tratar(reg)
      res.writeHead(status, { 'content-type': 'application/json' })
      res.end(JSON.stringify(saida))
    })
  })
  return new Promise((ok) => srv.listen(porta, '127.0.0.1', () => ok({ srv, chamadas, fechar: () => new Promise((f) => srv.close(f)) })))
}

export function assinaturaEsperada(h, acao, json) {
  return createHmac('sha256', SEGREDO).update(`${h['x-docs-timestamp']}.${acao}.${json.chave}.${String(json.email).toLowerCase()}`).digest('hex')
}

export async function subirPocketBase({ bin, portaPb, portaPc, portaIa }) {
  const raiz = join(tmpdir(), `pb-docs-${process.pid}-${Date.now()}`)
  const hooks = join(raiz, 'pb_hooks')
  const migs = join(raiz, 'pb_migrations')
  mkdirSync(hooks, { recursive: true })
  mkdirSync(migs, { recursive: true })
  for (const f of readdirSync(migDir)) copyFileSync(join(migDir, f), join(migs, f))
  copyFileSync(join(aqui, '1000000000_harness_base.js'), join(migs, '1000000000_harness_base.js'))
  copyFileSync(join(aqui, 'ai_stub.js'), join(hooks, 'ai_stub.js'))
  for (const h of HOOKS_TESTADOS) writeFileSync(join(hooks, `${h}.pb.js`), prepararHook(readFileSync(join(hooksDir, `${h}.js`), 'utf8')))
  const env = {
    ...process.env,
    PRIME_CIRCLE_COTA_SECRET: SEGREDO,
    PRIME_CIRCLE_COTA_URL: `http://127.0.0.1:${portaPc}`,
    TEST_AI_URL: `http://127.0.0.1:${portaIa}`,
  }
  const su = ['su@teste.local', 'Superusuario-123']
  const base = ['--dir', join(raiz, 'pb_data'), '--migrationsDir', migs, '--hooksDir', hooks]
  await new Promise((ok, no) => {
    const p = spawn(bin, ['superuser', 'upsert', ...su, ...base], { env })
    p.on('exit', (c) => (c === 0 ? ok() : no(new Error('superuser upsert falhou'))))
  })
  const proc = spawn(bin, ['serve', `--http=127.0.0.1:${portaPb}`, ...base], { env })
  let log = ''
  proc.stdout.on('data', (d) => (log += d))
  proc.stderr.on('data', (d) => (log += d))
  const url = `http://127.0.0.1:${portaPb}`
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(url + '/api/health')).ok) break } catch { /* ainda subindo */ }
    await new Promise((r) => setTimeout(r, 100))
  }
  const api = async (metodo, caminho, corpo, token) => {
    const r = await fetch(url + caminho, {
      method: metodo,
      headers: { 'content-type': 'application/json', ...(token ? { authorization: token } : {}) },
      body: corpo === undefined ? undefined : JSON.stringify(corpo),
    })
    const t = await r.text()
    let json = {}
    try { json = t ? JSON.parse(t) : {} } catch { json = { raw: t } }
    return { status: r.status, json }
  }
  const suToken = (await api('POST', '/api/collections/_superusers/auth-with-password', { identity: su[0], password: su[1] })).json.token
  return {
    api,
    url,
    suToken,
    log: () => log,
    parar: async () => {
      proc.kill('SIGTERM')
      await new Promise((r) => proc.on('exit', r))
      rmSync(raiz, { recursive: true, force: true })
    },
  }
}
