<template>
  <div class="col-md-4 col-xl-3" id="profile-col">

    <div class="container-fluid">
      <div class="row">
        <div id="profile-pic-container">
          <img v-if="$route.path.startsWith('/profile') && $auth.user.image" class="rounded-circle" id="profile-pic" :src="$auth.user.image" height="55" width="55">
          <img v-else-if="$route.path.startsWith('/user/')" class="rounded-circle" id="profile-pic" src="{{ user_displayed.image.url }}" height="65" width="65">
          <font-awesome-icon v-else :icon="['fas', 'user-circle']" style="font-size: 60px;margin: 5px;" />
        </div>
        <div>
            <h5 id="profile-username" class="m-1">{{ user_displayed.username }}</h5>
            {% if is_profile_page and path != "settings" %}
                <small class="text-muted pointer" id="editProfilePic" onclick="this.nextSibling.click()">&nbsp;Edit profile picture</small>
                <input type="file" name="profilePic" id="updateProfilePic" accept="image/jpeg, image/png" class="d-none" onchange="update_profile_pic()">
            {% else %}
                <span id="follow-btn"><follow-button :following="{% if is_following %}true{% else %}false{% endif %}" :is-profile="true"></follow-button></span>
            {% endif %}
        </div>
      </div>
    </div>

    <div class="mt-2">
      {% if is_profile_page and path == "profile" %}
        <div id="vue-bio"><bio-desc bio-or-desc="{{ user.bio }}" add-text="bio"></bio-desc></div>
      {% else %}
        <span style="font-size: 14px;white-space: pre-wrap;">{{ user_displayed.bio }}</span>
      {% endif %}
    </div>
    <hr class="mb-2" style="background-color: grey;">

    {% if path != "settings" %}<div id="pstats"><profile-stats></profile-stats></div>{% endif %}

    <div class="mt-4 mb-5">
      <h5>Profile</h5>
      {% if is_profile_page %}
        <a class="sidebar-link" href="{% if path == 'profile' %}javascript:void(0);{% else %}/profile{% endif %}" data-profile-page="Uploads"><i class="fas fa-box-open"></i>&ensp;Your memes</a>
        <a class="sidebar-link" href="{% if path == 'likes' %}javascript:void(0);{% else %}/profile/likes{% endif %}" data-profile-page="Likes"><i class="fas fa-thumbs-up"></i>&ensp;Likes</a>
        <a class="sidebar-link" href="{% if path == 'comments' %}javascript:void(0);{% else %}/profile/comments{% endif %}" data-profile-page="Comments"><i class="fas fa-comment"></i>&ensp;Comments</a>
      {% else %}
        <a class="sidebar-link" href="javascript:void(0);" data-profile-page="Uploads"><i class="fas fa-box-open"></i>&ensp;Memes</a>
      {% endif %}
      <br>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>