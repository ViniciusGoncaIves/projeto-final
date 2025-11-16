<template>
  <q-page class="q-pa-md">

    <q-card flat bordered class="q-pa-md">
      <div class="text-h6 q-mb-md">
        Lançamento de Notas
      </div>

      <q-banner
        v-if="notaStore.erro"
        class="q-mb-md"
        dense
        rounded
        color="negative"
        text-color="white"
      >
        {{ notaStore.erro }}
      </q-banner>

      <div class="row items-center q-gutter-sm q-mb-md">
        <q-btn
          label="Recarregar"
          icon="refresh"
          color="primary"
          @click="carregarNotas"
          :loading="notaStore.carregando"
        />

        <q-btn
          label="Nova nota"
          icon="add"
          color="positive"
          @click="novaNota"
        />
      </div>

      <q-table
        title="Lista de notas"
        :rows="notaStore.lista"
        :columns="colunas"
        row-key="id"
        flat
        bordered
        :loading="notaStore.carregando"
        no-data-label="Nenhuma nota lançada."
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
      <q-card style="min-width: 500px">
        <q-card-section class="text-h6">
          {{ modoEdicao ? 'Editar nota' : 'Nova nota' }}
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input
            v-model="notaEmEdicao.aluno_nome"
            label="Nome do aluno"
            dense
            outlined
          />

          <q-input
            v-model="notaEmEdicao.disciplina_nome"
            label="Nome da disciplina"
            dense
            outlined
          />

          <q-input
            v-model.number="notaEmEdicao.nota"
            label="Nota"
            type="number"
            dense
            outlined
            :min="0"
            :max="10"
            step="0.1"
          />

          <q-input
            v-model="notaEmEdicao.data_avaliacao"
            label="Data da avaliação"
            dense
            outlined
            mask="####-##-##"
            hint="Formato: AAAA-MM-DD"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date
                    v-model="notaEmEdicao.data_avaliacao"
                    mask="YYYY-MM-DD"
                  />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
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
import { onMounted, reactive, ref } from 'vue'
import { useNotaStore } from 'src/stores/nota-store'

const notaStore = useNotaStore()

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'aluno_nome', label: 'Aluno', field: 'aluno_nome', align: 'left', sortable: true },
  { name: 'disciplina_nome', label: 'Disciplina', field: 'disciplina_nome', align: 'left', sortable: true },
  { name: 'nota', label: 'Nota', field: 'nota', align: 'center', sortable: true },
  { name: 'data_avaliacao', label: 'Data', field: 'data_avaliacao', align: 'center', sortable: true },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
]

const dialogoVisivel = ref(false)
const modoEdicao = ref(false)

const notaEmEdicao = reactive({
  id: null,
  aluno_nome: '',
  disciplina_nome: '',
  nota: null,
  data_avaliacao: ''
})

const limparNotaEmEdicao = () => {
  notaEmEdicao.id = null
  notaEmEdicao.aluno_nome = ''
  notaEmEdicao.disciplina_nome = ''
  notaEmEdicao.nota = null
  notaEmEdicao.data_avaliacao = ''
}

const carregarNotas = async () => {
  await notaStore.carregarTodas()
}

const novaNota = () => {
  modoEdicao.value = false
  limparNotaEmEdicao()
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
    await carregarNotas()
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
  carregarNotas()
})
</script>
