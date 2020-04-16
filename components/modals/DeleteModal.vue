<template>
  <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content text-light">
        <div class="modal-header" style="border-bottom: solid 1px darkgrey;">
          <h5 class="modal-title">Delete <font-awesome-icon :icon="['far', 'trash-alt']" /></h5>
        </div>
        <div class="modal-body" style="border-bottom: solid 1px darkgrey;">
          <p>Are you sure you want to delete this <span></span>?</p>
        </div>
        <div class="modal-footer" style="border-top: none;">
          <button type="button" class="btn btn-outline-secondary modal-btn" data-dismiss="modal">Cancel</button>
          <button type="button" class="btn btn-outline-danger modal-btn" id="deleteModalBtn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteModal'
}
</script>
