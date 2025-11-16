<template>
  <q-page class="q-pa-md">

    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 q-mb-md">
        Cadastro de Alunos
      </div>

      <q-banner
        v-if="alunoStore.erro"
        class="q-mb-md"
        dense
        rounded
        color="negative"
        text-color="white"
      >
        {{ alunoStore.erro }}
      </q-banner>

      <div class="row items-center q-gutter-sm q-mb-md">
        <q-btn
          label="Recarregar"
          icon="refresh"
          color="primary"
          @click="carregarAlunos"
          :loading="alunoStore.carregando"
        />

        <q-btn
          label="Novo aluno"
          icon="add"
          color="positive"
          @click="novoAluno"
        />
      </div>

      <q-table
        title="Lista de alunos"
        :rows="alunoStore.lista"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        :loading="alunoStore.carregando"
        no-data-label="Nenhum aluno cadastrado."
      >
        <template #body-cell-acoes="props">
          <q-td :props="props">
            <q-btn
              flat
              dense
              round
              icon="edit"
              color="primary"
              @click="editarAluno(props.row)"
            />
            <q-btn
              flat
              dense
              round
              icon="delete"
              color="negative"
              class="q-ml-xs"
              @click="removerAluno(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialogoEdicaoVisivel" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="text-h6">
          {{ modoEdicao ? 'Editar aluno' : 'Novo aluno' }}
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="alunoEmEdicao.nome"
            label="Nome"
            dense
            outlined
          />
          <q-input
            v-model="alunoEmEdicao.cpf"
            label="CPF"
            dense
            outlined
          />
          <q-input
            v-model="alunoEmEdicao.data_nascimento"
            label="Data de Nascimento"
            dense
            outlined
            hint="Formato: AAAA-MM-DD"
          />
          <q-input
            v-model="alunoEmEdicao.email"
            label="E-mail"
            dense
            outlined
          />
          <q-input
            v-model="alunoEmEdicao.telefone"
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
            :loading="alunoStore.carregando"
            @click="salvarAluno"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useAlunoStore } from 'src/stores/aluno-store'

const alunoStore = useAlunoStore()

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'cpf', label: 'CPF', field: 'cpf', align: 'left' },
  { name: 'data_nascimento', label: 'Data de Nascimento', field: 'data_nascimento', align: 'left' },
  { name: 'email', label: 'E-mail', field: 'email', align: 'left' },
  { name: 'telefone', label: 'Telefone', field: 'telefone', align: 'left' },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

const dialogoEdicaoVisivel = ref(false)
const modoEdicao = ref(false) 

const alunoEmEdicao = reactive({
  id: null,
  nome: '',
  cpf: '',
  data_nascimento: '',
  email: '',
  telefone: ''
})

const limparAlunoEmEdicao = () => {
  alunoEmEdicao.id = null
  alunoEmEdicao.nome = ''
  alunoEmEdicao.cpf = ''
  alunoEmEdicao.data_nascimento = ''
  alunoEmEdicao.email = ''
  alunoEmEdicao.telefone = ''
}

const carregarAlunos = async () => {
  await alunoStore.carregarTodos()
}

const novoAluno = () => {
  modoEdicao.value = false
  limparAlunoEmEdicao()
  dialogoEdicaoVisivel.value = true
}

const editarAluno = (aluno) => {
  modoEdicao.value = true
  alunoEmEdicao.id = aluno.id
  alunoEmEdicao.nome = aluno.nome
  alunoEmEdicao.cpf = aluno.cpf
  alunoEmEdicao.data_nascimento = aluno.data_nascimento
  alunoEmEdicao.email = aluno.email
  alunoEmEdicao.telefone = aluno.telefone

  dialogoEdicaoVisivel.value = true
}

const salvarAluno = async () => {
  try {
    const payload = {
      nome: alunoEmEdicao.nome,
      cpf: alunoEmEdicao.cpf,
      data_nascimento: alunoEmEdicao.data_nascimento,
      email: alunoEmEdicao.email,
      telefone: alunoEmEdicao.telefone
    }

    if (modoEdicao.value) {
      await alunoStore.atualizarAluno(alunoEmEdicao.id, payload)
    } else {
      await alunoStore.criarAluno(payload)
    }

    dialogoEdicaoVisivel.value = false
  } catch (erro) {
    console.error(erro)
  }
}

const removerAluno = async (id) => {
  try {
    await alunoStore.removerAluno(id)
  } catch (erro) {
    console.error(erro)
  }
}

onMounted(() => {
  carregarAlunos()
})
</script>
