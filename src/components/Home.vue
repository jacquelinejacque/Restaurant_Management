<template>
  <Header />
  <h1 v-if="name">Hello {{ name }}, Welcome to Home Page</h1>
  <h1 v-else>Welcome to Home Page</h1>
</template>

<script>
import Header from './AdminHeader.vue';

export default {
  name: 'HomePage',
  data() {
    return {
      name: ''
    };
  },
  components: {
    Header
  },
  mounted() {
    let user = localStorage.getItem('user-info');
    
    console.log("Retrieved user from localStorage:", user); // Debugging line

    if (!user) {
      this.$router.push({ name: 'SignUp' });
    } else {
      try {
        const userInfo = JSON.parse(user);
        console.log("Parsed user info:", userInfo); // Debugging line

        if (userInfo && userInfo.name) {
          this.name = userInfo.name;
          console.log("User name retrieved:", this.name); // Debugging line
        } else {
          console.warn("User info does not contain name:", userInfo); // Debugging line
        }
      } catch (error) {
        console.error("Failed to parse user info from localStorage:", error);
      }
    }
  }
};
</script>
