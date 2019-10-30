<template>
    <div>
        <div class="title">
            <span>{{title}}</span>
        </div>
        <vuedraggable v-model="data">
            <transition-group tag="div" class="item-ul">
                <div v-for="(item,index) in data" :key="index" class="item">
                    <div class="img-div">
                        <img class="drag-list-img" :src="item.src"/>
                    </div>
                    <div class="item-line"></div>
                    <div class="item-bottom">
                        <img class="item-bottom-img" @click="pictureSelected(item)" src="../../../assets/img/pitch.png" title="选中">
                    </div>
                </div>
            </transition-group>
        </vuedraggable>
    </div>
</template>

<script>
    import vuedraggable from 'vuedraggable';
    import pageBus from "../PageBus";
    export default {
        components:{vuedraggable},
        name: "PictureSelect",
        props:["title", "data"],
        data(){
            return{
            }
        },

        created() {
        },

        methods:{
            //蓝色对勾被选中
            pictureSelected(item){
                console.log("item", item);//debug
                pageBus.$emit("PictureSelect", item);
            }
        }
    }
</script>

<style scoped>
    .title{
        margin-bottom:6px;
    }

    .item-ul {
        display: flex;
        flex-direction: row;
    }

    .item{
        width: 100px;
        height: 80px;
        border:1px solid #3c3f41;
        margin-right:10px;
        padding:4px;
    }

    .img-div{
        height:50px;
    }

    .drag-list-img {
        width: 100%;
        height: 46px;
    }

    .item-line{
        height:1px;
        background-color: #2c3e50;
        margin-top: 2px;
    }

    .item-bottom{
        padding-top:4px;
    }

    .item-bottom-img{
        width: 20px;
        margin-right: 2px;
    }
</style>
