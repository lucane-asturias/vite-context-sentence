<script setup>
  import { ref, onMounted } from 'vue'
  import { onClickOutside } from '@vueuse/core'

  const emit = defineEmits(['languageSelected'])
  const props = defineProps(['currentLanguage'])

  const dropdownRef = ref(null)

  const showDropdown = ref(false)
  const selectedLanguage = ref('German')

  const dropdownItems = [
    { language: 'German', flagCode: 'de', handler: (item) => handleDropdownItemClick('German', item) },
    { language: 'Japanese', flagCode: 'jp', handler: (item) => handleDropdownItemClick('Japanese', item) },
    { language: 'Russian', flagCode: 'ru', handler: (item) => handleDropdownItemClick('Russian', item) },
    { language: 'Estonian', flagCode: 'ee', handler: (item) => handleDropdownItemClick('Estonian', item) },
    { language: 'Portuguese', flagCode: 'br', handler: (item) => handleDropdownItemClick('Portuguese', item) },
    { language: 'Spanish', flagCode: 'es', handler: (item) => handleDropdownItemClick('Spanish', item) }
  ]

  onClickOutside(dropdownRef, (event) => showDropdown.value = false)

  function toggleDropdown() {
    showDropdown.value = !showDropdown.value
  }

  function handleDropdownItemClick(language, item) {
    selectedLanguage.value = item.language

    // Emit with the selected language
    console.log(`Selected language: ${language}`)
    emit('languageSelected', language)

    selectedLanguage.value = language

    // Close the dropdown
    showDropdown.value = false
  }
</script>

<template>
  <nav class="bg-gray-800 p-2.5 flex items-center justify-center" ref="navbar">
    <!-- Project Name -->
    <div class="text-white font-bold text-xl mr-4">Learn</div>

    <!-- Language Dropdown -->
    <div class="relative inline-block text-left" @click="toggleDropdown">
      <div>
        <button
          type="button"
          class="
            w-full inline-flex justify-center rounded-md border border-gray-500 shadow-sm
            px-4 py-2 bg-gray-700 text-lg font-medium text-white
            hover:bg-gray-600 active:bg-gray-700 focus:outline-none
          "
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
          ref="dropdownRef"
        >
          {{ selectedLanguage ? selectedLanguage : "Languages" }}
        </button>
      </div>

      <!-- Dropdown Content -->
      <div role="menu" 
        v-show="showDropdown"
        aria-orientation="vertical" aria-labelledby="options-menu"
        @click.stop="handleDropdownClick"
        class="
          origin-top-right absolute -right-3 mt-2 w-32 rounded-md shadow-lg bg-gray-800
          focus:ring-transparent ring-opacity-5 focus:outline-none py-1 space-y-2
        "
      >
        <template v-for="(item, index) in dropdownItems" :key="item.language">
          <div role="menuitem"
            class="
              flex items-center justify-center hover:bg-gray-600
              active:bg-gray-700 cursor-pointer
            "
            :class="{ 'bg-gray-700': item.language === selectedLanguage }"
            @click="item.handler(item)"
          >
            <span :class="`fi fi-${item.flagCode} h-8 w-8 mr-2 p-9 rounded-2xl`" :title="item.language" />
          </div>
        </template>
      </div>

    </div>

    <div class="ml-3 text-white font-bold text-xl mr-4">by context</div>
  </nav>
</template>