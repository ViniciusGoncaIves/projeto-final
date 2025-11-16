<template>
  <q-page class="q-pa-md">

    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 q-mb-md">
        Cadastro de Professores
      </div>

      <q-banner
        v-if="professorStore.erro"
        class="q-mb-md"
        dense
        rounded
        color="negative"
        text-color="white"
      >
        {{ professorStore.erro }}
      </q-banner>

      <div class="row items-center q-gutter-sm q-mb-md">
        <q-btn
          label="Recarregar"
          icon="refresh"
          color="primary"
          @click="carregarProfessores"
          :loading="professorStore.carregando"
        />

        <q-btn
          label="Novo professor"
          icon="add"
          color="positive"
          @click="novoProfessor"
        />
      </div>

      <q-table
        title="Lista de professores"
        :rows="professorStore.lista"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        :loading="professorStore.carregando"
        no-data-label="Nenhum professor cadastrado."
      >
        <template #body-cell-acoes="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              round
              icon="edit"
              color="primary"
              @click="editarProfessor(props.row)"
            />
            <q-btn
              flat
              dense
              round
              icon="delete"
              color="negative"
              class="q-ml-xs"
              @click="removerProfessor(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogoVisivel" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="text-h6">
          {{ modoEdicao ? 'Editar professor' : 'Novo professor' }}
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="professorEmEdicao.nome"
            label="Nome"
            dense
            outlined
          />
          <q-input
            v-model="professorEmEdicao.cpf"
            label="CPF"
            dense
            outlined
          />
          <q-input
            v-model="professorEmEdicao.email"
            label="E-mail"
            dense
            outlined
          />
          <q-input
            v-model="professorEmEdicao.telefone"
            label="Telefone"
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
            :loading="professorStore.carregando"
            @click="salvarProfessor"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useProfessorStore } from 'src/stores/professor-store'

const professorStore = useProfessorStore()

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

const dialogoVisivel = ref(false)
const modoEdicao = ref(false)

const professorEmEdicao = reactive({
  id: null,
  nome: '',
  cpf: '',
  email: '',
  telefone: ''
})

const limparProfessorEmEdicao = () => {
  professorEmEdicao.id = null
  professorEmEdicao.nome = ''
  professorEmEdicao.cpf = ''
  professorEmEdicao.email = ''
  professorEmEdicao.telefone = ''
}

const carregarProfessores = async () => {
  await professorStore.carregarTodos()
}

const novoProfessor = () => {
  modoEdicao.value = false
  limparProfessorEmEdicao()
  dialogoVisivel.value = true
}

const editarProfessor = (professor) => {
  modoEdicao.value = true
  professorEmEdicao.id = professor.id
  professorEmEdicao.nome = professor.nome
  professorEmEdicao.cpf = professor.cpf
  professorEmEdicao.email = professor.email
  professorEmEdicao.telefone = professor.telefone

  dialogoVisivel.value = true
}

const salvarProfessor = async () => {
  try {
    const payload = {
      nome: professorEmEdicao.nome,
      cpf: professorEmEdicao.cpf,
      email: professorEmEdicao.email,
      telefone: professorEmEdicao.telefone
    }

    if (modoEdicao.value) {
      await professorStore.atualizarProfessor(professorEmEdicao.id, payload)
    } else {
      await professorStore.criarProfessor(payload)
    }

    dialogoVisivel.value = false
  } catch (erro) {
    console.error(erro)
  }
}

const removerProfessor = async (id) => {
  try {
    await professorStore.removerProfessor(id)
  } catch (erro) {
    console.error(erro)
  }
}

onMounted(() => {
  carregarProfessores()
})
</script>
