<template>
  <div class="modal fade" id="reportModal" tabindex="-1" aria-labelledby="reportModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-light">
        <div class="modal-header">
          <h5 class="modal-title" id="reportModalLabel">Report violation&ensp;<font-awesome-icon :icon="['far', 'flag']" /></h5>
        </div>
        <div class="modal-body">
          <select v-model="reason" class="custom-select custom-select-sm">
            <option :value="0" disabled>Please select a reason</option>
            <option value="spam">Spam</option>
            <option value="nudity">Nudity</option>
            <option value="shocking">Shocking content</option>
            <option value="private">Private information</option>
            <option value="discrimination">Hate speech/Discrimination</option>
            <option value="dangerous">Harrassment/Threat</option>
            <option value="illegal">Illegal content</option>
            <option value="other">Other</option>
          </select>
          <textarea
            v-if="reason==='other'||reason==='illegal'"
            v-model.trim="info"
            maxlength="500"
            placeholder="Additional info"
            class="mt-3 form-control p-1"
          ></textarea>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Cancel</button>
          <button
            @click="submitReport"
            type="button"
            class="btn btn-sm btn-danger"
            :style="{cursor: reportBtnDisabled ? 'not-allowed' : ''}"
            :disabled="reportBtnDisabled"
          >
            Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ReportModal',
  data() {
    return {
      reason: 0,
      info: "",
    }
  },
  mounted() {
    $("#reportModal").on("hide.bs.modal", () => {
      this.clearReport()
    })
  },
  computed: {
    ...mapGetters({
      reportObject: "report/reportObject",
      objectUid: "report/objectUid"
    }),
    reportBtnDisabled() {
      return this.reason === 0 || (this.reason === "other" && !this.info)
    }
  },
  methods: {
    submitReport() {
      const data = new FormData()
      data.append("reportObject", this.reportObject)
      data.append("objectUid", this.objectUid)
      data.append("reason", this.reason)
      data.append("info", this.info)
      this.$axios.post("/api/reports/", data).finally(() => alert("Thank you for reporting"))
      $("#reportModal").modal("hide")
    },
    clearReport() {
      this.reason = 0
      this.info = ""
      this.$store.commit("report/clearReport")
    }
  }
}
</script>
