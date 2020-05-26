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
          <input v-model.trim="pageName" @keyup="pageNameValid" :class="{'is-invalid': turnRed}" type="text" class="input-form" maxlength="64" autocomplete="off">
          <small ref="smallPageName" :class="{red: turnRed}">{{ smallPageNameText }}</small>
          <br><br>
          <label>Display Name <span class="text-muted" style="font-size: 14px;"><i class="far fa-question-circle" data-toggle="tooltip" title="Page name will be shown if display name is empty"></i></span></label>
          <input v-model.trim="pageDisplayName" type="text" class="input-form" maxlength="64" placeholder="(Optional)" autocomplete="off">
          <br><br>
          <div class="form-row">
            <div class="col-sm-5 mb-2">
              <label><small>Who can see posts</small></label>
              <select v-model="pagePrivate" class="custom-select custom-select-sm mr-sm-2" required>
                <option :value="false">Public (Everyone)</option>
                <option :value="true">Private (Subscribers)</option>
              </select>
            </div>
            <div class="col-sm-5">
              <label><small>Who can post</small></label>
              <select v-model="pagePermissions" class="custom-select custom-select-sm mr-sm-2" required>
                <option :value="true">Subscribers</option>
                <option :value="false">Only me</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <span><small>Maximum 3 per user</small>&emsp;</span>
          <button type="button" class="btn btn-secondary modal-btn" data-dismiss="modal">Cancel</button>
          <button
            @click="create"
            :disabled="disableCreateBtn"
            :class="{'not-allowed': disableCreateBtn}"
            type="button"
            class="btn btn-primary modal-btn"
          >
            <font-awesome-icon v-if="creating" :icon="['fas', 'circle-notch']" spin />
            <template v-else>Create</template>
          </button>
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
      pagePrivate: false,
      pagePermissions: true,
      maximum: false,
      maximumText: "Maximum number of pages created",
      creating: false
    }
  },
  computed: {
    disableCreateBtn() {
      return this.turnRed || !this.pageName
    }
  },
  methods: {
    pageNameValid() {
      this.turnRed = false
      this.smallPageNameText = this.defaultText
      const check = !!this.pageName.match(/^[a-z0-9_]+$/i) // Check if all characters are valid
      if (!check) this.invalidateForm()
      return check
    },
    invalidateForm(message=null) {
      this.smallPageNameText = message ? message : this.defaultText
      this.turnRed = !!this.pageName // Don't turn red if field is empty
    },
    pageNameTaken() { // Prevents resubmission of form with same page name
      const taken = this.TAKEN_PAGE_NAMES.includes(this.pageName.toLowerCase())
      if (taken) this.invalidateForm(this.nameTakenText)
      return taken
    },
    checkMaximum() {
      if (this.maximum) this.invalidateForm(this.maximumText)
      return this.maximum
    },
    validateForm() {
      return this.pageNameValid() && !this.pageNameTaken() && !this.checkMaximum() && typeof this.pagePrivate === "boolean" && typeof this.pagePermissions === "boolean"
    },
    async create() {
      if (this.validateForm()) {
        this.creating = true
        const formData = new FormData()
        formData.set("name", this.pageName)
        formData.set("display_name", this.pageDisplayName)
        formData.set("private", this.pagePrivate)
        formData.set("permissions", this.pagePermissions)

        try {
          const { data } = await this.$axios.post("/new_page", formData)
          if (data.success) {
            $("#newMemePage").modal('hide')
            await this.addPageToAuthUser(formData)
            this.$router.push(`/page/${data.name}`)
          } else {
            if (data.taken) {
              this.TAKEN_PAGE_NAMES.push(formData.get("name").toLowerCase())
            } else if (data.maximum) {
              this.maximum = true
            }
            this.invalidateForm(data.taken ? this.nameTakenText : data.maximum ? this.maximumText : data.message)
          }
          this.pageName = this.pageDisplayName = ""
          this.pagePrivate = false
          this.pagePermissions = true
        } catch (err) {
          console.log(err)
        } finally {
          this.creating = false
        }
      }
    },
    addPageToAuthUser(formData) {
      const new_moderating = this.$auth.user.moderating.map(page => {
        return Object.fromEntries(Object.entries(page))
      })
      new_moderating.push({
        name: formData.get("name"),
        dname: formData.get("display_name"),
        private: JSON.parse(formData.get("private"))
      })
      this.$auth.setUser(Object.assign({}, this.$auth.user, {moderating: new_moderating}))
      // this.$store.commit("auth/newMemePage", {
      //   name: formData.get("name"),
      //   dname: formData.get("display_name"),
      //   private: JSON.parse(formData.get("private"))
      // })
    }
  }
}
</script>
