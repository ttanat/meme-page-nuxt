<template>
  <div>
    <div class="input-group">
      <input
        ref="input"
        v-model.trim="query"
        @keyup.enter="search"
        type="text"
        class="nav-item form-control ml-2"
        :placeholder="placeholder"
        @focus="changePlaceholder('memes, #tags, @users, ^pages')"
        @blur="changePlaceholder('Search')"
        maxlength="64"
      >
      <div class="input-group-append">
        <button @click="search" @mouseenter="changeOpacity(1)" @mouseleave="changeOpacity(.6)" class="input-group-text">
          <svg :opacity="searchIconOpacity" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" fill="grey" height="20" width="20">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      query: this.$route.path === "/search" ? this.$route.query.q : "",
      placeholder: "Search",
      searchIconOpacity: .6
    }
  },
  methods: {
    changePlaceholder(val) {
      this.placeholder = val
    },
    changeOpacity(val) {
      this.searchIconOpacity = val
    },
    search() {
      if (this.query) {
        this.$router.push({name: 'search', query: {q: this.query}})
        this.$refs.input.blur()
      }
    }
  }
}
</script>

<style scoped>
input, button {
  height: 30px;
  border: 1px solid #333;
  font-weight: 350;
}
input {
  width: 25rem !important;
  color: gainsboro;
  background-color: #111;
  transition: none;
}
input:focus {
  color: gainsboro !important;
  background-color: #111;
  border: 1px solid royalblue !important;
  box-shadow: none !important;
}
input::placeholder {
  color: #555;
  font-weight: 300;
}
button {
  background-color: #222;
  color: grey;
}
</style>
