<template>
  <main>
    <div v-if="page.cover" style="overflow-x: hidden;"><img :src="page.cover" style="max-height: 150px;min-width: 100%;margin-left: 50%;transform: translateX(-50%);"></div>

    <div class="container-fluid mt-4 mb-2">
      <div class="row justify-content-center">

        <!-- Left column -->
        <div class="col-lg-3 col-xl-2" id="page-left">
          <!-- Page image and names -->
          <div class="container-fluid">
            <div class="row mb-3">
              <img v-if="page.image" class="rounded-circle my-1 mr-2" id="page-pic" :src="page.image" height="50" width="50">
              <div class="mr-1 mb-1">
                <h5 id="page-display-name" :title="page.dname" style="font-weight: normal;">{{ page.dname || page.name }}</h5>
                <h6 class="text-muted" style="font-weight: normal;font-size: .95rem;">
                  {{ page.name }}<template v-if="!page.permissions || page.private">&ensp;<font-awesome-icon :icon="['fas', 'lock']" :title="page.private ? 'Page is private' : 'Only admin can post'" style="font-size: .9em;" /></template>
                </h6>
              </div>
              <div :class="{'mt-1': page.image}" class="px-0">
                <span v-if="!is_page_admin" id="follow-btn" class="float-right float-lg-none">
                  <SubscribeButton
                    :is-subscribed="is_subscribed"
                    :is-requested="is_requested"
                    :is-private="page.private"
                    :display-name="page.dname"
                    @subscribe-changed-event="changeSubscribe"
                    @subscribe-requested-event="changeSubscribeRequest"
                  />
                </span>
              </div>
            </div>
          </div>
          <!-- Page stats -->
          <table class="mb-2 w-100">
            <tr>
              <!-- Plus one to include admin -->
              <td class="page-stat" id="sub-count">{{ formatNumber(page.subs + 1) }}</td>
              <td class="page-stat" id="post-count">{{ formatNumber(page.num_posts) }}</td>
            </tr>
            <tr>
              <td class="page-stat"><small>members</small></td>
              <td class="page-stat"><small>posts</small></td>
            </tr>
          </table>
          <!-- Requests and settings buttons for admin -->
          <div v-if="is_page_admin || is_page_mod" id="left-lower-btns" class="mb-2 mb-lg-0">
            <nuxt-link :to="page.name+'/moderators'" class="left-lower-btn" no-prefetch>
              <font-awesome-icon :icon="['far', 'user']" /> Moderators
            </nuxt-link>
            <br>
            <nuxt-link v-if="page.private" :to="page.name+'/requests'" class="left-lower-btn" no-prefetch>
              <font-awesome-icon :icon="['far', 'bell']" /> Requests
            </nuxt-link>
            <br v-if="page.private">
            <nuxt-link v-if="is_page_admin" :to="page.name+'/settings'" class="left-lower-btn" no-prefetch>
              <font-awesome-icon :icon="['fas', 'cog']" /> Settings
            </nuxt-link>
          </div>
        </div>

        <!-- Middle column -->
        <div class="col-sm-12 col-md-8 col-lg-6 col-xl-6" id="mid">
          <MemeItems v-if="show" :page-config="page_config" @change-num-ads="changeNumAds" />
          <div v-else-if="page.private && !show" class="no-memes">This meme page is private.<br><br>Subscribe to view memes posted here.</div>
        </div>

        <!-- Right column -->
        <div class="col-md-4 col-lg-3 col-xl-3" id="right">
          <div v-if="show" id="right-child">
            <!-- Page description -->
            <div v-if="is_page_admin || page.description" class="mb-4 p-2" id="page-description">
              <BioDescription
                v-if="is_page_admin"
                :is-page-admin="is_page_admin"
                :page-description="page.description"
                add-text="page description"
                @description-change-event="changeDescription"
              />
              <span v-else id="description">{{ page.description }}</span>
            </div>
            <!-- Ad (show vertical if page has more than 4 posts) -->
            <adsbygoogle
              v-if="show && page.num_posts && numAdsToShow > 0"
              :ad-format="page.num_posts > 4 && numAdsToShow > 2 ? 'vertical' : 'rectangle'"
            />
            <!-- List of moderators -->
            <ModsList v-if="show" :page="page" />
            <!-- More ads -->
            <div v-if="show && page.num_posts > 1 && numAdsToShow > 1" class="right-fixed">
              <adsbygoogle ad-format="rectangle" />
              <adsbygoogle v-if="page.num_posts > 2 && numAdsToShow > 2" ad-format="rectangle" />
            </div>
          </div>
        </div>

      </div>
    </div>

  </main>
