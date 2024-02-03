<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import axios, { AxiosResponse } from 'axios';
  import NavbarHeader from '../components/NavbarHeader.vue'
  import SentenceItem from '../components/SentenceItem.vue'
  import ExplanationModal from '../components/ExplanationModal.vue'
  import { type TatoebaType, Result } from '../interface/TatoebaType'

  import { useModalStore } from '../store/modalStore'

  const sentences = ref<Result[]>([]);
  const loading = ref<boolean>(true)
  const error = ref(null)

  // defaults to German
  const languageCode = ref<string>('de-DE') 
  const currentLanguage = ref<string>('German') 

  const languageCodesObj = {
    'German': { langCode: 'de-DE', tatoebaCode: 'deu' },
    'Japanese': { langCode: 'ja-JP', tatoebaCode: 'jpn' },
    'Portuguese': { langCode: 'pt-PT', tatoebaCode: 'por' },
    'Russian': { langCode: 'ru-RU', tatoebaCode: 'rus' },
    'Spanish': { langCode: 'es-ES', tatoebaCode: 'spa' },
  }

  const modalStore = useModalStore()

  onMounted(async () => {
    try {
      await fetchTatoebaApi()
    } catch (error) {
      console.error('Error fetching sentences:', error)
      error.value = error
    } finally {
      loading.value = false
    }
  })

  async function fetchTatoebaApi(fromLanguage = 'deu') {
    const response = await fetchTatoebaSentences(fromLanguage)
    console.log('res data', response.data)
    sentences.value = response.data.results
  }

  async function fetchTatoebaSentences(fromLanguage): Promise<TatoebaType> {
    try {
      const response = await axios.post('/api/sentences/', {
        from: fromLanguage,
      }) as AxiosResponse<TatoebaType>

      return response.data
    } catch (error) {
      error.value = error
      throw new Error(`Error fetching sentences: ${error.message}`)
    }
  }

  async function handleLanguageSelected(selectedLanguage: string) {
    if (currentLanguage.value === selectedLanguage) return

    sentences.value = [] // reset
    loading.value = true

    const codes = languageCodesObj[selectedLanguage] || languageCodesObj['German']

    languageCode.value = codes.langCode
    currentLanguage.value = selectedLanguage

    await fetchTatoebaApi(codes.tatoebaCode)
  }
</script>

<template>
  <NavbarHeader @languageSelected="handleLanguageSelected" />

  <main class="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    <div class="text-center">

      <div v-if="loading" class="text-gray-600">Loading...</div>

      <ul v-if="sentences.length > 0" class="list-none mt-4">
        <h2 class="text-2xl font-bold mb-7">Random {{ currentLanguage }} Sentences</h2>

        <li v-for="sentence in sentences" :key="sentence.id" class="mb-4">
          <SentenceItem :sentence="sentence" :languageCode="languageCode" />
        </li>
      </ul>

      <div v-if="error" class="text-red-500 mt-4">Error fetching sentences</div>

      <ExplanationModal v-if="modalStore.modalOpen" />

    </div>
  </main>
</template>