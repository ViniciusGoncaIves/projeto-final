<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="q-pa-md">

      <div class="row items-center justify-between q-mb-md">
        <div class="text-h6">Cadastro de Notas</div>

        <div class="row q-gutter-sm items-center">
          <q-input
            v-model="filtro"
            dense
            outlined
            debounce="300"
            placeholder="Pesquisar notas..."
            class="q-mr-sm"
            clearable
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>

          <q-btn
            label="Recarregar"
            icon="refresh"
            color="primary"
            @click="carregarDados"
            :loading="notaStore.carregando"
          />

          <q-btn
            label="Nova nota"
            icon="add"
            color="positive"
            @click="novaNota"
          />
        </div>
      </div>

      <q-banner
        v-if="notaStore.erro"
        dense
        rounded
        class="q-mb-md"
        color="negative"
        text-color="white"
      >
        {{ notaStore.erro }}
      </q-banner>

      <q-table
        title="Lista de notas"
        :rows="notaStore.lista"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        :filter="filtro"
        no-data-label="Nenhuma nota encontrada."
      >
        <template #body-cell-acoes="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              round
              icon="edit"
              color="primary"
              @click="editarNota(props.row)"
            />
            <q-btn
              flat
              dense
              round
              icon="delete"
              color="negative"
              class="q-ml-xs"
              @click="removerNota(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogoVisivel" persistent>
      <q-card style="min-width: 480px">
        <q-card-section class="text-h6">
          {{ modoEdicao ? 'Editar nota' : 'Nova nota' }}
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-select
            v-model="notaEmEdicao.aluno_nome"
            :options="opcoesAlunos"
            label="Aluno"
            dense
            outlined
            emit-value
            map-options
            use-input
            fill-input
            input-debounce="0"
            :loading="alunoStore.carregando"
            hint="Selecione um aluno já cadastrado"
            clearable
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Nenhum aluno encontrado.
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-select
            v-model="notaEmEdicao.disciplina_nome"
            :options="opcoesDisciplinas"
            label="Disciplina"
            dense
            outlined
            emit-value
            map-options
            use-input
            fill-input
            input-debounce="0"
            :loading="disciplinaStore.carregando"
            hint="Selecione uma disciplina já cadastrada"
            clearable
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Nenhuma disciplina encontrada.
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-input
            v-model.number="notaEmEdicao.nota"
            label="Nota"
            type="number"
            dense
            outlined
            :min="0"
            :max="10"
            step="0.25"
          />

          <q-input
            v-model="notaEmEdicao.data_avaliacao"
            label="Data da avaliação"
            type="date"
            dense
            outlined
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
            :loading="notaStore.carregando"
            @click="salvarNota"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useNotaStore } from 'src/stores/nota-store'
import { useAlunoStore } from 'src/stores/aluno-store'
import { useDisciplinaStore } from 'src/stores/disciplina-store'

const notaStore = useNotaStore()
const alunoStore = useAlunoStore()
const disciplinaStore = useDisciplinaStore()

const filtro = ref('')

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  {
    name: 'aluno_nome',
    label: 'Aluno',
    field: row => obterNomeAluno(row.aluno_nome),
    align: 'left',
    sortable: true
  },
  {
    name: 'disciplina_nome',
    label: 'Disciplina',
    field: row => obterNomeDisciplina(row.disciplina_nome),
    align: 'left',
    sortable: true
  },
  { name: 'nota', label: 'Nota', field: 'nota', align: 'center', sortable: true },
  {
    name: 'data_avaliacao',
    label: 'Data',
    field: 'data_avaliacao',
    align: 'center',
    sortable: true
  },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

const dialogoVisivel = ref(false)
const modoEdicao = ref(false)

const notaEmEdicao = reactive({
  id: null,
  aluno_nome: null,        
  disciplina_nome: null,   
  nota: null,
  data_avaliacao: ''
})

const opcoesAlunos = computed(() =>
  alunoStore.lista.map(a => ({
    label: a.nome,
    value: a.id
  }))
)

const opcoesDisciplinas = computed(() =>
  disciplinaStore.lista.map(d => ({
    label: d.nome,
    value: d.id
  }))
)

function obterNomeAluno (id) {
  const aluno = alunoStore.lista.find(a => String(a.id) === String(id))
  return aluno?.nome || id
}

function obterNomeDisciplina (id) {
  const disc = disciplinaStore.lista.find(d => String(d.id) === String(id))
  return disc?.nome || id
}

const limparNota = () => {
  notaEmEdicao.id = null
  notaEmEdicao.aluno_nome = null
  notaEmEdicao.disciplina_nome = null
  notaEmEdicao.nota = null
  notaEmEdicao.data_avaliacao = ''
}

const carregarDados = async () => {
  await Promise.all([
    notaStore.carregarTodas(),
    alunoStore.carregarTodos(),
    disciplinaStore.carregarTodas()
  ])
}

const novaNota = () => {
  modoEdicao.value = false
  limparNota()
  dialogoVisivel.value = true
}

const editarNota = (nota) => {
  modoEdicao.value = true
  notaEmEdicao.id = nota.id
  notaEmEdicao.aluno_nome = nota.aluno_nome
  notaEmEdicao.disciplina_nome = nota.disciplina_nome
  notaEmEdicao.nota = nota.nota
  notaEmEdicao.data_avaliacao = nota.data_avaliacao
  dialogoVisivel.value = true
}

const salvarNota = async () => {
  try {
    const payload = {
      aluno_nome: notaEmEdicao.aluno_nome,
      disciplina_nome: notaEmEdicao.disciplina_nome,
      nota: notaEmEdicao.nota,
      data_avaliacao: notaEmEdicao.data_avaliacao
    }

    if (modoEdicao.value && notaEmEdicao.id != null) {
      await notaStore.atualizarNota(notaEmEdicao.id, payload)
    } else {
      await notaStore.criarNota(payload)
    }

    dialogoVisivel.value = false
    await notaStore.carregarTodas()
  } catch (erro) {
    console.error(erro)
  }
}

const removerNota = async (id) => {
  try {
    await notaStore.removerNota(id)
  } catch (erro) {
    console.error(erro)
  }
}

onMounted(() => {
  carregarDados()
})
</script>
