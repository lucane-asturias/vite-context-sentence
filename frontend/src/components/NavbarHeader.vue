<script setup>
  import { ref, onMounted } from 'vue'
  import { onClickOutside } from '@vueuse/core'

  const emit = defineEmits(['languageSelected'])

  const dropdownRef = ref(null)

  const showDropdown = ref(false)
  const selectedLanguage = ref('')

  onClickOutside(dropdownRef, (_event) => showDropdown.value = false)

  function toggleDropdown() {
    showDropdown.value = !showDropdown.value
  }

  function handleDropdownItemClick(language) {
    // Emit with the selected language
    console.log(`Selected language: ${language}`)
    emit('languageSelected', language)

    // Close the dropdown
    showDropdown.value = false
  }
</script>

<template>
  <nav class="bg-gray-800 p-4 flex items-center justify-center" ref="navbar">
    <!-- Project Name -->
    <div class="text-white font-bold text-xl mr-4">Learn</div>

    <!-- Language Dropdown -->
    <div class="relative inline-block text-left" @click="toggleDropdown">
      <div>
        <button
          type="button"
          class="inline-flex justify-center w-full rounded-md border border-gray-500 shadow-sm px-4 py-2 bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none"
          id="options-menu"
          aria-expanded="true"
          aria-haspopup="true"
        >
          {{ selectedLanguage ? selectedLanguage : "Languages" }}
        </button>
      </div>

      <!-- Dropdown Content -->
      <div
        v-show="showDropdown"
        class="origin-top-right absolute -right-3 mt-2 w-32 rounded-md shadow-lg bg-gray-800 focus:ring-transparent ring-opacity-5 focus:outline-none"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
        ref="dropdownRef"
        @click.stop="handleDropdownClick"
      >
        <div class="py-1" role="menuitem">
          <a href="#" class="text-white block px-4 py-2 text-sm hover:bg-gray-600" @click="handleDropdownItemClick('German')">German</a>
        </div>
        <div class="py-1" role="menuitem">
          <a href="#" class="text-white block px-4 py-2 text-sm hover:bg-gray-600" @click="handleDropdownItemClick('Japanese')">Japanese</a>
        </div>
        <div class="py-1" role="menuitem">
          <a href="#" class="text-white block px-4 py-2 text-sm hover:bg-gray-600" @click="handleDropdownItemClick('Russian')">Russian</a>
        </div>
        <div class="py-1" role="menuitem">
          <a href="#" class="text-white block px-4 py-2 text-sm hover:bg-gray-600" @click="handleDropdownItemClick('Portuguese')">Portuguese</a>
        </div>
        <div class="py-1" role="menuitem">
          <a href="#" class="text-white block px-4 py-2 text-sm hover:bg-gray-600" @click="handleDropdownItemClick('Spanish')">Spanish</a>
        </div>
      </div>
    </div>

    <div class="ml-3 text-white font-bold text-xl mr-4">by context</div>
  </nav>
</template>