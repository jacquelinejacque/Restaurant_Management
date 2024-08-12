<template>
    <h1>Welcome Admin</h1>
    <div class="nav">
        <a href="#">Home Page</a>
        <a href="#">Add Restaurant</a>
        <a href="#">Update Restaurant</a>
        <a v-on:click="logout" href="#">Logout</a>
    </div>
</template>

<script>

export default{
    name : 'AdminHeader',
    methods:{
        logout(){
            localStorage.clear();
            this.$router.push({name :'LoginPage'});
        }
    }


}
</script>

<style>
    .nav{
        background-color:  #7B3F00;
        overflow: hidden;
    }
    .nav a{
        float: left;
        color: #f2f2f2;
        padding: 16px 14px;
        text-align: center;
        font-size: 17px;
        text-decoration: none;
        margin-right: 5px;
    }
    .nav a:hover{
        background: #ddd;
        color: #333;
    }
</style>