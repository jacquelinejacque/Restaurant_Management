<template>
    <img class="logo" src="../assets/RestaurantLogo.png" alt="RestaurantLogo">
    <h1>Login</h1>
    <div class="login">
        <input v-model="email" type="email" placeholder="Enter email">
        <input v-model="password" type="password" placeholder="Enter password">
        <button>Login</button>
    </div>
</template>

<script>
export default{
    name : 'LoginPage',
    data (){
        return{
            email : '',
            password : '',
            errorMessage: ''
        };
    },
  methods: {
    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    login(){
      if (!this.email) {
        this.errorMessage = "Email is required";
        return;
      }
      if (!this.validateEmail(this.email)) {
        this.errorMessage = "Invalid email format";
        return;
      }
      if (!this.password) {
        this.errorMessage = "Password is required";
        return;
      }
      if (this.password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters long";
        return;
      }
        // Reset error message
      this.errorMessage = '';

      const user = {
        email: this.email,
        password: this.password
      };

      console.log("User data being sent:", user);
    }
    }
}
</script>

<style>
.login input {
  width: 300px;
  height: 40px;
  padding-left: 20px;
  display: block;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
  border: 1px solid #7B3F00;
}

.login button{
  width: 320px;
  height: 40px;
  background-color: #7B3F00;
  border: 1px solid #7B3F00;
  color: white;
  cursor: pointer;
}

.error {
  color: red;
  text-align: center;
  margin-top: 10px;
}

.logo {
  width: 150px;
}
</style>