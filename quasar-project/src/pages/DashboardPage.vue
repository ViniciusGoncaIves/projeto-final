<template>
  <q-page class="dashboard-page q-pa-md">
    <div class="dashboard-wrapper q-gutter-md">

      <div class="row items-center justify-between q-mb-sm">
        <div class="text-h5">
          Dashboard
        </div>
        <q-badge color="secondary" outline>
          Visão geral do sistema
        </q-badge>
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="dashboard-card summary-card">
            <div class="text-caption text-grey-5">Total de Alunos</div>
            <div class="text-h4 q-mt-xs">{{ totalAlunos }}</div>
            <div class="text-caption text-grey-6 q-mt-xs">
              Cadastrados no sistema
            </div>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="dashboard-card summary-card">
            <div class="text-caption text-grey-5">Total de Professores</div>
            <div class="text-h4 q-mt-xs">{{ totalProfessores }}</div>
            <div class="text-caption text-grey-6 q-mt-xs">
              Professores ativos
            </div>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="dashboard-card summary-card">
            <div class="text-caption text-grey-5">Turmas</div>
            <div class="text-h4 q-mt-xs">{{ totalTurmas }}</div>
            <div class="text-caption text-grey-6 q-mt-xs">
              Turmas cadastradas
            </div>
          </q-card>
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <q-card class="dashboard-card summary-card">
            <div class="text-caption text-grey-5">Disciplinas</div>
            <div class="text-h4 q-mt-xs">{{ totalDisciplinas }}</div>
            <div class="text-caption text-grey-6 q-mt-xs">
              Disciplinas oferecidas
            </div>
          </q-card>
        </div>
      </div>

      <div class="row q-col-gutter-md q-mt-sm">
        <div class="col-12 col-md-4">
          <q-card class="dashboard-card highlight-card q-pa-md">
            <div class="text-caption text-grey-5">Média geral das notas</div>
            <div class="row items-baseline no-wrap q-mt-xs">
              <div class="text-h3 q-mr-sm">
                {{ mediaGeralNotas }}
              </div>
              <q-badge
                v-if="quantidadeNotas > 0"
                color="positive"
                outline
                class="text-weight-medium"
              >
                {{ quantidadeNotas }} notas lançadas
              </q-badge>
            </div>
            <div class="text-caption text-grey-6 q-mt-sm">
              Cálculo com base em todas as avaliações registradas.
            </div>
          </q-card>
        </div>

        <div class="col-12 col-md-8">
          <q-card class="dashboard-card soft-card q-pa-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <div class="text-caption text-grey-5">Maior nota</div>
                <div class="text-h5 q-mt-xs">
                  {{ maiorNota }}
                </div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  Maior nota entre as avaliações.
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div class="text-caption text-grey-5">Menor nota</div>
                <div class="text-h5 q-mt-xs">
                  {{ menorNota }}
                </div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  Menor nota entre as avaliações.
                </div>
              </div>

              <div class="col-12 col-sm-4">
                <div class="text-caption text-grey-5">Média por disciplina</div>
                <div class="text-h5 q-mt-xs">
                  {{ quantidadeDisciplinasAvaliadas }}
                </div>
                <div class="text-caption text-grey-6 q-mt-xs">
                  Disciplinas com notas lançadas.
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>

      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <q-card class="dashboard-card q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle2">
                Média de notas por disciplina
              </div>
              <q-badge v-if="!mediasPorDisciplina.length" color="grey" outline>
                Sem dados
              </q-badge>
            </div>

            <div
              v-for="item in mediasPorDisciplina"
              :key="item.nome"
              class="q-mb-md"
            >
              <div class="row items-center justify-between q-mb-xs">
                <div class="text-caption">
                  {{ item.nome }}
                </div>
                <div class="text-caption text-grey-4">
                  {{ item.media.toFixed(2) }}
                </div>
              </div>

              <q-linear-progress
                :value="item.media / 10"
                rounded
                size="10px"
                color="accent"
                track-color="grey-9"
              />
            </div>

            <div
              v-if="mediasPorDisciplina.length === 0"
              class="text-caption text-grey-6 q-mt-md"
            >
              Ainda não há notas suficientes para montar o gráfico.
            </div>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card class="dashboard-card q-pa-md">
            <div class="row items-center justify-between q-mb-sm">
              <div class="text-subtitle2">
                Distribuição de alunos por turma
              </div>
              <q-badge v-if="!alunosPorTurma.length" color="grey" outline>
                Sem dados
              </q-badge>
            </div>

            <div
              v-for="turma in alunosPorTurma"
              :key="turma.nome"
              class="q-mb-md"
            >
              <div class="row items-center justify-between q-mb-xs">
                <div class="text-caption">
                  {{ turma.nome }}
                </div>
                <div class="text-caption text-grey-4">
                  {{ turma.quantidade }} aluno(s)
                  <span v-if="totalAlunos > 0">
                    • {{ turma.percentual.toFixed(1) }}%
                  </span>
                </div>
              </div>

              <q-linear-progress
                :value="turma.percentual / 100"
                rounded
                size="10px"
                color="primary"
                track-color="grey-9"
              />
            </div>

            <div
              v-if="alunosPorTurma.length === 0"
              class="text-caption text-grey-6 q-mt-md"
            >
              Cadastre turmas e vincule alunos para visualizar a distribuição.
            </div>
          </q-card>
        </div>
      </div>

      <q-card class="dashboard-card q-mt-md q-pa-md">
        <div class="row items-center justify-between q-mb-sm">
          <div class="text-subtitle2">
            Últimos lançamentos de notas
          </div>
          <q-badge
            v-if="notaStore.carregando"
            color="primary"
            outline
          >
            Carregando...
          </q-badge>
        </div>

        <q-table
          :rows="ultimasNotas"
          :columns="colunasNotas"
          row-key="id"
          flat
          class="dashboard-table"
          no-data-label="Nenhuma nota encontrada."
          hide-bottom
        />
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue'

