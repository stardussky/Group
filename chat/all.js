const fileReader = new FileReader();

const app = {
  name: 'app',
  template: `
    <router-view></router-view>
  `
}
const chat = {
  name: 'chat',
  template: `
  <div class="chat">
    <ul class="chat_room">
      <li 
        v-for='msg in messages' 
        :class='{
          self: msg.author.uid === userID,
          system: msg.system
        }'
      >
        <p v-if='!msg.system'>{{ msg.author.name }} : </p>
        <p>{{ msg.content }}</p>
        <img :src='msg.author.photoURL' v-if='msg.author.photoURL'/>
        <p>// {{ msg.createTime }}</p>
      </li>
    </ul>
    <div class="chat_input">
      <div>
        <label>
          USER: 
        </label>
        <input type="text" v-model='userName'>
      </div>
      <div>
        <label>
          Message: 
        </label>
        <textarea v-model='messageInput'></textarea>
      </div>
      <div>
        <label>Picture: </label>
        <input type='file' @change='uploadFile' ref='input' accept="image/*">
      </div>
      <button @click='addMessage'>送出</button>
      <router-link to='/'>回上頁</router-link>
    </div>
  </div>
  `,
  data() {
    return {
      messageInput: '',
      messages: null,
      photoUrl: null
    }
  },
  computed: {
    userName: {
      get() {
        return this.$store.state.chatModule.userName;
      },
      set(val) {
        if(!val) val = 'anonymous';
        this.$store.commit('chatModule/SET_USERNAME', {
          name: val,
          id: this.userID
        });
      }
    },
    userID: {
      get() {
        return this.$store.state.chatModule.userID;
      }
    },
  },
  // firestore: {
  //   messages: fStore.collection('Message'),
  // },
  methods: {
    addMessage() {
      let date = new Date();
      fStore.collection('Message').add({
        'author': {
          'uid': this.userID,
          'name': this.userName,
          'photoURL': this.photoUrl
        },
        'content': this.messageInput,
        'createTime': `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        'system': false
      }).then(() => {
        this.messageInput = null;
        this.photoUrl = null;
        let input = this.$refs.input;
        input.type = 'text';
        input.type = 'file';
      })
    },
    uploadFile(e){
      let file = e.target.files[0];
      fileReader.readAsDataURL(file);
    },
    readerHandler(e){
      this.photoUrl = e.target.result;
    }
  },
  created() {
    this.$bind('messages', fStore.collection('Message').orderBy('createTime'));
    if (!this.$store.hasModule('chatModule')) {
      this.$store.registerModule('chatModule', chatModule());
    }
  },
  mounted(){
    fileReader.addEventListener('load', this.readerHandler);
  },
  beforeDestroy() {
    this.$store.unregisterModule('chatModule');
    fileReader.removeEventListener('load', this.readerHandler);
  }
}
const login = {
  name: 'login',
  template: `
  <div class="login">
    <h1>LOGIN</h1>
    <div>
      <label>User Name: </label>
      <input type="text" v-model='userName'>
    </div>
    <router-link to='/chat' @click.native='setName'>Next</router-link>
  </div>
  `,
  data() {
    return {
      name: 'anonymous',
      id: Math.random()
    }
  },
  computed: {
    userName: {
      get(){
        return this.name
      },
      set(val){
        if(!val) val = 'anonymous';
        this.name = val;
      }
    }
  },
  methods: {
    setName() {
      this.$store.commit('chatModule/SET_USERNAME', {
        name: this.name,
        id: this.id
      });
    }
  },
  beforeDestroy() {
    let date = new Date();
    fStore.collection('Message').add({
      'author': {
        'uid': this.id,
        'name': this.name,
        'photoURL': ''
      },
      'content': `${this.name} enter in chat-room`,
      'createTime': `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
      'system': true
    })
  }
}

const router = new VueRouter({
  routes: [{
      path: '/',
      component: login
    },
    {
      path: '/chat',
      component: chat
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
const store = new Vuex.Store({});
Vuex.Store.prototype.hasModule = function (module) {
  return this._modules.root._children[module] !== undefined;
}
const chatModule = function () {
  return {
    namespaced: true,
    state: {
      userName: null,
      userID: null
    },
    actions: {

    },
    mutations: {
      SET_USERNAME(state, {name,id}) {
        state.userName = name;
        state.userID = id;
      }
    }
  }
}
Vue.use(Vuefire.firestorePlugin)
new Vue({
  render: h => h(app),
  router,
  store
}).$mount('#app');