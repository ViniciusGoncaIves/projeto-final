<template>
  <q-page class="q-pa-md">

    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 q-mb-md">
        Cadastro de Disciplinas
      </div>

      <q-banner
        v-if="disciplinaStore.erro"
        class="q-mb-md"
        dense
        rounded
        color="negative"
        text-color="white"
      >
        {{ disciplinaStore.erro }}
      </q-banner>

      <div class="row items-center q-gutter-sm q-mb-md">
        <q-btn
          label="Recarregar"
          icon="refresh"
          color="primary"
          @click="carregarDisciplinas"
          :loading="disciplinaStore.carregando"
        />

        <q-btn
          label="Nova disciplina"
          icon="add"
          color="positive"
          @click="novaDisciplina"
        />
      </div>

      <q-table
        title="Lista de disciplinas"
        :rows="disciplinaStore.lista"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        :loading="disciplinaStore.carregando"
        no-data-label="Nenhuma disciplina cadastrada."
      >
        <template #body-cell-acoes="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              round
              icon="edit"
              color="primary"
              @click="editarDisciplina(props.row)"
            />
            <q-btn
              flat
              dense
              round
              icon="delete"
              color="negative"
              class="q-ml-xs"
              @click="removerDisciplina(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogoVisivel" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="text-h6">
          {{ modoEdicao ? 'Editar disciplina' : 'Nova disciplina' }}
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="disciplinaEmEdicao.nome"
            label="Nome"
            dense
            outlined
          />
          <q-input
            v-model.number="disciplinaEmEdicao.carga_horaria"
            label="Carga horária"
            type="number"
            dense
            outlined
          />
          <q-input
            v-model="disciplinaEmEdicao.descricao"
            label="Descrição"
            type="textarea"
            autogrow
            dense
            outlined
          />
          <q-input
            v-model="disciplinaEmEdicao.professor_nome"
            label="Nome do professor"
            dense
            outlined
            hint="Digite o nome exatamente como cadastrado em Professores"
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
            :loading="disciplinaStore.carregando"
            @click="salvarDisciplina"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useDisciplinaStore } from 'src/stores/disciplina-store'

const disciplinaStore = useDisciplinaStore()

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'carga_horaria', label: 'Carga horária', field: 'carga_horaria', align: 'left' },
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'professor_nome', label: 'Professor', field: 'professor_nome', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

const dialogoVisivel = ref(false)
const modoEdicao = ref(false)

const disciplinaEmEdicao = reactive({
  id: null,
  nome: '',
  carga_horaria: null,
  descricao: '',
  professor_nome: ''
})

const limparDisciplinaEmEdicao = () => {
  disciplinaEmEdicao.id = null
  disciplinaEmEdicao.nome = ''
  disciplinaEmEdicao.carga_horaria = null
  disciplinaEmEdicao.descricao = ''
  disciplinaEmEdicao.professor_nome = ''
}

const carregarDisciplinas = async () => {
  await disciplinaStore.carregarTodas()
}

const novaDisciplina = () => {
  modoEdicao.value = false
  limparDisciplinaEmEdicao()
  dialogoVisivel.value = true
}

const editarDisciplina = (disciplina) => {
  modoEdicao.value = true
  disciplinaEmEdicao.id = disciplina.id
  disciplinaEmEdicao.nome = disciplina.nome
  disciplinaEmEdicao.carga_horaria = disciplina.carga_horaria
  disciplinaEmEdicao.descricao = disciplina.descricao
  disciplinaEmEdicao.professor_nome = disciplina.professor_nome

  dialogoVisivel.value = true
}

const salvarDisciplina = async () => {
  try {
    const payload = {
      nome: disciplinaEmEdicao.nome,
      carga_horaria: disciplinaEmEdicao.carga_horaria,
      descricao: disciplinaEmEdicao.descricao,
      professor_nome: disciplinaEmEdicao.professor_nome
    }

    if (modoEdicao.value) {
      await disciplinaStore.atualizarDisciplina(disciplinaEmEdicao.id, payload)
    } else {
      await disciplinaStore.criarDisciplina(payload)
    }

    dialogoVisivel.value = false
  } catch (erro) {
    console.error(erro)
  }
}

const removerDisciplina = async (id) => {
  try {
    await disciplinaStore.removerDisciplina(id)
  } catch (erro) {
    console.error(erro)
  }
}

onMounted(() => {
  carregarDisciplinas()
})
</script>
