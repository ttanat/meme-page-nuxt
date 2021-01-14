<template>
  <div class="error-container">
    <svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" fill="lightgrey" viewBox="0 0 48 48">
      <path d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" />
    </svg>
    <h2 v-if="error.statusCode === 404">Page not found</h2>
    <h3 v-else>Oops, something went wrong.</h3>
    <span><NuxtLink to="/" class="error-return">Return </NuxtLink><NuxtLink to="/">home</NuxtLink></span>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  computed: {
    statusCode () {
      return (this.error && this.error.statusCode) || 500
    },
    message () {
      return this.error.message || 'Error'
    }
  },
  head () {
    return { title: this.message }
  }
}
</script>

<style scoped>
.error-container {
	padding: 1rem;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	font-family: sans-serif;
	font-weight: 100 !important;
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
	-webkit-font-smoothing: antialiased;
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
}
svg {
  margin-bottom: 7px;
}
a {
  font-size: 1.1rem;
}
.error-return {
  color: grey;
}
</style>
