<script setup>
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import NavbarHeader from '../components/NavbarHeader.vue'
  import SentenceItem from '../components/SentenceItem.vue'
  import ExplanationModal from '../components/ExplanationModal.vue'

  import { useModalStore } from '../store/modalStore'

  const sentences = ref([])
  const loading = ref(true)
  const error = ref(null)

  const languageCode = ref('de-DE') // defaults to German

  const languageCodesObj = {
    'German': { langCode: 'de-DE', tatoebaCode: 'deu' },
    'Japanese': { langCode: 'ja-JP', tatoebaCode: 'jpn' },
    'Portuguese': { langCode: 'pt-PT', tatoebaCode: 'por' },
    'Russian': { langCode: 'ru-RU', tatoebaCode: 'rus' },
    'Spanish': { langCode: 'es-ES', tatoebaCode: 'spa' },
  }

  const modalStore = useModalStore()

  const synth = window.speechSynthesis

  onMounted(async () => {
    try {
      const response = await fetchTatoebaSentences()
      console.log('type the data', response)
      sentences.value = response.data.results
    } catch (error) {
      console.error('Error fetching sentences:', error)
      error.value = error
    } finally {
      loading.value = false
    }
  })

  async function fetchTatoebaSentences(fromLanguage = 'deu') {
    try {
      const response = await axios.post('/api/sentences/', {
        from: fromLanguage,
      })

      return response.data
    } catch (error) {
      error.value = error
      throw new Error(`Error fetching sentences: ${error.message}`)
    }
  }

  async function handleLanguageSelected(selectedLanguage) {
    const codes = languageCodesObj[selectedLanguage] || languageCodesObj['German']
    languageCode.value = codes.langCode

    await fetchTatoebaSentences(codes.tatoebaCode)
  }
</script>

<template>
  <NavbarHeader @languageSelected="handleLanguageSelected" />

  <main class="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    <div class="text-center">

      <div v-if="loading" class="text-gray-600">Loading...</div>

      <ul v-if="sentences.length > 0" class="list-none mt-4">
        <h2 class="text-2xl font-bold mb-7">Random German Sentences</h2>

        <li v-for="sentence in sentences" :key="sentence.id" class="mb-4">
          <SentenceItem :sentence="sentence" :languageCode="languageCode" />
        </li>
      </ul>

      <div v-if="error" class="text-red-500 mt-4">Error fetching sentences</div>

      <ExplanationModal v-if="modalStore.modalOpen" />

    </div>
  </main>
</template>