import { useAlunoStore } from 'src/stores/aluno-store'
import { useProfessorStore } from 'src/stores/professor-store'
import { useDisciplinaStore } from 'src/stores/disciplina-store'
import { useTurmaStore } from 'src/stores/turma-store'
import { useNotaStore } from 'src/stores/nota-store'

const alunoStore = useAlunoStore()
const professorStore = useProfessorStore()
const disciplinaStore = useDisciplinaStore()
const turmaStore = useTurmaStore()
const notaStore = useNotaStore()

onMounted(async () => {
  await Promise.all([
    alunoStore.carregarTodos(),
    professorStore.carregarTodos(),
    disciplinaStore.carregarTodas(),
    turmaStore.carregarTodas(),
    notaStore.carregarTodas()
  ])
})

const totalAlunos = computed(() => alunoStore.lista.length)
const totalProfessores = computed(() => professorStore.lista.length)
const totalDisciplinas = computed(() => disciplinaStore.lista.length)
const totalTurmas = computed(() => turmaStore.lista.length)

const quantidadeNotas = computed(() => notaStore.lista.length)

const mediaGeralNotas = computed(() => {
  if (!notaStore.lista.length) return '--'
  const soma = notaStore.lista.reduce(
    (acc, n) => acc + Number(n.nota || 0),
    0
  )
  return (soma / notaStore.lista.length).toFixed(2)
})

const maiorNota = computed(() => {
  if (!notaStore.lista.length) return '--'
  const valores = notaStore.lista.map(n => Number(n.nota || 0))
  return Math.max(...valores).toFixed(2)
})

const menorNota = computed(() => {
  if (!notaStore.lista.length) return '--'
  const valores = notaStore.lista.map(n => Number(n.nota || 0))
  return Math.min(...valores).toFixed(2)
})

function obterNomeAluno (id) {
  const aluno = alunoStore.lista.find(a => String(a.id) === String(id))
  return aluno?.nome || id
}

function obterNomeDisciplina (id) {
  const disc = disciplinaStore.lista.find(d => String(d.id) === String(id))
  return disc?.nome || id
}

const mediasPorDisciplina = computed(() => {
  if (!notaStore.lista.length || !disciplinaStore.lista.length) return []

  const mapa = new Map()

  notaStore.lista.forEach(nota => {
    const idDisciplina = String(nota.disciplina_nome)
    const atual = mapa.get(idDisciplina) || { soma: 0, qtd: 0 }
    atual.soma += Number(nota.nota || 0)
    atual.qtd += 1
    mapa.set(idDisciplina, atual)
  })

  const resultado = []

  mapa.forEach((info, idDisciplina) => {
    const disc = disciplinaStore.lista.find(
      d => String(d.id) === idDisciplina
    )
    resultado.push({
      nome: disc?.nome || `Disciplina ${idDisciplina}`,
      media: info.soma / info.qtd
    })
  })

  return resultado.sort((a, b) => a.nome.localeCompare(b.nome))
})

const quantidadeDisciplinasAvaliadas = computed(
  () => mediasPorDisciplina.value.length
)

const alunosPorTurma = computed(() => {
  if (!turmaStore.lista.length) return []

  const total = turmaStore.lista.reduce((acc, turma) => {
    const qty = Array.isArray(turma.alunos_ids) ? turma.alunos_ids.length : 0
    return acc + qty
  }, 0)

  return turmaStore.lista.map(turma => {
    const quantidade = Array.isArray(turma.alunos_ids)
      ? turma.alunos_ids.length
      : 0

    const percentual = total > 0 ? (quantidade / total) * 100 : 0

    return {
      nome: turma.nome,
      quantidade,
      percentual
    }
  })
})

const colunasNotas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  {
    name: 'aluno_nome',
    label: 'Aluno',
    field: row => obterNomeAluno(row.aluno_nome),
    align: 'left'
  },
  {
    name: 'disciplina_nome',
    label: 'Disciplina',
    field: row => obterNomeDisciplina(row.disciplina_nome),
    align: 'left'
  },
  { name: 'nota', label: 'Nota', field: 'nota', align: 'center' },
  { name: 'data_avaliacao', label: 'Data', field: 'data_avaliacao', align: 'center' }
]

const ultimasNotas = computed(() => {
  if (!notaStore.lista.length) return []

  const arr = [...notaStore.lista]
  arr.sort((a, b) => {
    const da = new Date(a.data_avaliacao)
    const db = new Date(b.data_avaliacao)
    return db - da
  })
  return arr.slice(0, 5)
})
</script>

<style scoped>
.dashboard-page {
  display: flex;
  justify-content: center;
}

.dashboard-wrapper {
  width: 100%;
  max-width: 1250px;
  margin: 0 auto;
}

.dashboard-card {
  background: #1b1b28;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.summary-card {
  padding: 12px 16px;
}

.highlight-card {
  border: 1px solid rgba(129, 140, 248, 0.7);
  box-shadow: 0 0 18px rgba(129, 140, 248, 0.15);
}

.soft-card {
  background: #20202e;
}

.dashboard-table {
  background: transparent;
}
</style>
