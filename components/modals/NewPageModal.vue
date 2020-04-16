<template>
  <div class="modal fade" id="newMemePage" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-light">
        <div class="modal-header">
          <h5 class="modal-title">Create a Meme Page!</h5>
        </div>
        <div class="modal-body">
          <label>Page Name</label>
          <br>
          <input v-model.trim="pageName" @keyup="pageNameValidChars" :class="{'is-invalid': turnRed}" type="text" class="input-form" maxlength="64" autocomplete="off">
          <small ref="smallPageName" :class="{red: turnRed}">{{ smallPageNameText }}</small>
          <br><br>
          <label>Display Name <span class="text-muted" style="font-size: 14px;"><i class="far fa-question-circle" data-toggle="tooltip" title="Page name will be shown if display name is empty"></i></span></label>
          <input v-model.trim="pageDisplayName" type="text" class="input-form" maxlength="64" placeholder="(Optional)" autocomplete="off">
          <br><br>
          <div class="form-row">
            <div class="col-sm-5 mb-2">
              <label><small>Who can see posts</small></label>
              <select v-model="pagePrivacy" class="custom-select custom-select-sm mr-sm-2" required>
                <option value="1">Public (Everyone)</option>
                <option value="0">Private (Subscribers)</option>
              </select>
            </div>
            <div class="col-sm-5">
              <label><small>Who can post</small></label>
              <select v-model="pagePermissions" class="custom-select custom-select-sm mr-sm-2" required>
                <option value="1">Subscribers</option>
                <option value="0">Only me</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <span><small>Maximum 3 per user</small>&emsp;</span>
          <button type="button" class="btn btn-secondary modal-btn" data-dismiss="modal">Cancel</button>
          <button ref="createBtn" @click="create" :class="{'not-allowed': turnRed || !pageName}" type="button" class="btn btn-primary modal-btn" disabled>Create</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewPageModal',
  data() {
    return {
      defaultText: "Letters, numbers, and underscores only.",
      nameTakenText: "Page name already taken.",
      pageName: "",
      turnRed: false,
      smallPageNameText: "Letters, numbers, and underscores only.",
      TAKEN_PAGE_NAMES: [],
      pageDisplayName: "",
      pagePrivacy: 1,
      pagePermissions: 1
    }
  },
  methods: {
    pageNameValidChars() {
      this.turnRed = false
      this.smallPageNameText = this.defaultText
      const check = !!this.pageName.match(/^[a-z0-9_]+$/i) // Check if all characters are valid
      this.$refs.createBtn.disabled = !check
      if (!check) this.invalidateForm()
      return check
    },
    invalidateForm(message=null) {
      this.smallPageNameText = message ? message : this.defaultText
      this.$refs.createBtn.disabled = true
      this.turnRed = !!this.pageName // Don't turn red if field is empty
    },
    pageNameTaken() { // Prevents a frenzy of requests with the same page name
      const taken = this.TAKEN_PAGE_NAMES.includes(this.pageName.toLowerCase())
      if (taken) this.invalidateForm(this.nameTakenText)
      return taken
    },
    validateForm() {
      return this.pageNameValidChars() && !this.pageNameTaken() && (this.pagePrivacy == 0 || this.pagePrivacy == 1) && (this.pagePermissions == 0 || this.pagePermissions == 1)
    },
    create() {
      if (this.validateForm()) {
        data = new FormData()
        data.set("name", this.pageName)
        data.set("displayName", this.pageDisplayName)
        data.set("privacy", this.pagePrivacy)
        data.set("permissions", this.pagePermissions)

        this.$axios.post("/newPage", data, {headers: {"X-CSRFToken": getCookie('csrftoken'), "X-Requested-With": "XMLHttpRequest"}})
          .then(res => {
            if (res.data["s"]) {
              window.location = `/page/${res.data["name"]}`
            } else {
              if (res.data["m"] === this.nameTakenText) this.TAKEN_PAGE_NAMES.push(data.get("name").toLowerCase())
              this.invalidateForm(res.data["m"])
            }
          })
          .catch(console.log)
      }
    }
  }
}
</script>

<style>

</style>