</template>

<script>
import MemeItems from '~/components/MemeItems'
import SubscribeButton from '~/components/page/SubscribeButton'
import BioDescription from '~/components/profile/BioDescription'
import ModsList from '~/components/page/ModsList'
import formatNumberMixin from '~/mixins/formatNumberMixin'

export default {
  components: {
    MemeItems,
    SubscribeButton,
    BioDescription,
    ModsList
  },
  mixins: [formatNumberMixin],
  async asyncData({ $axios, $auth, params, redirect }) {
    const { data } = await $axios.get(`/api/page/${params.name}`)

    if (data.redirect) {
      return redirect(301, `/p/${data.name}`)
    }

    return {
      page: data.page,
      is_subscribed: data.is_subscribed || false,
      is_requested: data.is_requested || false,
      is_page_admin: $auth.loggedIn && $auth.user.username === data.page.admin,
      is_page_mod: (Array.isArray(data.page.moderators)
                    && $auth.loggedIn
                    && data.page.moderators.includes($auth.user.username)),
      show: data.show,
      // Use in MemeItems
      page_config: {
        num_posts: data.page.num_posts,
        private: data.page.private,
        show: data.show
      },
      numAdsToShow: 0
    }
  },
  head() {
    const p = this.page
    this.$store.commit("setCurrentPage", p.dname && p.dname.length <= 20 ? p.dname : p.name.length <= 20 ? p.name : "")
    const meta = [
        {hid: "keywords", name: "keywords", content: `Meme,Memes,Funny,Dank,${p.dname || ""}${p.dname ? "," : ""}${p.name}`},
        // Twitter meta tags
        {hid: "twitter:card", name: "twitter:card", content: "summary"},
        {hid: "twitter:url", name: "twitter:url", content: `${window.location.origin}${window.location.pathname}`},
        {hid: "twitter:title", name: "twitter:title", content: `${p.dname || p.name} - Meme Page`},
        {hid: "twitter:description", name: "twitter:description", content: p.description || ""},
        {hid: "twitter:image", name: "twitter:image", content: p.image || p.cover || ""},
        // Open graph meta tags
        {hid: "og:url", property: "og:url", content: `${window.location.origin}${window.location.pathname}`},
        {hid: "og:title", property: "og:title", content: `${p.dname || p.name} - Meme Page`},
        {hid: "og:image", property: "og:image", content: p.image || p.cover || ""},
        {hid: "og:description", property: "og:description", content: p.description || ""},
    ]
    if (p.description) meta.push({hid: "description", name: "description", content: p.description || ""})
    return {
      title: `${p.dname || p.name} - Meme Page`,
      meta,
    }
  },
  methods: {
    changeDescription(val) {
      this.page.description = val
    },
    changeSubscribe(f) {
      this.is_subscribed = f
      this.page.subs += f ? 1 : -1
    },
    changeSubscribeRequest(r) {
      this.is_requested = r
    },
    changeNumAds(num) {
      this.numAdsToShow = num
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
.left-lower-btn {
  color: grey;
  font-size: 14px;
}
#description {
  font-size: 14px;
}
#page-description {
  border: 1px solid #333;
  border-radius: 3px;
  background: #202020;
}
.item {
  border: 1px solid #333;
  border-radius: 7px;
}
.thumbs {
  margin-left: 5px;
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
@media (min-width: 992px) {
  #page-left {
    position: sticky;
    position: -webkit-sticky;
    top: 4rem;
    height: 100%;
    min-height: calc(100vh - 5rem);
    padding-left: unset;
  }
  #left-lower-btns {
    bottom: 0;
    position: absolute;
  }
}
</style>
