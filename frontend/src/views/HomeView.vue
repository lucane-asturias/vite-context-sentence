<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import axios, { AxiosResponse } from 'axios'
  import NavbarHeader from '../components/NavbarHeader.vue'
  import SentenceItem from '../components/SentenceItem.vue'
  import ExplanationModal from '../components/ExplanationModal.vue'
  import { type TatoebaType, Result } from '../interface/TatoebaType'

  import { useModalStore } from '../store/modalStore'

  const sentences = ref<Result[]>([]);
  const loading = ref<boolean>(false)
  const errorMsg = ref('')

  const inSubmission = ref<boolean>(false)

  // defaults to German
  const currentTatoebaCode = ref<string>('deu') 
  const currentLanguage = ref<string>('German') 

  const languageCodesObj = {
    'German': { langCode: 'de-DE', tatoebaCode: 'deu' },
    'Japanese': { langCode: 'ja-JP', tatoebaCode: 'jpn' },
    'Russian': { langCode: 'ru-RU', tatoebaCode: 'rus' },
    'Estonian': { langCode: 'et-EE', tatoebaCode: 'est' },
    'Portuguese': { langCode: 'pt-PT', tatoebaCode: 'por' },
    'Spanish': { langCode: 'es-ES', tatoebaCode: 'spa' },
  }

  const modalStore = useModalStore()

  onMounted(async () => await fetchTatoebaApi())

  function getSentencesFromLocalStorage(): Result[] {
    const storedSentences = localStorage.getItem('sentences')
    return storedSentences ? JSON.parse(storedSentences) : []
  }

  function saveSentencesToLocalStorage(sentences: Result[]) {
    localStorage.setItem('sentences', JSON.stringify(sentences));
  }

  async function fetchTatoebaApi(fromLanguage = 'deu', hasAudio = 'yes') {
    // Fetch sentences from local storage or API
    const fetchedSentences: Result[] = getSentencesFromLocalStorage().length
      ? getSentencesFromLocalStorage()
      : (await fetchTatoebaSentences(fromLanguage, hasAudio)).data.results
    // Add sentences in local storage
    if (!getSentencesFromLocalStorage().length) saveSentencesToLocalStorage(fetchedSentences)

    currentLanguage.value = fetchedSentences[0].lang_name
    sentences.value = fetchedSentences
  }

  async function fetchTatoebaSentences(fromLanguage, hasAudio): Promise<TatoebaType> {
    if (navigator.onLine) {
      try {
        const response = await axios.post('/api/sentences/', {
          from: fromLanguage,
          has_audio: hasAudio
        }) as AxiosResponse<TatoebaType>

        return response.data
      } catch (error) {
        errorMsg.value = "There was a problem with the server. Contact admin."
        console.log(`Error fetching sentences: ${error.message}`)
      } finally {
        loading.value = false
      }
    } else {
      alert('Browser is offline')
    }
  }

  async function handleLanguageSelected(selectedLanguage: string) {
    if (currentLanguage.value === selectedLanguage) return

    loading.value = true

    const codes = languageCodesObj[selectedLanguage] || languageCodesObj['German']

    currentTatoebaCode.value = codes.tatoebaCode

    resetSentences()

    // No audio for Estonian
    if (selectedLanguage === 'Estonian') await fetchTatoebaApi(codes.tatoebaCode, 'no')
    else await fetchTatoebaApi(codes.tatoebaCode)
  }


  async function refreshSentences() {
    resetSentences()
    loading.value = true
    inSubmission.value = true
    await fetchTatoebaApi(currentTatoebaCode.value)
    inSubmission.value = false
  }

  function resetSentences() {
    sentences.value = []
    localStorage.clear()
  }
</script>

<template>
  <NavbarHeader @languageSelected="handleLanguageSelected" />

  <main class="flex items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    <div class="text-center">

      <div v-if="loading" class="text-2xl text-gray-300 mb-20 animate-pulse">Loading necessary resources...</div>

      <ul v-else-if="sentences.length > 0" class="list-none">
        <h2 class="text-2xl font-bold mt-4 mb-8">Random {{ currentLanguage }} Sentences</h2>
        <!-- Sentences -->
        <li v-for="sentence in sentences" :key="sentence.id" class="mb-4">
          <SentenceItem :sentence="sentence" />
        </li>
        <!-- Refresh Sentences Button -->
        <div class="text-gray-500">
          <button @click="refreshSentences" :disabled="inSubmission" class="
            bg-gray-700 border border-gray-500 shadow-sm opacity-20
            flex items-center justify-center
            hover:opacity-100 hover:text-gray-400 hover:bg-gray-600 focus:outline-none active:bg-gray-700
            relative group
          ">
            <svg 
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-12 h-12 text-slate-100 opacity-100"
            >
              <path 
                stroke-linecap="round"
                stroke-linejoin="round"
                d="
                  M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25
                  8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
              />
            </svg>
             <!-- Tooltip -->
            <span class="
              absolute bottom-full left-1/2 transform -translate-x-1/2
              opacity-0 group-hover:opacity-100 transition-opacity duration-200
              bg-gray-800 text-white text-sm px-3 py-2 rounded-md mb-4 cursor-text select-text
            ">Refresh Sentences 
            </span>
          </button>
        </div>

      </ul>

      <div v-if="errorMsg.length" class="w-[800px] bg-red-500 text-2xl text-slate-100 p-2 mt-4 rounded mb-20" v-text="errorMsg" />

      <ExplanationModal v-if="modalStore.modalOpen" />

    </div>
  </main>
</template>

<style lang="css" scoped>

button {
  border-radius: 100%;
  bottom: 40px;
  height: 80px;
  position: fixed;
  right: 40px;
  width: 80px;
}

</style>