// Sobe o PocketBase local do harness e fica de pé até receber SIGTERM. Para os testes do lado do Prime Circle que falam
// com os hooks de verdade (apps/api/.../docs-cota.e2e.test.ts).
//   PB_BIN=... PB_PORTA=18190 PC_PORTA=18191 IA_PORTA=18192 node pocketbase/tests/subir-pb-local.mjs
import { SEGREDO, subirPocketBase } from './harness.mjs'

const pb = await subirPocketBase({
  bin: process.env.PB_BIN,
  portaPb: Number(process.env.PB_PORTA ?? 18190),
  portaPc: Number(process.env.PC_PORTA ?? 18191),
  portaIa: Number(process.env.IA_PORTA ?? 18192),
})
console.log(`PRONTO ${pb.url} segredo-do-harness=${SEGREDO.length} caracteres`)
const sair = async () => {
  await pb.parar()
  process.exit(0)
}
process.on('SIGTERM', sair)
process.on('SIGINT', sair)
setInterval(() => {}, 1 << 30)
