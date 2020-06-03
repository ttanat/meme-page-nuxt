<template>
  <main>
    <div v-if="page.cover" style="overflow-x: hidden;"><img :src="page.cover" style="max-height: 150px;min-width: 100%;margin-left: 50%;transform: translateX(-50%);"></div>

    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-lg-3 col-xl-2 mb-3 mt-4" id="page-left">

          <div class="container-fluid">
            <div class="row mb-3">
              <img v-if="page.image" class="rounded-circle my-1 mr-2" id="page-pic" :src="page.image" height="50" width="50">
              <div class="mr-1 mb-1">
                <h5 id="page-display-name" :title="page.dname" style="font-weight: normal;">{{ page.dname || page.name }}</h5>
                <h6 class="text-muted" style="font-weight: normal;font-size: .95rem;">
                  {{ page.name }}<template v-if="!page.permissions || page.private">&ensp;<font-awesome-icon :icon="['fas', 'lock']" :title="page.private ? 'Page is private' : 'Only admin can post'" style="font-size: .9em;" /></template>
                </h6>
              </div>
              <div class="col mt-1 px-0">
                <span v-if="!is_page_admin" id="follow-btn" class="float-right float-lg-none">
                  <FollowButton :is-following="is_subscribed" @following-changed-event="changeSubscribe" />
                </span>
              </div>
            </div>
          </div>

          <table class="mb-2 w-100">
            <tr>
              <td class="page-stat" id="sub-count">{{ page.subs }}</td>
              <td class="page-stat" id="post-count">{{ page.num_posts }}</td>
            </tr>
            <tr>
              <td class="page-stat"><small>users</small></td>
              <td class="page-stat"><small>posts</small></td>
            </tr>
          </table>

          <div class="my-3">
            <BioDescription
              v-if="is_page_admin"
              :is-page-admin="is_page_admin"
              :page-description="page.description"
              add-text="page description"
              @description-change-event="changeDescription"
            />
            <span v-else id="bio">{{ page.description }}</span>
          </div>

          <div v-if="is_page_admin" style="bottom: 0;position: absolute;">
            <nuxt-link :to="page.name+'/settings'" style="color: grey;font-size: 14px;"><font-awesome-icon :icon="['fas', 'cog']" /> Settings</nuxt-link>
          </div>
        </div>

        <div class="col-sm-8 col-lg-6 col-xl-6 mt-4" id="mid">
          <MemeItems v-if="show" :page-config="page_config" />
          <div v-else-if="page.private && !show" class="no-memes">This meme page is private.<br><br>Subscribe to view memes posted here.</div>
        </div>

        <div class="col-sm-4 col-lg-3 col-xl-3 mt-4" id="right">
          <img v-if="page.num_posts && show" class="ad" src="~/assets/ad.png" alt="Advertisement">
          <div class="list-group mt-4 mb-5">
            <div class="list-group-item list-group-item-action py-2" style="background: darkgreen;color: white;">Moderators</div>
            <nuxt-link :to="'/user/'+page.admin" class="list-group-item list-group-item-action py-2">{{ page.admin }} (admin)</nuxt-link>
            <nuxt-link
              v-for="mod in page.moderators"
              :key="mod"
              :to="'/user/'+mod"
              class="list-group-item list-group-item-action py-2"
            >
              {{ mod }}
            </nuxt-link>
          </div>
          <div class="right-fixed" v-if="page.num_posts > 1 && show">
            <img class="ad" src="~/assets/got_ad.png" alt="Advertisement">
            <img class="ad" src="~/assets/ad_two.png" alt="Advertisement">
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import MemeItems from '~/components/MemeItems'
import FollowButton from '~/components/profile/FollowButton'
import BioDescription from '~/components/profile/BioDescription'

export default {
  components: {
    MemeItems,
    FollowButton,
    BioDescription
  },
  async asyncData({ $axios, params }) {
    const { data } = await $axios.get(`/api/page/${params.name}`)
    return {
      page: data.page,
      is_subscribed: data.is_subscribed || false,
      is_page_admin: data.is_page_admin || false,
      show: data.show,
      page_config: {
        num_posts: data.page.num_posts,
        private: data.page.private,
        show: data.show
      }
    }
  },
  head() {
    const p = this.page
    this.$store.commit("setCurrentPage", p.dname.length <= 20 ? p.dname : p.name.length <= 20 ? p.name : "")
    return {
      title: `${p.dname || p.name} - Meme Page`,
      meta: [
        {hid: "keywords", name: "keywords", content: `Meme,Memes,Funny,Dank,${p.dname},${p.name}`}
      ]
    }
  },
  methods: {
    changeDescription(val) {
      this.page.description = val
    },
    changeSubscribe(f) {
      this.is_subscribed = f
      this.page.subs += f ? 1 : -1
    }
  }
}
</script>

<style scoped>
main {
  padding-top: unset !important;
}
#page-display-name {
  margin: 5px 5px 5px 0;
}
/* #page-left {
  min-height: calc(100vh - 5rem);
} */
#bio {
  font-size: 14px;
}
.item {
  border: 1px solid #333333;
  border-radius: 7px;
}
.thumbs {
  margin-left: 5px;
}
.list-group-item {
  width: 260px;
}
@media (max-width: 575.98px) {
  #mid {
    padding: 0 !important;
  }
  .item {
    border: none;
    border-radius: 0;
  }
  .container-body, .container-body video {
    max-height: unset;
  }
  .content {
    object-fit: unset;
  }
  html::-webkit-scrollbar {
    display: none;
  }
  html {
    scrollbar-width: none;
  }
}
</style>