<!-- src/pages/CadastroTurmaPage.vue -->
<template>
  <q-page class="q-pa-md">

    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 q-mb-md">
        Cadastro de Turmas
      </div>

      <!-- Erro -->
      <q-banner
        v-if="turmaStore.erro"
        class="q-mb-md"
        dense
        rounded
        color="negative"
        text-color="white"
      >
        {{ turmaStore.erro }}
      </q-banner>

      <!-- Ações -->
      <div class="row items-center q-gutter-sm q-mb-md">
        <q-btn
          label="Recarregar"
          icon="refresh"
          color="primary"
          @click="carregarDados"
          :loading="turmaStore.carregando || alunoStore.carregando"
        />

        <q-btn
          label="Nova turma"
          icon="add"
          color="positive"
          @click="novaTurma"
        />
      </div>

      <!-- Tabela de turmas -->
      <q-table
        title="Lista de turmas"
        :rows="turmaStore.lista"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        :loading="turmaStore.carregando"
        no-data-label="Nenhuma turma cadastrada."
      >
        <template #body-cell-quantidade_alunos="props">
          <q-td :props="props">
            {{ Array.isArray(props.row.alunos_ids) ? props.row.alunos_ids.length : 0 }}
          </q-td>
        </template>

        <template #body-cell-acoes="props">
          <q-td :props="props">
            <!-- Ver (master-detail em popup) -->
            <q-btn
              flat
              dense
              round
              icon="visibility"
              color="primary"
              @click="abrirDetalheTurma(props.row)"
            />
            <!-- Editar turma -->
            <q-btn
              flat
              dense
              round
              icon="edit"
              color="primary"
              class="q-ml-xs"
              @click="editarTurma(props.row)"
            />
            <!-- Excluir turma -->
            <q-btn
              flat
              dense
              round
              icon="delete"
              color="negative"
              class="q-ml-xs"
              @click="removerTurma(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Dialog de nova/edição de turma -->
    <q-dialog v-model="dialogoEdicaoVisivel" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="text-h6">
          {{ modoEdicao ? 'Editar turma' : 'Nova turma' }}
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="turmaEmEdicao.nome"
            label="Nome da turma"
            dense
            outlined
          />

          <q-select
            v-model="turmaEmEdicao.alunos_ids"
            :options="alunoStore.optionsParaSelect"
            label="Alunos da turma"
            dense
            outlined
            multiple
            emit-value
            map-options
            use-chips
            hint="Selecione os alunos que pertencem a esta turma"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="negative"
            v-close-popup
          />
          <q-btn
            flat
            label="Salvar"
            color="primary"
            :loading="turmaStore.carregando"
            @click="salvarTurma"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog de master-detail: detalhe da turma + alunos -->
    <q-dialog v-model="dialogoDetalheVisivel" persistent>
      <q-card style="min-width: 600px; max-width: 90vw;">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">
            Detalhes da turma
          </div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div v-if="turmaSelecionada">
            <div class="q-mb-sm">
              <div class="text-subtitle1">
                {{ turmaSelecionada.nome }}
              </div>
              <div class="text-caption text-grey-7">
                ID: {{ turmaSelecionada.id }}
              </div>
            </div>

            <q-separator spaced />

            <div class="text-subtitle2 q-mb-sm">
              Alunos desta turma
            </div>

            <div v-if="alunosDaTurma.length === 0" class="text-grey-7">
              Nenhum aluno vinculado a esta turma.
            </div>

            <q-list v-else bordered separator>
              <q-item v-for="aluno in alunosDaTurma" :key="aluno.id">
                <q-item-section>
                  <q-item-label class="text-body1">
                    {{ aluno.nome }}
                  </q-item-label>
                  <q-item-label caption>
                    CPF: {{ aluno.cpf || 'Não informado' }}
                  </q-item-label>
                  <q-item-label caption>
                    Data de nascimento: {{ aluno.data_nascimento || 'Não informado' }}
                  </q-item-label>
                  <q-item-label caption>
                    E-mail: {{ aluno.email || 'Não informado' }}
                  </q-item-label>
                  <q-item-label caption>
                    Telefone: {{ aluno.telefone || 'Não informado' }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
          <div v-else class="text-grey-7">
            Nenhuma turma selecionada.
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useTurmaStore } from 'src/stores/turma-store'
import { useAlunoStore } from 'src/stores/aluno-store'

const turmaStore = useTurmaStore()
const alunoStore = useAlunoStore()

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  {
    name: 'quantidade_alunos',
    label: 'Qtd. alunos',
    field: row => Array.isArray(row.alunos_ids) ? row.alunos_ids.length : 0,
    align: 'center'
  },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

const dialogoEdicaoVisivel = ref(false)
const dialogoDetalheVisivel = ref(false)
const modoEdicao = ref(false)

const turmaEmEdicao = reactive({
  id: null,
  nome: '',
  alunos_ids: []
})

const turmaSelecionada = ref(null)

const alunosDaTurma = computed(() => {
  if (!turmaSelecionada.value || !Array.isArray(turmaSelecionada.value.alunos_ids)) {
    return []
  }
  const ids = turmaSelecionada.value.alunos_ids
  return alunoStore.lista.filter(a => ids.includes(a.id))
})

const limparTurmaEmEdicao = () => {
  turmaEmEdicao.id = null
  turmaEmEdicao.nome = ''
  turmaEmEdicao.alunos_ids = []
}

const carregarDados = async () => {
  await Promise.all([
    turmaStore.carregarTodas(),
    alunoStore.carregarTodos()
  ])
}

const novaTurma = () => {
  modoEdicao.value = false
  limparTurmaEmEdicao()
  dialogoEdicaoVisivel.value = true
}

const editarTurma = (turma) => {
  modoEdicao.value = true
  turmaEmEdicao.id = turma.id
  turmaEmEdicao.nome = turma.nome
  turmaEmEdicao.alunos_ids = Array.isArray(turma.alunos_ids)
    ? [...turma.alunos_ids]
    : []
  dialogoEdicaoVisivel.value = true
}

const salvarTurma = async () => {
  try {
    const payload = {
      nome: turmaEmEdicao.nome,
      alunos_ids: turmaEmEdicao.alunos_ids
    }

    if (modoEdicao.value && turmaEmEdicao.id != null) {
      await turmaStore.atualizarTurma(turmaEmEdicao.id, payload)
    } else {
      await turmaStore.criarTurma(payload)
    }

    dialogoEdicaoVisivel.value = false
    await turmaStore.carregarTodas()
  } catch (erro) {
    console.error(erro)
  }
}

const removerTurma = async (id) => {
  try {
    await turmaStore.removerTurma(id)
    if (turmaSelecionada.value && turmaSelecionada.value.id === id) {
      turmaSelecionada.value = null
    }
  } catch (erro) {
    console.error(erro)
  }
}

const abrirDetalheTurma = (turma) => {
  turmaSelecionada.value = turma
  dialogoDetalheVisivel.value = true
}

onMounted(() => {
  carregarDados()
})
</script>
